import express from "express";
import {
    createAgent,
    getAllAgents,
    getAgentById,
    updateAgent,
    deleteAgent

    
} from "../../controllers/AgentController/AgentController.js";

import {authMiddleware} from "../../middleware/authMiddleware.js"

const router = express.Router();

// Agent Routes
router.post("/",authMiddleware, createAgent);
router.get("/",authMiddleware, getAllAgents);
router.get("/:id",authMiddleware, getAgentById);
router.put("/:id",updateAgent)
router.delete("/:id",deleteAgent)

export default router;