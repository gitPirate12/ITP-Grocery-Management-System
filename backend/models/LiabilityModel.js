const mongoose = require("mongoose");

const LiabilitySchema = new mongoose.Schema(
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
    liabilityType: {
      type: String,
      required: true,
      enum: ["loan", "mortgage", "credit-card", "other"],
      default: "other",
    },
    startDate: {
      type: Date,
      required: true,
    },
    initialAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    interestRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    termYears: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Liability", LiabilitySchema);
