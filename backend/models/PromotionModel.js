const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema(
  {
    promotionCode: {
      type: String,
      required: [true, "Promotion code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      maxLength: [20, "Promotion code cannot exceed 20 characters"],
    },
    itemCode: {
      type: String,
      required: [true, "Item code is required"],
      trim: true,
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxLength: [100, "Item name cannot exceed 100 characters"],
    },
    mediaType: {
      type: String,
      required: true,
      enum: ["social", "email", "print", "web", "tv", "radio"],
      default: "web",
    },
    targetAudience: {
      type: [String],
      required: true,
      enum: ["new", "existing", "vip", "all"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function (value) {
          return this.endDate ? value < this.endDate : true;
        },
        message: "Start date must be before end date",
      },
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    originalPrice: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      required: true,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
      maxLength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "expired"],
      default: "draft",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
PromotionSchema.virtual("discountedPrice").get(function () {
  return (this.originalPrice * (1 - this.discount / 100)).toFixed(2);
});

PromotionSchema.virtual("durationDays").get(function () {
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Indexes (optimized)
PromotionSchema.index({ itemCode: 1, status: 1 });
PromotionSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Promotion", PromotionSchema);
