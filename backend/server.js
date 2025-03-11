const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Route imports
const AssetRoutes = require("./routes/asset");
const CustomerRoutes = require("./routes/customer");
const ExpenseRoutes = require("./routes/expense");
const IncomeRoutes = require("./routes/income");
const InquiryRoutes = require("./routes/inquiry");
const LiabilityRoutes = require("./routes/liability");
const OrderRoutes = require("./routes/order");
const ProductRoutes = require("./routes/product");
const PromotionRoutes = require("./routes/promotion");
const SuggestionRoutes = require("./routes/suggestion");
const SupplierRoutes = require("./routes/supplier");

// Route mounting
app.use("/api/assets", AssetRoutes);
app.use("/api/customers", CustomerRoutes);
app.use("/api/expenses", ExpenseRoutes);
app.use("/api/incomes", IncomeRoutes);
app.use("/api/inquiries", InquiryRoutes);
app.use("/api/liabilities", LiabilityRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/promotions", PromotionRoutes);
app.use("/api/suggestions", SuggestionRoutes);
app.use("/api/suppliers", SupplierRoutes);

// Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connection Success! ✅");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("💥 Database connection error:", err.message);
    process.exit(1);
  });
