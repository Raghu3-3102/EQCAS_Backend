import express from "express";
import {  firstSurveillance,filterFirstSurveillance } from "../../controllers/FirstSurvellianceauditController/FirstSurvellianceauditController.js";


const router = express.Router();


router.get("/",firstSurveillance)
router.get("/filter",filterFirstSurveillance)

export default router;