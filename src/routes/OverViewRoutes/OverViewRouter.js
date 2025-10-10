import express from "express";
import {  getDashboardOverview,getYearlyCertificationStats,
    getCertificationStatsByPeriod ,getMonthlyCertificationStats,getTodayCertificationStats } from "../../controllers/OverViewController/OverviewController.js";

const router = express.Router();

router.get("/dashboard", getDashboardOverview);
router.get("/dashboard/certifications/year/:year", getYearlyCertificationStats);
router.get("/certifications/stats", getCertificationStatsByPeriod);
router.get("/certifications/stats/monthly",getMonthlyCertificationStats)
router.get("/certifications/stats/today",getTodayCertificationStats )

export default router;
