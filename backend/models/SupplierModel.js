const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema(
  {
    supplierId: {
      type: String,
      required: [true, "Supplier ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxLength: [10, "Supplier ID cannot exceed 10 characters"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      maxLength: [50, "Supplier name cannot exceed 50 characters"],
      index: true,
    },
    contact: {
      phone: {
        type: String,
        required: true,
        match: [
          /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
          "Invalid phone number",
        ],
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Invalid email address",
        ],
      },
    },
    itemCategories: {
      type: [String],
      required: true,
      enum: [
        "groceries",
        "electronics",
        "household",
        "office-supplies",
        "clothing",
      ],
    },
    paymentTerms: {
      method: {
        type: String,
        required: true,
        enum: ["bank-transfer", "credit-card", "cash", "check"],
      },
      accountNumber: {
        type: String,
        trim: true,
        maxLength: 20,
      },
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
  },
  {
    timestamps: {
      createdAt: "relationshipStartDate",
      updatedAt: "lastModifiedDate",
    },
  }
);

// Indexes for common search fields
SupplierSchema.index({ "contact.phone": 1 });
SupplierSchema.index({ itemCategories: 1 });

module.exports = mongoose.model("Supplier", SupplierSchema);
