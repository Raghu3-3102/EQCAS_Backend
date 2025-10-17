import express from "express";
import {  getDashboardOverview,getYearlyCertificationStats,
    getCertificationStatsByPeriod ,getMonthlyCertificationStats,
    getTodayCertificationStats,getCompanyRegistrationsByMonth,
    getCurrentWeekCertificationStats } from "../../controllers/OverViewController/OverviewController.js";

import { permissionMiddleware } from "../../middleware/PermissionMidilewere.js";
import { authMiddleware } from "../../middleware/AuthMiddilewereAll.js";
const router = express.Router();

router.get("/dashboard",authMiddleware,permissionMiddleware("overview"), getDashboardOverview);
router.get("/dashboard/certifications/year/:year",authMiddleware,permissionMiddleware("overview"), getYearlyCertificationStats);
router.get("/certifications/stats",authMiddleware,permissionMiddleware("overview"), getCertificationStatsByPeriod);
router.get("/certifications/stats/monthly",authMiddleware.permissionMiddleware("overview"),getMonthlyCertificationStats)
router.get("/certifications/stats/today",authMiddleware, permissionMiddleware("overview"),getTodayCertificationStats )
router.get("/compoy/regitration",authMiddleware,permissionMiddleware("overview"),getCompanyRegistrationsByMonth)
router.get("/certifications/stats/weekly",authMiddleware,permissionMiddleware("overview"),getCurrentWeekCertificationStats)

export default router;
