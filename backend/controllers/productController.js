const Product = require("../models/ProductModel");

const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  return res.status(statusCode).json({
    message: error.message || "Server Error",
    ...(error.errors && { details: error.errors }),
  });
};

// Add a new product
const addProduct = async (req, res) => {
  const {
    name,
    category,
    price,
    quantity,
    description,
    expiryDate,
    brand,
    nutritionalInfo,
    storageCondition,
    barcode,
  } = req.body;

  try {
    // Required fields validation
    const requiredFields = [
      "name",
      "category",
      "price",
      "expiryDate",
      "barcode",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields,
        message: `Please fill in: ${missingFields.join(", ")}`,
      });
    }

    // Create product object
    const newProduct = new Product({
      name: name.trim(),
      category,
      price: Number(price),
      quantity: Number(quantity) || 0,
      description: description?.trim(),
      expiryDate: new Date(expiryDate),
      brand: brand?.trim(),
      nutritionalInfo,
      storageCondition: storageCondition || "room temperature",
      barcode,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ dateAdded: -1 })
      .select("-__v");

    res.status(200).json({
      count: products.length,
      data: products,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get a single product by ID
const getProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id).select("-__v");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    handleError(res, error);
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const updates = {
      ...req.body,
      ...(req.body.expiryDate && { expiryDate: new Date(req.body.expiryDate) }),
      ...(req.body.price && { price: Number(req.body.price) }),
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
