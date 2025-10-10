import express from "express";
import {  getDashboardOverview } from "../../controllers/OverViewController/OverviewController.js";

const router = express.Router();

router.get("/dashboard", getDashboardOverview);

export default router;
