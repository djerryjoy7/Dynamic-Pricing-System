const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ CREATE APP FIRST
const app = express();

// ✅ ENABLE CORS (for Live Server)
app.use(cors({
  origin: "http://127.0.0.1:5500"
}));

app.use(express.json());

// 🔹 ROOT TEST
app.get("/", (req, res) => {
  res.send("Dynamic Pricing System Backend is running");
});

// 🔹 PRICING LOGIC
const calculateDynamicPrice = (basePrice, stockQuantity) => {
  if (stockQuantity < 10) return basePrice * 1.1;
  if (stockQuantity > 50) return basePrice * 0.95;
  return basePrice;
};

// 🔹 PRODUCT SCHEMA
const productSchema = new mongoose.Schema({
  productName: String,
  basePrice: Number,
  currentPrice: Number,
  stockQuantity: Number,
});

const Product = mongoose.model("Product", productSchema);

// 🔹 ADD PRODUCT (ADMIN)
app.post("/api/products/add", async (req, res) => {
  try {
    const { productName, basePrice, stockQuantity } = req.body;

    const currentPrice = calculateDynamicPrice(basePrice, stockQuantity);

    const product = new Product({
      productName,
      basePrice,
      currentPrice,
      stockQuantity,
    });

    await product.save();
    res.json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 VIEW PRODUCTS (USER)
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 🔹 DATABASE + SERVER
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.listen(7000, () => {
  console.log("Server running on port 7000");
});
