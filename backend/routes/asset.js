const express = require("express");
const router = express.Router();

const {
  addAsset,
  getAssets,
  updateAsset,
  deleteAsset,
  getAssetById
} = require("../controllers/assetController");

router.get("/:id", getAssetById);
router.post("/", addAsset);
router.get("/", getAssets);
router.put("/:id", updateAsset);
router.delete("/:id", deleteAsset);

module.exports = router;
