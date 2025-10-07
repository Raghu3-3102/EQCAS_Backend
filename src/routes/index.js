import express from "express";
import adminRoutes from "./adminRoutes/adminRoutes.js";
import agentRoutes from "./AgentRoutes/AgentRoutes.js";
// import userRoutes from "./userRoutes.js"; // if you have user module

const router = express.Router();

router.use("/admin", adminRoutes);
router.use("/agents", agentRoutes);
// router.use("/users", userRoutes); // Add user module later

export default router;
