import express from "express";
import {  firstSurveillance } from "../../controllers/FirstSurvellianceauditController/FirstSurvellianceauditController.js";


const router = express.Router();


router.get("/",firstSurveillance)

export default router;