const express = require("express");
const router = express.Router();

const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  deleteInquiry,
  updateInquiryStatus,
} = require("../controllers/inquiryController");

// Inquiry routes
router.post("/", createInquiry);
router.get("/", getAllInquiries);
router.get("/:id", getInquiryById);
router.delete("/:id", deleteInquiry);
router.put("/:id/status", updateInquiryStatus);

module.exports = router;
