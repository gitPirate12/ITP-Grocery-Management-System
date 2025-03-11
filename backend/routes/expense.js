const express = require("express");
const router = express.Router();

const {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getExpenseById,
} = require("../controllers/expenseController");

// Expense routes
router.post("/", addExpense);
router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
