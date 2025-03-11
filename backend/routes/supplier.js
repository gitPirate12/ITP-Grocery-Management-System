const express = require("express");
const router = express.Router();

const {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

// Supplier routes
router.post("/", addSupplier);
router.get("/", getSuppliers);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;
