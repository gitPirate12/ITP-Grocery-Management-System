const Promotion = require("../models/PromotionModel");

const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  return res.status(statusCode).json({
    message: error.message || "Server Error",
    ...(error.errors && { details: error.errors }),
  });
};

// Add a new promotion
const addPromotion = async (req, res) => {
  const {
    promotionCode,
    itemCode,
    itemName,
    mediaType,
    targetAudience,
    startDate,
    endDate,
    originalPrice,
    discount,
    quantity,
    notes,
  } = req.body;

  try {
    // Validation
    const requiredFields = [
      "promotionCode",
      "itemCode",
      "itemName",
      "mediaType",
      "targetAudience",
      "startDate",
      "endDate",
      "originalPrice",
      "discount",
      "quantity",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newPromotion = new Promotion({
      promotionCode: promotionCode.toUpperCase().trim(),
      itemCode: itemCode.trim(),
      itemName: itemName.trim(),
      mediaType,
      targetAudience,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      originalPrice: Number(originalPrice),
      discount: Number(discount),
      quantity: Number(quantity),
      notes: notes?.trim(),
    });

    const savedPromotion = await newPromotion.save();
    res.status(201).json({
      message: "Promotion created successfully",
      data: savedPromotion,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all promotions
const getPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .sort({ startDate: -1 })
      .select("-__v");

    res.status(200).json({
      count: promotions.length,
      data: promotions,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const updatePromotion = async (req, res) => {
  try {
    const promotionCode = req.params.promotionCode.toUpperCase();
    
    const updates = {
      ...req.body,
      ...(req.body.startDate && { startDate: new Date(req.body.startDate) }),
      ...(req.body.endDate && { endDate: new Date(req.body.endDate) }),
    };

    const updatedPromotion = await Promotion.findOneAndUpdate(
      { promotionCode }, // Use URL parameter instead of body
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json({
      message: "Promotion updated successfully",
      data: updatedPromotion,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a promotion
const deletePromotion = async (req, res) => {
  try {
    const deletedPromotion = await Promotion.findOneAndDelete({
      promotionCode: req.params.promotionCode,
    });

    if (!deletedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json({
      message: "Promotion deleted successfully",
      data: deletedPromotion,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  addPromotion,
  getPromotions,
  updatePromotion,
  deletePromotion,
};
