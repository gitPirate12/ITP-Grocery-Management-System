const Income = require("../models/IncomeModel");

// Create a new income if it doesn't already exist
const addIncome = async (req, res) => {
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

    const newIncome = new Income({
      title: title.trim(),
      amount,
      category: category.trim(),
      description: description.trim(),
      paymentType,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json("Income added successfully");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error adding income", error: error.message });
  }
};

// Retrieve all incomes
const getAllIncomes = async (req, res) => {
  Income.find()
    .then((incomes) => {
      res.status(200).json(incomes);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .send({ status: "Error getting incomes", error: error.message });
    });
};

// Update an existing income by its ID
const updateIncome = async (req, res) => {
  const { title, amount, category, description, paymentType, date } = req.body;
  const incomeId = req.params.id;

  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      incomeId,
      {
        title,
        amount,
        category,
        description,
        paymentType,
        date: new Date(date),
      },
      { new: true }
    );
    res.status(200).json(updatedIncome);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error updating income", error: error.message });
  }
};

// Delete an income by its ID
const deleteIncome = async (req, res) => {
  const incomeId = req.params.id;

  try {
    const deletedIncome = await Income.findByIdAndDelete(incomeId);
    if (deletedIncome) {
      res.status(200).json({ status: "Income deleted successfully" });
    } else {
      res.status(404).json({ status: "Income not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error deleting income", error: error.message });
  }
};

// Get an income by its ID
const getIncomeById = async (req, res) => {
  const incomeId = req.params.id;

  try {
    const income = await Income.findById(incomeId);
    if (income) {
      res.status(200).json(income);
    } else {
      res.status(404).json({ status: "Income not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error getting income", error: error.message });
  }
};

module.exports = {
  addIncome,
  getAllIncomes,
  updateIncome,
  deleteIncome,
  getIncomeById,
};
