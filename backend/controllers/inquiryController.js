const Inquiry = require("../models/InquiryModel");

const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  return res.status(statusCode).json({
    message: error.message || "Server Error",
    ...(error.errors && { details: error.errors }),
  });
};

// Create a new inquiry
const createInquiry = async (req, res) => {
  const { name, email, phone, description, type } = req.body;

  try {
    // Basic validation
    const requiredFields = ["name", "email", "phone", "description"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newInquiry = new Inquiry({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      description: description.trim(),
      type: type || "GENERAL",
    });

    await newInquiry.save();
    res.status(201).json({
      message: "Inquiry submitted successfully",
      data: newInquiry,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Retrieve all inquiries
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .sort({ submittedDate: -1 })
      .select("-__v");

    res.status(200).json({
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Retrieve a single inquiry by its ID
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findOne({ inquiryId: req.params.id }).select(
      "-__v"
    );

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json(inquiry);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete an inquiry by its ID
const deleteInquiry = async (req, res) => {
  try {
    const deletedInquiry = await Inquiry.findOneAndDelete({
      inquiryId: req.params.id,
    });

    if (!deletedInquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({
      message: "Inquiry deleted successfully",
      data: deletedInquiry,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update the status of an inquiry
const updateInquiryStatus = async (req, res) => {
  try {
    const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedInquiry = await Inquiry.findOneAndUpdate(
      { inquiryId: req.params.id },
      { status: req.body.status },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedInquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      data: updatedInquiry,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  deleteInquiry,
  updateInquiryStatus,
};
