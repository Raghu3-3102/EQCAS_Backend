import express from "express";
import {
    createAgent,
    getAllAgents,
    getAgentById

    
} from "../../controllers/AgentController/AgentController.js";

import {authMiddleware} from "../../middleware/authMiddleware.js"

const router = express.Router();

// Agent Routes
router.post("/",authMiddleware, createAgent);
router.get("/",authMiddleware, getAllAgents);
router.get("/:id",authMiddleware, getAgentById);

export default router;