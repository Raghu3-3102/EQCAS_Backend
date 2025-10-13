import express from "express";
import {  ExpiredCertification } from "../../controllers/ExpiredCertificationController/ExpiredCertificationController.js";


const router = express.Router();


router.get("/",ExpiredCertification)

export default router;