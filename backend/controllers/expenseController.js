const Expense = require("../models/ExpenseModel");

// Add a new expense if it doesn't already exist
const addExpense = async (req, res) => {
  const { title, amount, category, description, paymentType, date } = req.body;

  try {
    // Validation
    const requiredFields = [
      "title",
      "amount",
      "category",
      "description",
      "paymentType",
      "date",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number" });
    }

    const newExpense = new Expense({
      title: title.trim(),
      amount,
      category: category.trim(),
      description: description.trim(),
      paymentType,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(201).json({
      message: "Expense created successfully",
      data: newExpense,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error adding expense", error: error.message });
  }
};

// Retrieve all expenses
const getAllExpenses = async (req, res) => {
  Expense.find()
    .then((expenses) => {
      res.status(200).json({
        count: expenses.length,
        data: expenses,
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .send({ status: "Error getting expenses", error: error.message });
    });
};

// Update an existing expense by its ID
const updateExpense = async (req, res) => {
  const { title, amount, category, description, paymentType, date } = req.body;
  const expenseId = req.params.id;

  try {
    const updates = {
      title,
      amount,
      category,
      description,
      paymentType,
      ...(date && { date: new Date(date) }),
    };

    const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updates, {
      new: true,
      runValidators: true,
    });
    res.status(200).json(updatedExpense);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error updating expense", error: error.message });
  }
};

// Delete an expense by its ID
const deleteExpense = async (req, res) => {
  const expenseId = req.params.id;

  try {
    const deletedExpense = await Expense.findByIdAndDelete(expenseId);
    if (deletedExpense) {
      res.status(200).json({ status: "Expense deleted successfully" });
    } else {
      res.status(404).json({ status: "Expense not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error deleting expense", error: error.message });
  }
};

// Get an expense by its ID
const getExpenseById = async (req, res) => {
  const expenseId = req.params.id;

  try {
    const expense = await Expense.findById(expenseId);
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).json({ status: "Expense not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error getting expense", error: error.message });
  }
};

module.exports = {
  addExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getExpenseById,
};
