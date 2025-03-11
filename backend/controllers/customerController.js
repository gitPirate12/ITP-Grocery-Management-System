const CustomerModel = require("../models/CustomerModel");
const bcrypt = require("bcrypt");

const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  return res.status(statusCode).json({
    message: error.message || "Server Error",
    ...(error.errors && { details: error.errors }),
  });
};

// Customer Registration
const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    // Basic validation
    const requiredFields = ["name", "email", "phone", "password", "address"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Address sub-fields validation
    const addressFields = ["street", "city", "state", "zipCode"];
    const missingAddressFields = addressFields.filter(
      (field) => !address[field]
    );

    if (missingAddressFields.length > 0) {
      return res.status(400).json({
        message: `Missing address fields: ${missingAddressFields.join(", ")}`,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new CustomerModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      address: {
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        zipCode: address.zipCode.trim(),
      },
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json({
      message: "Registration successful",
      data: savedCustomer.toJSON(),
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get All Customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await CustomerModel.find()
      .sort({ membershipDate: -1 })
      .select("-password -__v");

    res.status(200).json({
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete Customer
const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await CustomerModel.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
      data: deletedCustomer.toJSON(),
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Customer Authentication
const authenticateCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await CustomerModel.findOne({
      email: email.toLowerCase(),
    });

    if (!customer || !(await bcrypt.compare(password, customer.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Authentication successful",
      data: customer.toJSON(),
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get Customer Profile
const getCustomerProfile = async (req, res) => {
  try {
    const customer = await CustomerModel.findById(req.params.id).select(
      "-password -__v"
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    handleError(res, error);
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name?.trim(),
      phone: req.body.phone?.trim(),
      address: {
        street: req.body.address?.street?.trim(),
        city: req.body.address?.city?.trim(),
        state: req.body.address?.state?.trim(),
        zipCode: req.body.address?.zipCode?.trim(),
      },
    };

    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedCustomer,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update Profile Picture
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      req.params.id,
      { profileImage: imageUrl },
      { new: true }
    ).select("-password -__v");

    res.status(200).json({
      message: "Profile image updated",
      data: updatedCustomer,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  registerCustomer,
  getAllCustomers,
  deleteCustomer,
  authenticateCustomer,
  getCustomerProfile,
  updateProfile,
  updateProfileImage,
};
