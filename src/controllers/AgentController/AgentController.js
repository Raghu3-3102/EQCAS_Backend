import Agent from "../../models/AgentModel/AgentModel.js";


export const createAgent = async (req, res) => {
  try {
    const { agentName, agentEmail, agentNumber } = req.body;    
    const existingAgent = await Agent.findOne({ agentEmail });  
    if (existingAgent) {    
        return res.status(400).json({ message: "Agent with this email already exists", success: false });   
    }

    const agent = new Agent({ agentName, agentEmail, agentNumber });
    await agent.save();
    res.status(201).json({ message: "Agent created successfully", agent, success: true });
  } catch (error) {
    console.error("Error in createAgent:", error);
    res.status(500).json({ message: "Server Error", success: false });
  } 
};

export const getAllAgents = async (req, res) => {
  try {
    // Get page & limit from query params, or use defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate how many to skip
    const skip = (page - 1) * limit;

    // Fetch paginated agents
    const agents = await Agent.find().skip(skip).limit(limit);

    // Count total documents
    const totalAgents = await Agent.countDocuments();

    res.status(200).json({
      success: true,
      agents,
      currentPage: page,
      totalPages: Math.ceil(totalAgents / limit),
      totalAgents,
    });
  } catch (error) {
    console.error("Error in getAllAgents:", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};


export const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;  
    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found", success: false });
    }
    res.status(200).json({ agent, success: true });
  }
    catch (error) {
    console.error("Error in getAgentById:", error);
    res.status(500).json({ message: "Server Error", success: false });
  }
};

