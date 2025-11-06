import express from "express";
import adminRoutes from "./adminRoutes/adminRoutes.js";
import agentRoutes from "./AgentRoutes/AgentRoutes.js";
import CertificationRoutes from "./CertificationRoutes/CertificationRoutes.js"
import OverViewRoutes from "./OverViewRoutes/OverViewRouter.js"
import ComponyRoutes from "./ComponyRoutes/ComponyRoutes.js"
import firstSurveillance from "./FirstSurveillanceRoutes/FirstSurveillanceRoutes.js"
import SecondSurveillance from "./SecondsurvellianceauditRoutes/SecondsurvellianceauditRouter.js"
import ExpiredSurveillance from "./ExpiredCertificationRoutes/ExpiredCertificationRouter.js"
import userRoutes from "./UserRoutes/UserRouter.js";
import authAll from "./AuthenticationRoutes/AuthenticationRouter.js"
import individualCertificationRoutes from "./individualCertificationRoutes/individualCertificationRouter.js";
import profilerouter from "./ProfileRoutes/ProfileRouter.js"
import RenewalRouter from "./RenewalRoutes/RenewalRouter.js"
import ReportRouter from "./ReportRoutes/ReportRouter.js";
// import userRoutes from "./userRoutes.js"; // if you have user module

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/agents", agentRoutes);
router.use("/Certification",CertificationRoutes)
router.use("/overview",OverViewRoutes)
router.use("/compony",ComponyRoutes)
router.use("/firstSurveillance",firstSurveillance)
router.use("/SecondSurveillance",SecondSurveillance)
router.use("/ExpiredSurveillance",ExpiredSurveillance)
router.use("/users", userRoutes);
router.use("/auth",authAll)
router.use("/individualCertification",individualCertificationRoutes)
router.use("/profile",profilerouter)
router.use("/renewal",RenewalRouter)
router.use("/reports",ReportRouter)

// router.use("/users", userRoutes); // Add user module later

export default router;
