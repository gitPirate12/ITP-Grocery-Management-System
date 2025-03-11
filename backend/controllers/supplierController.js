const Supplier = require("../models/SupplierModel");
const mongoose = require("mongoose");

const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  return res.status(statusCode).json({
    message: error.message || "Server Error",
    ...(error.errors && { details: error.errors }),
  });
};

// Add a new supplier
const addSupplier = async (req, res) => {
  const { supplierId, name, contact, itemCategories, paymentTerms, address } =
    req.body;

  try {
    // Validation
    const requiredFields = [
      "supplierId",
      "name",
      "contact",
      "itemCategories",
      "paymentTerms",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newSupplier = new Supplier({
      supplierId: supplierId.toUpperCase().trim(),
      name: name.trim(),
      contact: {
        phone: contact.phone.trim(),
        email: contact.email?.toLowerCase().trim(),
      },
      itemCategories,
      paymentTerms: {
        method: paymentTerms.method,
        accountNumber: paymentTerms.accountNumber?.trim(),
      },
      address: {
        street: address.street?.trim(),
        city: address.city?.trim(),
        state: address.state?.trim(),
        postalCode: address.postalCode?.trim(),
        country: address.country?.trim(),
      },
    });

    const savedSupplier = await newSupplier.save();
    res.status(201).json({
      message: "Supplier added successfully",
      data: savedSupplier,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all suppliers
const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .sort({ relationshipStartDate: -1 })
      .select("-__v");

    res.status(200).json({
      count: suppliers.length,
      data: suppliers,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update supplier
const updateSupplier = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      ...(req.body.supplierId && {
        supplierId: req.body.supplierId.toUpperCase().trim(),
      }),
      ...(req.body.contact && {
        contact: {
          phone: req.body.contact.phone?.trim(),
          email: req.body.contact.email?.toLowerCase().trim(),
        },
      }),
      ...(req.body.paymentTerms && {
        paymentTerms: {
          method: req.body.paymentTerms.method,
          accountNumber: req.body.paymentTerms.accountNumber?.trim(),
        },
      }),
    };

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({
      message: "Supplier updated successfully",
      data: updatedSupplier,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete supplier
const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!deletedSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json({
      message: "Supplier deleted successfully",
      data: deletedSupplier,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
};
