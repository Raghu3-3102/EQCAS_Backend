import mongoose from "mongoose";

const pastCycleSchema = new mongoose.Schema({
  cycleNumber: { type: Number, required: true }, // Cycle-1, Cycle-2, Cycle-3...
 certificationId: { type: mongoose.Schema.Types.ObjectId, ref: "Certification", required: true },
  registrationDateBefore: { type: Date, required: true },
  expiryDateBefore: { type: Date, required: true },

  firstSurveillanceHistory: {
    date: { type: Date },
    status: { type: String, enum: ["Completed", "Pending"], default: "Completed" },
    notes: { type: String }
  },

  secondSurveillanceHistory: {
    date: { type: Date },
    status: { type: String, enum: ["Completed", "Pending"], default: "Completed" },
    notes: { type: String }
  }
});

const PastCycleRecord = mongoose.model("PastCycleRecord", pastCycleSchema);
export default PastCycleRecord;
