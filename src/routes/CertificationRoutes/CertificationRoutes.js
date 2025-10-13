import express from "express";
import upload from "../../config/cloudinaryConfig.js";
import {
  createCertification,
  getAllCertification,
  getCertificationById,
  updateCertification,
  deleteCertification,
  searchCertification,
  getCertificationSummary,
  getCertificationsByCompany,
  filterCertifications 
} from "../../controllers/certificationController/certificationController.js";

const router = express.Router();

// ✅ Create certification with attachments & logo
router.post(
  "/create",
  upload.fields([
    { name: "attachments", maxCount: 10 },
    { name: "logo", maxCount: 1 },
  ]),
  createCertification
);

// ✅ Get all certifications (with search, filters & pagination)
router.get("/get", getAllCertification);

// ✅ Get certification by ID
router.get("/get/:id", getCertificationById);

// ✅ Update certification by ID
router.put("/update/:id", updateCertification);

// ✅ Delete certification by ID
router.delete("/delete/:id", deleteCertification);

// ✅ Search by certificationNumber & companyName
router.get("/search", searchCertification);

// ✅ Certification summary (grouped by company)
router.get("/summary", getCertificationSummary);

// ✅ Get all certifications of a company
router.get("/company", getCertificationsByCompany);

// Filter all certification
router.get("/filter", filterCertifications);

export default router;
