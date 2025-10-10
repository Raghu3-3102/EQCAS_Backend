import express from "express";
import {
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from "../../controllers/ComponyController/ComponyController.js";

const router = express.Router();

// Routes
router.get("/", getAllCompanies);          // Get all companies
router.get("/:id", getCompanyById);       // Get company by ID
router.put("/:id", updateCompany);        // Update company
router.delete("/:id", deleteCompany);     // Delete company

export default router;
