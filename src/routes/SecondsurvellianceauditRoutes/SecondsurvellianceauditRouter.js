import express from "express";
import {  SecondSurveillance ,filterSecondSurveillance} from "../../controllers/SecondsurvellianceauditController/SecondsurvellianceauditController.js";


const router = express.Router();


router.get("/",SecondSurveillance)
router.get("/filter",filterSecondSurveillance)

export default router;