import express from "express";
import {  getDashboardOverview,getYearlyCertificationStats,
    getCertificationStatsByPeriod ,getMonthlyCertificationStats,
    getTodayCertificationStats,getCompanyRegistrationsByMonth } from "../../controllers/OverViewController/OverviewController.js";

const router = express.Router();

router.get("/dashboard", getDashboardOverview);
router.get("/dashboard/certifications/year/:year", getYearlyCertificationStats);
router.get("/certifications/stats", getCertificationStatsByPeriod);
router.get("/certifications/stats/monthly",getMonthlyCertificationStats)
router.get("/certifications/stats/today",getTodayCertificationStats )
router.get("/compoy/regitration",getCompanyRegistrationsByMonth)

export default router;
