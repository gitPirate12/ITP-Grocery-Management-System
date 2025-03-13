const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema(
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
      unique: true,
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
    address: {
      street: { type: String, required: true, maxLength: 100 },
      city: { type: String, required: true, maxLength: 50 },
      state: { type: String, required: true, maxLength: 50 },
      zipCode: {
        type: String,
        required: true,
        match: [/^\d{5}(-\d{4})?$/, "Invalid ZIP code"],
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password must be at least 8 characters"],
    },
    membershipDate: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN", "STAFF"],
      default: "CUSTOMER",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index declarations
customerSchema.index({ "address.zipCode": 1 }); 
customerSchema.index({ name: "text", email: "text" }); 

module.exports = mongoose.model("Customer", customerSchema);
