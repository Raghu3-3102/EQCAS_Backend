import express from "express";
import {
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  filterCompanies
} from "../../controllers/ComponyController/ComponyController.js";
import { authMiddleware } from "../../middleware/AuthMiddilewereAll.js";
import { permissionMiddleware } from "../../middleware/PermissionMidilewere.js";

const router = express.Router();

// Routes
router.get("/", authMiddleware ,permissionMiddleware("companies"),getAllCompanies);       
router.get("/filter",authMiddleware ,permissionMiddleware("companies"),filterCompanies)   // Get all companies
router.get("/:id",authMiddleware ,permissionMiddleware("companies"), getCompanyById);       // Get company by ID
router.put("/:id",authMiddleware ,permissionMiddleware("companies"), updateCompany);        // Update company
router.delete("/:id",authMiddleware ,permissionMiddleware("companies"), deleteCompany);     // Delete company


export default router;
