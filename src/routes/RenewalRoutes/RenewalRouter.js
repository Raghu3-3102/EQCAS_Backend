import {setRenewalDates,getRenewalHistory,getAllRenewalHistories,getRenewalById,deleteRenewalHistory} from "../../controllers/renewalController/renewalController.js";
import express from "express";

const router = express.Router();

router.post("/", setRenewalDates);
router.get("/certification/:certificationId", getRenewalHistory);
router.get("/", getAllRenewalHistories);
router.get("/:id", getRenewalById);
router.delete("/:id", deleteRenewalHistory);



export default router;  