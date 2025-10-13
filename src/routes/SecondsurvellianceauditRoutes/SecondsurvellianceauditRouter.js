import express from "express";
import {  SecondSurveillance } from "../../controllers/SecondsurvellianceauditController/SecondsurvellianceauditController.js";


const router = express.Router();


router.get("/",SecondSurveillance)

export default router;