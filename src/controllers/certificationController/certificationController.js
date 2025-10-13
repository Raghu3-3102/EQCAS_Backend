
// ✅ Create Certification Controller
import Agent from "../../models/AgentModel/AgentModel.js";
import Certification from "../../models/CertificationModel/CertificationModel.js";
import Company from "../../models/componyModel/ComponyModel.js";

export const createCertification = async (req, res) => {
  try {
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
      firstSurveillanceStatus,
      firstSurveillanceNotes,
      secondSurveillanceStatus,
      secondSurveillanceNotes
    } = req.body;

    

    // ✅ Handle uploaded attachments
    const attachments =
      req.files?.attachments?.map((file) => ({
        fileName: file.originalname,
        fileUrl: file.path,
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
      firstSurveillanceStatus,
      firstSurveillanceNotes,
      secondSurveillanceStatus,
      secondSurveillanceNotes
    });

    const savedCertificate = await newCertification.save();

    // ✅ Update Agent data
    const agentData = await Agent.findById(assignedAgent);
    if (agentData) {
      agentData.companyCount = (agentData.companyCount || 0) + 1;
      agentData.companyIds = [...(agentData.companyIds || []), savedCertificate._id];
      await agentData.save();
    }

    // ✅ Create or Update Company data
    let existingCompany = await Company.findOne({ companyName });

    if (existingCompany) {
      // Update existing company
      existingCompany.certificationIds.push(savedCertificate._id);
      existingCompany.certificationCount = existingCompany.certificationIds.length;
      existingCompany.address = address || existingCompany.address;
      existingCompany.logo = logo || existingCompany.logo;
      existingCompany.clientName = clientName || existingCompany.clientName;
      await existingCompany.save();
    } else {
      // Create new company
      const newCompany = new Company({
        companyName,
        address,
        logo,
        status: "Active",
        certificationCount: 1,
        certificationIds: [savedCertificate._id],
        clientName,
      });
      await newCompany.save();
    }

    res.status(201).json({
      success: true,
      message: "Certification and Company created/updated successfully!",
      certification: savedCertificate,
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

export const getCertificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const certification = await Certification.findById(id).populate("assignedAgent");

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certification fetched successfully!",
      certification,
    });
  } catch (error) {
    console.error("Error fetching certification by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching certification by ID",
      error: error.message,
    });
  }
};


export const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCertification = await Certification.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedCertification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certification updated successfully!",
      certification: updatedCertification,
    });
  } catch (error) {
    console.error("Error updating certification:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating certification",
      error: error.message,
    });
  }
};


export const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Find the certification first
    const certification = await Certification.findById(id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    // ✅ Get assigned agent ID (if any)
    const agentId = certification.assignedAgent;

    // ✅ Delete the certification
    await Certification.findByIdAndDelete(id);

    // ✅ Update agent data (decrease count & remove companyId)
    if (agentId) {
      const agent = await Agent.findById(agentId);
      if (agent) {
        agent.companyCount = Math.max(0, agent.companyCount - 1); // prevent negative count
        agent.companyIds = agent.companyIds.filter(
          (companyId) => companyId.toString() !== id
        );
        await agent.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Certification deleted successfully and agent updated!",
    });
  } catch (error) {
    console.error("Error deleting certification:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting certification",
      error: error.message,
    });
  }
};

 



// ✅ Search Certification by certificationNumber and companyName
export const searchCertification = async (req, res) => {
  try {
    const { certificationNumber, companyName } = req.query;

    // Check if both fields are provided
    if (!certificationNumber || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Both certificationNumber and companyName are required.",
      });
    }

    // ✅ Search for a match (case-insensitive for companyName)
    const certification = await Certification.findOne({
      certificationNumber,
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "No certification found matching both fields.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certification found successfully!",
      certification,
    });
  } catch (error) {
    console.error("Error searching certification:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching certification.",
      error: error.message,
    });
  }
};



