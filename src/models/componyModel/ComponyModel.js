import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    address: {
      type: String,
      trim: true
    },
    logo: {
      type: String, // store URL or filename of the logo
      trim: true
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active"
    },
    certificationCount: {
      type: Number,
      default: 0
    },
    certificationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certification"
      }
    ],
    clientName: {
      type: String,
      trim: true
    },
    companyEmail: {
      type: String,
      trim: true,
      required: false
    },
    companyPhoneNumber: {
      type: String,
      trim: true,
      required: false
    },
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
