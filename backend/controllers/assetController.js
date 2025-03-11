const Asset = require("../models/AssetModel");

// Add a new asset
const addAsset = async (req, res) => {
  const {
    itemCode,
    name,
    assetType,
    purchaseDate,
    initialValue,
    residualValue,
    usefulLifeYears,
  } = req.body;

  try {
    // Validation
    const requiredFields = [
      "itemCode",
      "name",
      "assetType",
      "purchaseDate",
      "initialValue",
      "residualValue",
      "usefulLifeYears",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (typeof initialValue !== "number" || initialValue < 0) {
      return res
        .status(400)
        .json({ message: "Initial value must be a positive number" });
    }

    if (typeof residualValue !== "number" || residualValue < 0) {
      return res
        .status(400)
        .json({ message: "Residual value must be a positive number" });
    }

    if (
      typeof usefulLifeYears !== "number" ||
      usefulLifeYears < 1 ||
      usefulLifeYears > 100
    ) {
      return res
        .status(400)
        .json({ message: "Useful life must be between 1-100 years" });
    }

    if (!["equipment", "property", "vehicle", "other"].includes(assetType)) {
      return res.status(400).json({ message: "Invalid asset type" });
    }

    const newAsset = new Asset({
      itemCode: itemCode.toUpperCase().trim(),
      name: name.trim(),
      assetType,
      purchaseDate: new Date(purchaseDate),
      initialValue,
      residualValue,
      usefulLifeYears,
    });

    await newAsset.save();
    res.status(200).json({
      message: "Asset added successfully",
      data: newAsset,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error adding asset", error: error.message });
  }
};

// Retrieve all assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ purchaseDate: -1 });
    res.status(200).json({
      count: assets.length,
      data: assets,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error getting assets", error: error.message });
  }
};

// Update an existing asset by its ID
const updateAsset = async (req, res) => {
  const {
    itemCode,
    name,
    assetType,
    purchaseDate,
    initialValue,
    residualValue,
    usefulLifeYears,
  } = req.body;
  const assetId = req.params.id;

  try {
    const updatedAsset = await Asset.findByIdAndUpdate(
      assetId,
      {
        itemCode,
        name,
        assetType,
        purchaseDate,
        initialValue,
        residualValue,
        usefulLifeYears,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Asset updated successfully",
      data: updatedAsset,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error updating asset", error: error.message });
  }
};

// Delete an asset by its ID
const deleteAsset = async (req, res) => {
  const assetId = req.params.id;

  try {
    const deletedAsset = await Asset.findByIdAndDelete(assetId);

    if (deletedAsset) {
      res.status(200).json({
        message: "Asset deleted successfully",
        data: deletedAsset,
      });
    } else {
      res.status(404).json({ message: "Asset not found" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ status: "Error deleting asset", error: error.message });
  }
};

module.exports = {
  addAsset,
  getAssets,
  updateAsset,
  deleteAsset,
};
