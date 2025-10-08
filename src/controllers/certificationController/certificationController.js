import Certification from "../../models/CertificationModel/CertificationModel.js";
import Agent from "../../models/AgentModel/AgentModel.js";
// ✅ Create Certification Controller
export const createCertification = async (req, res) => {
  try {
    // Extract data from form body
    const {
      companyName,
      address,
      dateOfRegistration,
      certificationExpiryDate,
      scopeOfWork,
      clientName,
      standard,
      email,
      firstSurveillanceAudit,
      secondSurveillanceAudit,
      certificationNumber,
      status,
      assignedAgent,
    } = req.body;

    console.log(req.body)

    // ✅ Handle uploaded attachments
    const attachments = req.files?.attachments?.map(file => ({
       fileName: file.originalname,
       fileUrl: file.path, // Cloudinary gives correct URL with extension
       fileType: file.mimetype,
    })) || [];


    // ✅ Handle uploaded logo
    const logo = req.files?.logo?.[0]?.path || null;

    // ✅ Create and save Certification
    const newCertification = new Certification({
      companyName,
      address,
      dateOfRegistration,
      certificationExpiryDate,
      scopeOfWork,
      clientName,
      standard,
      email,
      firstSurveillanceAudit,
      secondSurveillanceAudit,
      certificationNumber,
      status,
      assignedAgent,
      attachments,
      logo,
    });

    const savedCertificate = await newCertification.save();

    // const agentId =  savedCertificate.assignedAgent

    const agentData = await Agent.findById(assignedAgent)

    let count = agentData.companyCount
    agentData.companyCount =  count + 1;
    let len = agentData.companyIds.length
    agentData.companyIds[len]  = savedCertificate._id

    await agentData.save()

    res.status(201).json({
      success: true,
      message: "Certification created successfully!",
      certification: newCertification,
    });
  } catch (error) {
    console.error("Error creating certification:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating certification",
      error: error.message,
    });
  }
};



// ✅ Get all certifications with assignedAgent details and pagination

export const getAllCertification = async (req, res) => {
  try {
    // Pagination parameters
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch certifications with pagination
    const certifications = await Certification.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    // Attach agent info for each certification
    const certificationsWithAgent = await Promise.all(
      certifications.map(async cert => {
        let agentInfo = null;
        if (cert.assignedAgent) {
          agentInfo = await Agent.findById(cert.assignedAgent).lean();
        }
        return {
          ...cert.toObject(),
          assignedAgentInfo: agentInfo
        };
      })
    );

    // Total count for pagination
    const total = await Certification.countDocuments();

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      certifications: certificationsWithAgent,
    });

  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching certifications",
      error: error.message,
    });
  }
};


