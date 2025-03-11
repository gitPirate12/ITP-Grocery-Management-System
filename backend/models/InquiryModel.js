const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquirySchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxLength: [50, "Name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email format"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  description: {
    type: String,
    required: [true, "Inquiry description is required"],
    minLength: [20, "Description must be at least 20 characters"],
    maxLength: [500, "Description cannot exceed 500 characters"]
  },
  type: {
    type: String,
    required: true,
    enum: ["GENERAL", "COMPLAINT", "SUPPORT", "FEEDBACK"],
    default: "GENERAL"
  },
  status: {
    type: String,
    enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    default: "OPEN"
  },
  inquiryId: {
    type: String,
    unique: true,
    default: () => mongoose.Types.ObjectId().toString(),
    index: true
  }
}, {
  timestamps: { 
    createdAt: "submittedDate",
    updatedAt: "lastUpdatedDate" 
  }
});

// Add text index for search capabilities
inquirySchema.index({ description: 'text', name: 'text' });

// Virtual property for formatted date
inquirySchema.virtual('formattedDate').get(function() {
  return this.submittedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model("Inquiry", inquirySchema);