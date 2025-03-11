const express = require("express");
const router = express.Router();

const {
  createSuggestion,
  getAllSuggestions,
  getSuggestionById,
  deleteSuggestion,
  updateSuggestionStatus,
} = require("../controllers/suggestionController");

// Suggestion routes
router.post("/", createSuggestion);
router.get("/", getAllSuggestions);
router.get("/:id", getSuggestionById);
router.delete("/:id", deleteSuggestion);
router.put("/:id/status", updateSuggestionStatus);

module.exports = router;
