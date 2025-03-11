const express = require("express");
const router = express.Router();

const {
  addIncome,
  getAllIncomes,
  updateIncome,
  deleteIncome,
  getIncomeById,
} = require("../controllers/incomeController");

// Income routes
router.post("/", addIncome);
router.get("/", getAllIncomes);
router.get("/:id", getIncomeById);
router.put("/:id", updateIncome);
router.delete("/:id", deleteIncome);

module.exports = router;
