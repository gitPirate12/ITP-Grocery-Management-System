const express = require("express");
const router = express.Router();

const {
  addPromotion,
  getPromotions,
  updatePromotion,
  deletePromotion,
} = require("../controllers/promotionController");

// Promotion routes
router.post("/", addPromotion);
router.get("/", getPromotions);
router.put("/:promotionCode", updatePromotion);
router.delete("/:promotionCode", deletePromotion);

module.exports = router;
