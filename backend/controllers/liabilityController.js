const Liability = require("../models/LiabilityModel");

const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  return res.status(statusCode).json({
    message: error.message || "Server Error",
    ...(error.errors && { details: error.errors }),
  });
};

const addLiability = async (req, res) => {
  const {
    itemCode,
    name,
    liabilityType,
    startDate,
    initialAmount,
    interestRate,
    termYears,
  } = req.body;

  try {
    // Validation
    const requiredFields = [
      "itemCode",
      "name",
      "liabilityType",
      "startDate",
      "initialAmount",
      "interestRate",
      "termYears",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Convert string inputs to numbers where necessary
    const parsedInitialAmount = Number(initialAmount);
    const parsedInterestRate = Number(interestRate);
    const parsedTermYears = Number(termYears);

    if (isNaN(parsedInitialAmount) || parsedInitialAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Initial amount must be a positive number" });
    }

    if (
      isNaN(parsedInterestRate) ||
      parsedInterestRate < 0 ||
      parsedInterestRate > 100
    ) {
      return res
        .status(400)
        .json({ message: "Interest rate must be between 0-100" });
    }

    if (
      isNaN(parsedTermYears) ||
      parsedTermYears < 1 ||
      parsedTermYears > 30
    ) {
      return res
        .status(400)
        .json({ message: "Term years must be between 1-30" });
    }

    // Create liability object
    const newLiability = new Liability({
      itemCode: itemCode.toUpperCase().trim(),
      name: name.trim(),
      liabilityType,
      startDate: new Date(startDate),
      initialAmount: parsedInitialAmount,
      interestRate: parsedInterestRate,
      termYears: parsedTermYears,
    });

    // Save to database
    const savedLiability = await newLiability.save();

    res.status(201).json({
      message: "Liability added successfully",
      data: savedLiability,
    });
  } catch (error) {
    handleError(res, error);
  }
};



// Get a single liability by ID
const getLiabilityById = async (req, res) => {
  try {
    const liability = await Liability.findById(req.params.id);

    if (!liability) {
      return res.status(404).json({ message: "Liability not found" });
    }

    res.status(200).json({
      message: "Liability fetched successfully",
      data: liability,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all liabilities
const getLiabilities = async (req, res) => {
  try {
    const liabilities = await Liability.find().sort({ startDate: -1 });
    res.status(200).json({
      count: liabilities.length,
      data: liabilities,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update an existing liability
const updateLiability = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      ...(req.body.itemCode && {
        itemCode: req.body.itemCode.toUpperCase().trim(),
      }),
      ...(req.body.startDate && { startDate: new Date(req.body.startDate) }),
    };

    const updatedLiability = await Liability.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedLiability) {
      return res.status(404).json({ message: "Liability not found" });
    }

    res.status(200).json({
      message: "Liability updated successfully",
      data: updatedLiability,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a liability
const deleteLiability = async (req, res) => {
  try {
    const deletedLiability = await Liability.findByIdAndDelete(req.params.id);

    if (!deletedLiability) {
      return res.status(404).json({ message: "Liability not found" });
    }

    res.status(200).json({
      message: "Liability deleted successfully",
      data: deletedLiability,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getLiabilityById,
  addLiability,
  getLiabilities,
  updateLiability,
  deleteLiability,
};
