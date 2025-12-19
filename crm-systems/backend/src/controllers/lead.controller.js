import Lead from "../models/Lead.js";
import {
  createLeadSchema,
  updateLeadSchema,
} from "../validators/lead.schema.js";

/**
 * CREATE lead
 */
export const createLead = async (req, res) => {
  try {
    const data = createLeadSchema.parse(req.body);

    const lead = await Lead.create({
      ...data,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    console.log(error)
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/**
 * READ all leads
 */
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ leads });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * READ single lead
 */
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ lead });
  } catch (error) {
    res.status(400).json({ message: "Invalid lead ID" });
  }
};

/**
 * UPDATE lead
 */
export const updateLead = async (req, res) => {
  try {
    const data = updateLeadSchema.parse(req.body);

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    Object.assign(lead, data);
    await lead.save();

    res.status(200).json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE lead
 */
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid lead ID" });
  }
};
