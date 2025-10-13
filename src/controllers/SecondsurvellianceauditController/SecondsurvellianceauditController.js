import Certification from "../../models/CertificationModel/CertificationModel.js";

export const SecondSurveillance = async (req, res) => {
  try {
    const today = new Date();
    const next60Days = new Date();
    next60Days.setDate(today.getDate() + 60);

    // ✅ Find certifications whose first surveillance date is within the next 60 days
    const upcomingFirstSurveillance = await Certification.find({
      secondSurveillanceAudit: {
        $gte: today,
        $lte: next60Days,
      },
    });

    // ✅ Add remaining days for each certification
    const certificationsWithRemainingDays = upcomingFirstSurveillance.map((cert) => {
      const auditDate = new Date(cert.firstSurveillanceAudit);
      const diffTime = auditDate - today; // difference in milliseconds
      const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // convert ms → days
      return {
        ...cert._doc,
        remainingDays,
      };
    });

    res.status(200).json({
      success: true,
      message: "Certifications with first surveillance due within the next 60 days",
      total: certificationsWithRemainingDays.length,
      certifications: certificationsWithRemainingDays,
    });
  } catch (error) {
    console.error("Error fetching first surveillance data:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching first surveillance data",
      error: error.message,
    });
  }
};

