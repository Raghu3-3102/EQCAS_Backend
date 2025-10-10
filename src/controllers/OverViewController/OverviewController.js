import Certification from "../../models/CertificationModel/CertificationModel.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Fetch all certifications
    const allCerts = await Certification.find();

    // Unique companies
    const uniqueCompanies = new Set(allCerts.map(c => c.companyName));
    const totalCompanies = uniqueCompanies.size;

    // Total certifications
    const totalCertifications = allCerts.length;

    // Active and expired certifications
    const activeCertifications = allCerts.filter(c => new Date(c.certificationExpiryDate) > today).length;
    const expiredCertifications = allCerts.filter(c => new Date(c.certificationExpiryDate) <= today).length;

    // 1st & 2nd surveillance due
    const firstSurveillanceDue = allCerts.filter(c => {
      const date = new Date(c.firstSurveillanceAudit);
      return date <= today && new Date(c.certificationExpiryDate) > today;
    }).length;

    const secondSurveillanceDue = allCerts.filter(c => {
      const date = new Date(c.secondSurveillanceAudit);
      return date <= today && new Date(c.certificationExpiryDate) > today;
    }).length;

    // Compare with last month for growth
    const lastMonthCerts = allCerts.filter(c => new Date(c.dateOfRegistration) >= lastMonth).length;
    const growthCert = ((totalCertifications - lastMonthCerts) / (lastMonthCerts || 1)) * 100;

    // Chart data for frontend (last 30 days)
    const chartData = Array.from({ length: 30 }, (_, i) => {
      const day = new Date();
      day.setDate(today.getDate() - i);

      const dayCerts = allCerts.filter(c => new Date(c.dateOfRegistration).toDateString() === day.toDateString()).length;
      const expired = allCerts.filter(c => new Date(c.certificationExpiryDate).toDateString() === day.toDateString()).length;

      return {
        date: day.toISOString().split('T')[0],
        totalCertifications: dayCerts,
        expiredCertifications: expired
      };
    }).reverse();

    res.status(200).json({
      summary: {
        totalCompanies,
        totalCertifications,
        activeCertifications,
        expiredCertifications,
        firstSurveillanceDue,
        secondSurveillanceDue,
        growthFromLastMonth: growthCert.toFixed(2)
      },
      chartData
    });

  } catch (error) {
    console.error("Error in getDashboardOverview:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
