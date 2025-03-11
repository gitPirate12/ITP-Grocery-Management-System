const Suggestion = require("../models/SuggestionModel");

const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  return res.status(statusCode).json({
    message: error.message || "Server Error",
    ...(error.errors && { details: error.errors }),
  });
};

// Create a new suggestion
const createSuggestion = async (req, res) => {
  const { name, email, phone, description } = req.body;

  try {
    // Validation
    const requiredFields = ["name", "email", "phone", "description"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newSuggestion = new Suggestion({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      description: description.trim(),
    });

    const savedSuggestion = await newSuggestion.save();
    res.status(201).json({
      message: "Suggestion submitted successfully",
      data: savedSuggestion,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all suggestions
const getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find()
      .sort({ submittedDate: -1 })
      .select("-__v");

    res.status(200).json({
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get suggestion by ID
const getSuggestionById = async (req, res) => {
  try {
    const suggestion = await Suggestion.findOne({
      suggestionId: req.params.id,
    }).select("-__v");

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json(suggestion);
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a suggestion
const deleteSuggestion = async (req, res) => {
  try {
    const deletedSuggestion = await Suggestion.findOneAndDelete({
      suggestionId: req.params.id,
    });

    if (!deletedSuggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json({
      message: "Suggestion deleted successfully",
      data: deletedSuggestion,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update suggestion status
const updateSuggestionStatus = async (req, res) => {
  try {
    const validStatuses = ["PENDING", "REVIEWED", "IMPLEMENTED", "ARCHIVED"];

    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedSuggestion = await Suggestion.findOneAndUpdate(
      { suggestionId: req.params.id },
      { status: req.body.status },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedSuggestion) {
      return res.status(404).json({ message: "Suggestion not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      data: updatedSuggestion,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  createSuggestion,
  getAllSuggestions,
  getSuggestionById,
  deleteSuggestion,
  updateSuggestionStatus,
};
