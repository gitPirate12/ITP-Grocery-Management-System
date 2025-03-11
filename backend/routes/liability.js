const express = require("express");
const router = express.Router();

const {
  addLiability,
  getLiabilities,
  updateLiability,
  deleteLiability,
} = require("../controllers/liabilityController");

// Liability routes
router.post("/", addLiability);
router.get("/", getLiabilities);
router.put("/:id", updateLiability);
router.delete("/:id", deleteLiability);

module.exports = router;