// ✅ Get certification summary: companyName, certification count, and status
export const getCertificationSummary = async (req, res) => {
  try {
    // Group certifications by companyName
    const summary = await Certification.aggregate([
      {
        $group: {
          _id: "$companyName",
          certificationCount: { $sum: 1 },
          clientNames: { $addToSet: "$clientName" }, // collect unique client names
          status: { $first: "$status" }, // get first status
        },
      },
      {
        $project: {
          _id: 0,
          companyName: "$_id",
          certificationCount: 1,
          clientNames: 1,
          status: 1,
        },
      },
    ]);

    if (!summary.length) {
      return res.status(404).json({
        success: false,
        message: "No certifications found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Certification summary fetched successfully!",
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching certification summary:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching certification summary.",
      error: error.message,
    });
  }
};



// ✅ Get all certifications of a company (with agent info & selected fields)
export const getCertificationsByCompany = async (req, res) => {
  try {
    const { companyName } = req.query;

    if (!companyName) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    // Find all certifications matching company name (case-insensitive)
    const certifications = await Certification.find({
      companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    })
      .select(
        "companyName certificationNumber standard dateOfRegistration certificationExpiryDate status attachments logo assignedAgent"
      )
      .sort({ createdAt: -1 });

    if (!certifications.length) {
      return res.status(404).json({
        success: false,
        message: `No certifications found for company: ${companyName}`,
      });
    }

    // Add agent info and include attachments & logo as-is
    const certificationsWithAgent = await Promise.all(
      certifications.map(async (cert) => {
        let agentInfo = null;
        if (cert.assignedAgent) {
          agentInfo = await Agent.findById(cert.assignedAgent)
            .select("agentName agentEmail agentNumber")
            .lean();
        }

        return {
          companyName: cert.companyName,
          certificationNumber: cert.certificationNumber,
          standard: cert.standard,
          dateOfRegistration: cert.dateOfRegistration,
          certificationExpiryDate: cert.certificationExpiryDate,
          status: cert.status,
          logo: cert.logo || null,          // always include logo
          attachments: cert.attachments || [], // send attachments exactly as stored
          assignedAgentInfo: agentInfo || {},  // send agent info or empty object
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Certifications fetched successfully!",
      total: certificationsWithAgent.length,
      companyName,
      certifications: certificationsWithAgent,
    });
  } catch (error) {
    console.error("Error fetching certifications by company:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching certifications by company",
      error: error.message,
    });
  }
};



export const filterCertifications = async (req, res) => {
  try {
    let {
      search = "",
      status = "All",
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // ✅ Search filter
    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { companyName: regex },
        { scopeOfWork: regex },
        { clientName: regex },
        { standard: regex },
        { email: regex },
        { certificationNumber: regex },
      ];
    }

    // ✅ Status filter
    if (status && status !== "All") {
      query.status = status;
    }

    // ✅ Date range filter (based on dateOfRegistration)
    if (fromDate && toDate) {
      query.dateOfRegistration = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    } else if (fromDate) {
      query.dateOfRegistration = { $gte: new Date(fromDate) };
    } else if (toDate) {
      query.dateOfRegistration = { $lte: new Date(toDate) };
    }

    // ✅ Fetch filtered data with pagination
    const certifications = await Certification.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // ✅ Attach agent info to each certification
    const certificationsWithAgent = await Promise.all(
      certifications.map(async (cert) => {
        let agentInfo = null;
        if (cert.assignedAgent) {
          agentInfo = await Agent.findById(cert.assignedAgent).lean();
        }
        return {
          ...cert.toObject(),
          assignedAgentInfo: agentInfo,
        };
      })
    );

    // ✅ Count total
    const total = await Certification.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Filtered certifications fetched successfully",
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      certifications: certificationsWithAgent,
    });
  } catch (error) {
    console.error("Error filtering certifications:", error);
    res.status(500).json({
      success: false,
      message: "Server error while filtering certifications",
      error: error.message,
    });
  }
};









