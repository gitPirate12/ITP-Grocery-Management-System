const Order = require("../models/OrderModel");

const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  return res.status(statusCode).json({
    message: error.message || "Server Error",
    ...(error.errors && { details: error.errors }),
  });
};

// Create a new order
const createOrder = async (req, res) => {
  const {
    orderNumber,
    supplierId,
    items,
    pricing,
    deliveryDate,
    paymentMethod,
    shippingAddress,
  } = req.body;

  try {
    // Validation
    const requiredFields = [
      "orderNumber",
      "supplierId",
      "items",
      "pricing",
      "deliveryDate",
      "paymentMethod",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newOrder = new Order({
      orderNumber: orderNumber.toUpperCase().trim(),
      supplierId,
      items: items.map((item) => ({
        itemCode: item.itemCode.trim(),
        name: item.name.trim(),
        quantity: Number(item.quantity),
      })),
      pricing: {
        unitPrice: Number(pricing.unitPrice),
        discount: Number(pricing.discount) || 0,
      },
      deliveryDate: new Date(deliveryDate),
      paymentMethod,
      shippingAddress: {
        street: shippingAddress?.street?.trim(),
        city: shippingAddress?.city?.trim(),
        state: shippingAddress?.state?.trim(),
        postalCode: shippingAddress?.postalCode?.trim(),
        country: shippingAddress?.country?.trim(),
      },
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderDate: -1 })
      .populate("supplierId", "name contact.phone")
      .select("-__v");

    res.status(200).json({
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update an existing order
const updateOrder = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      ...(req.body.orderNumber && {
        orderNumber: req.body.orderNumber.toUpperCase().trim(),
      }),
      ...(req.body.deliveryDate && {
        deliveryDate: new Date(req.body.deliveryDate),
      }),
      ...(req.body.pricing && {
        pricing: {
          unitPrice: Number(req.body.pricing.unitPrice),
          discount: Number(req.body.pricing.discount),
        },
      }),
    };

    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate("supplierId", "name");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
      data: deletedOrder,
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
};
