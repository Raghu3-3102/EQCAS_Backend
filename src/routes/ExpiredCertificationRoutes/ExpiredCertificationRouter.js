import express from "express";
import { ExpiringCertifications,filterExpiringCertifications } from "../../controllers/ExpiredCertificationController/ExpiredCertificationController.js";


const router = express.Router();


router.get("/",ExpiringCertifications)
router.get("/filter",filterExpiringCertifications)

export default router;