const express = require("express");
const router = express.Router();

const {
  addLiability,
  getLiabilities,
  updateLiability,
  deleteLiability,
  getLiabilityById
} = require("../controllers/liabilityController");

// Liability routes
router.post("/", addLiability);
router.get("/", getLiabilities);
router.get("/:id", getLiabilityById);
router.put("/:id", updateLiability);
router.delete("/:id", deleteLiability);

module.exports = router;
