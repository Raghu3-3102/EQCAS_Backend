import express from "express";
import {  getDashboardOverview,getYearlyCertificationStats,
    getCertificationStatsByPeriod ,getMonthlyCertificationStats,
    getTodayCertificationStats,getCompanyRegistrationsByMonth,
    getCurrentWeekCertificationStats } from "../../controllers/OverViewController/OverviewController.js";

const router = express.Router();

router.get("/dashboard", getDashboardOverview);
router.get("/dashboard/certifications/year/:year", getYearlyCertificationStats);
router.get("/certifications/stats", getCertificationStatsByPeriod);
router.get("/certifications/stats/monthly",getMonthlyCertificationStats)
router.get("/certifications/stats/today",getTodayCertificationStats )
router.get("/compoy/regitration",getCompanyRegistrationsByMonth)
router.get("/certifications/stats/weekly",getCurrentWeekCertificationStats)

export default router;
