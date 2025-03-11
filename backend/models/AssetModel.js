const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: true,
      trim: true,
      maxLength: 10,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
      minLength: 2,
    },
    assetType: {
      type: String,
      required: true,
      enum: ["equipment", "property", "vehicle", "other"],
      default: "other",
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    initialValue: {
      type: Number,
      required: true,
      min: 0,
    },
    residualValue: {
      type: Number,
      required: true,
      min: 0,
    },
    usefulLifeYears: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", AssetSchema);
