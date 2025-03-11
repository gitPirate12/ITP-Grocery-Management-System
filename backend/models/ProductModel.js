const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxLength: [50, "Product name cannot exceed 50 characters"],
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "dairy",
        "produce",
        "bakery",
        "meat",
        "frozen",
        "pantry",
        "beverages",
        "household",
      ],
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0.01, "Price must be at least $0.01"],
      set: (v) => Math.round(v * 100) / 100,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, "Description cannot exceed 200 characters"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required for food products"],
      validate: {
        validator: function (value) {
          return value > Date.now();
        },
        message: "Expiry date must be in the future",
      },
    },
    brand: {
      type: String,
      trim: true,
      maxLength: 30,
    },
    nutritionalInfo: {
      calories: Number,
      allergens: [String],
    },
    storageCondition: {
      type: String,
      enum: ["room temperature", "refrigerated", "frozen"],
      default: "room temperature",
    },
    barcode: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[0-9]{12,13}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid barcode!`,
      },
    },
  },
  {
    timestamps: {
      createdAt: "dateAdded",
      updatedAt: "lastUpdated",
    },
  }
);

ProductSchema.index({ name: "text", category: 1, brand: 1 });

module.exports = mongoose.model("Product", ProductSchema);
