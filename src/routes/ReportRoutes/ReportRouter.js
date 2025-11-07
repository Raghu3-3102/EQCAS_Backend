import express from "express";

import {
  getExpiredReports,
  getExpiredReportsByMonth,
  getExpiredReportsByWeek,
  getExpiredReportsByDay,

  getFirstSurveillanceDueReports,
  getFirstSurveillanceDueReportsByMonth,
  getFirstSurveillanceDueReportsByWeek,
  getFirstSurveillanceDueReportsByDay,

  secondSurveillanceReport,
  getSecondSurveillanceDueReportsByMonth,
  getSecondSurveillanceDueReportsByWeek,
  getSecondSurveillanceDueReportsByDay,


  OverViewReportRenawalAudit,
  getMonthlyRenewalCount,
  getWeeklyRenewalCount,
  getDailyRenewalCount
} from "../../controllers/ReportController/ReportController.js";

const router = express.Router();

/* ------------------------ Expired Certification Reports ------------------------ */
router.get("/expired", getExpiredReports);
router.get("/expired/monthly", getExpiredReportsByMonth);
router.get("/expired/weekly", getExpiredReportsByWeek);
router.get("/expired/daily", getExpiredReportsByDay);

/* --------------------- First Surveillance Due Reports -------------------------- */
router.get("/first", getFirstSurveillanceDueReports);
router.get("/first/monthly", getFirstSurveillanceDueReportsByMonth);
router.get("/first/weekly", getFirstSurveillanceDueReportsByWeek);
router.get("/first/daily", getFirstSurveillanceDueReportsByDay);

/* -------------------- Second Surveillance Due Reports -------------------------- */
router.get("/second", secondSurveillanceReport);
router.get("/second/monthly", getSecondSurveillanceDueReportsByMonth);
router.get("/second/weekly", getSecondSurveillanceDueReportsByWeek);
router.get("/second/daily", getSecondSurveillanceDueReportsByDay);

/* -------------------- Renewal Audit Overview Reports -------------------------- */
router.get("/renewal-overview", OverViewReportRenawalAudit);
router.get("/renewal-overview/monthly", getMonthlyRenewalCount);
router.get("/renewal-overview/weekly", getWeeklyRenewalCount);
router.get("/renewal-overview/daily", getDailyRenewalCount);

export default router;
