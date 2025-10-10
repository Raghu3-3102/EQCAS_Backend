import Company from "../../models/componyModel/ComponyModel.js";

// Get all companies
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("certificationIds");
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id).populate("certificationIds");
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const company = await Company.findByIdAndUpdate(id, updatedData, { new: true });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
