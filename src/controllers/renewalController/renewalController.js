import PastCycleRecord from "../../models/PastRSEdate/PastRSEdate.js";
import Certification from "../../models/CertificationModel/CertificationModel.js";



// Renewal Controller Logic Here
export const setRenewalDates = async (req, res) => {
    try {
        const { certificationId,cycleNumber, dateOfRegistration, certificationExpiryDate, firstSurveillanceAudit,firstSurveillanceStatus,firstSurveillanceNotes, secondSurveillanceAudit,secondSurveillanceStatus,secondSurveillanceNotes } = req.body;
        // Find the certification by ID
        const certification = await Certification.findById(certificationId);
        if (!certification) {
            return res.status(404).json({ message: "Certification not found" });
        }
        // Create a new PastRSEdate document
        
        const firstsurrvilance = {
            date: certification.firstSurveillanceAudit,
            status: certification.firstSurveillanceStatus,
            notes: certification.firstSurveillanceNotes
        };

        const secondsurrvilance = {
            date: certification.secondSurveillanceAudit,
            status: certification.secondSurveillanceStatus,
            notes: certification.secondSurveillanceNotes
        };

        const pastRSEdate = new PastCycleRecord({
            cycleNumber: cycleNumber - 1, // Assuming this is the first cycle
            certificationId: certification._id,
            registrationDateBefore:certification.dateOfRegistration,
            expiryDateBefore:certification.certificationExpiryDate,
            firstSurveillanceHistory : firstsurrvilance,
            secondSurveillanceHistory: secondsurrvilance
        });
        await pastRSEdate.save();

        // Update the certification with new dates
        certification.dateOfRegistration = dateOfRegistration;
        certification.certificationExpiryDate = certificationExpiryDate;
        certification.firstSurveillanceAudit = firstSurveillanceAudit;
        certification.firstSurveillanceStatus = firstSurveillanceStatus;
        certification.firstSurveillanceNotes = firstSurveillanceNotes;
        certification.secondSurveillanceAudit = secondSurveillanceAudit;
        certification.secondSurveillanceStatus = secondSurveillanceStatus;
        certification.secondSurveillanceNotes = secondSurveillanceNotes;
        certification.RenewalStatus="Renewed";
        await certification.save();

        res.status(200).json({ message: "Renewal dates set successfully", certification });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }
}

export const getRenewalHistory = async (req, res) => {
  try {
    const { certificationId } = req.params;

    // Fetch certification details
    const certification = await Certification.findById(certificationId).populate("assignedAgent");

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
      });
    }

    // Fetch past renewal history
    const history = await PastCycleRecord.find({ certificationId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      certification,   // ✅ Included certification details in response
      history,         // ✅ Included renewal history
    });

  } catch (error) {
    console.error("Error in getRenewalHistory:", error);
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getAllRenewalHistories = async (req, res) => {
  try {
    const histories = await PastCycleRecord.find().sort({ createdAt: -1 });

    // Attach certification details with each history
    const updatedHistories = await Promise.all(
      histories.map(async (record) => {
        const certification = await Certification.findById(record.certificationId).populate("assignedAgent")
         

        return {
          ...record.toObject(),
          certification,
        };
      })
    );

    res.status(200).json({
      success: true,
      histories: updatedHistories,
    });

  } catch (error) {
    console.error("Error in getAllRenewalHistories:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getRenewalById = async (req, res) => {  
    try {
        const { id } = req.params;  
        const history = await PastCycleRecord.findById(id);
        if (!history) {
            return res.status(404).json({ message: "Renewal history not found" });
        }
        res.status(200).json({ history });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
}   

export const deleteRenewalHistory = async (req, res) => {  
    try {
        const { id } = req.params;
        const history = await PastCycleRecord.findByIdAndDelete(id);
        if (!history) {
            return res.status(404).json({ message: "Renewal history not found" });
        }   
        res.status(200).json({ message: "Renewal history deleted successfully" });
    }   
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
}







