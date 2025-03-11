const express = require("express");
const router = express.Router();

const {
  registerCustomer,
  getAllCustomers,
  deleteCustomer,
  authenticateCustomer,
  getCustomerProfile,
  updateProfile,
  updateProfileImage,
} = require("../controllers/customerController");

// Customer Authentication
router.post("/login", authenticateCustomer);

// Customer Registration & Management
router.post("/", registerCustomer);
router.get("/", getAllCustomers);
router.get("/:id", getCustomerProfile);
router.put("/:id", updateProfile);
router.delete("/:id", deleteCustomer);

// Profile Image Handling
router.patch("/:id/avatar", updateProfileImage);

module.exports = router;
