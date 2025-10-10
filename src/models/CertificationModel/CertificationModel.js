import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  dateOfRegistration: { type: Date, required: true },
  certificationExpiryDate: { type: Date, required: true },
  scopeOfWork: { type: String },
  clientName: { type: String },
  standard: { type: String },
  email: { type: String },

  firstSurveillanceAudit: { type: Date },
  firstSurveillanceStatus: { 
    type: String, 
    enum: ["Completed", "Pending", "Yet to be completed"], 
    default: "Yet to be completed"
  },
  firstSurveillanceNotes: { type: String, default: "" }, // Notes by auditor

  secondSurveillanceAudit: { type: Date },
  secondSurveillanceStatus: { 
    type: String, 
    enum: ["Completed", "Pending", "Yet to be completed"], 
    default: "Yet to be completed"
  },
  secondSurveillanceNotes: { type: String, default: "" }, // Notes by auditor

  certificationNumber: { type: String },
  status: { type: String, enum: ["Active", "Inactive", "Pending"], default: "Pending" },

  attachments: [
    {
      fileName: { type: String },
      fileUrl: { type: String },
      fileType: { type: String },
    },
  ],

  logo: {
    type: String,
  },

  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
  },
}, { timestamps: true });

const Certification = mongoose.model("Certification", certificationSchema);
export default Certification;
