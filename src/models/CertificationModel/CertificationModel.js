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
  secondSurveillanceAudit: { type: Date },
  certificationNumber: { type: String },
  status: { type: String, enum: ["Active", "Inactive", "Pending"], default: "Pending" },

  // Multiple document uploads (PDF, Word, etc.)
  attachments: [
    {
      fileName: { type: String },
      fileUrl: { type: String }, // Store the path or cloud URL
      fileType: { type: String },
    },
  ],

  // Company logo (image)
  logo: {
    type: String, // URL or file path
  },

  // Assigned Agent
  assignedAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent", // reference to Agent model
  },
}, { timestamps: true });

const Certification = mongoose.model("Certification", certificationSchema);
export default Certification;
