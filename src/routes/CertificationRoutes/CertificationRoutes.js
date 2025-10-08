import express from "express";
import { createCertification,getAllCertification } from "../../controllers/certificationController/certificationController.js";
import upload from "../../config/cloudinaryConfig.js";

const router = express.Router();

router.post(
  "/create",
  upload.fields([
    { name: "attachments", maxCount: 10 },
    { name: "logo", maxCount: 1 },
  ]),
  createCertification
);

router.get("/get",getAllCertification)

export default router;
