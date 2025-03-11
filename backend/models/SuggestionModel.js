const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const suggestionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email format",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    description: {
      type: String,
      required: [true, "Suggestion description is required"],
      minLength: [20, "Suggestion must be at least 20 characters"],
      maxLength: [500, "Suggestion cannot exceed 500 characters"],
    },
    submittedDate: {
      type: Date,
      default: Date.now,
    },
    suggestionId: {
      type: String,
      unique: true,
      default: () => mongoose.Types.ObjectId().toString(),
      index: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "IMPLEMENTED", "ARCHIVED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text index for search
suggestionSchema.index({ description: "text" });

// Virtual for formatted date
suggestionSchema.virtual("formattedDate").get(function () {
  return this.submittedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

module.exports = mongoose.model("Suggestion", suggestionSchema);
