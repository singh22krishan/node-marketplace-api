require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true, trim: true, maxlength: 120 }
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

app.use(helmet());
app.use(express.json({ limit: "64kb" }));
app.use(cors({ origin: allowedOrigins }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }));

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeServerError(res, error) {
  console.error("Marketplace request failed:", error.message);
  return res.status(500).json({ error: "Server error" });
}

function validObjectId(value) {
  return mongoose.Types.ObjectId.isValid(String(value));
}

app.get("/", (_req, res) => res.json({ message: "Marketplace API is running." }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/api/items", async (_req, res) => {
  try {
    res.json(await Item.find().sort({ createdAt: -1 }).limit(200));
  } catch (error) {
    safeServerError(res, error);
  }
});

app.get("/api/items/search", async (req, res) => {
  try {
    const searchString = String(req.query.searchString || "").trim().slice(0, 100);
    if (!searchString) return res.json([]);
    const pattern = escapeRegex(searchString);
    const items = await Item.find({ name: { $regex: pattern, $options: "i" } }).limit(100);
    res.json(items);
  } catch (error) {
    safeServerError(res, error);
  }
});

app.get("/api/items/:itemId", async (req, res) => {
  if (!validObjectId(req.params.itemId)) return res.status(400).json({ error: "Invalid item id" });
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    safeServerError(res, error);
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const savedItem = await Item.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category,
    });
    res.status(201).json(savedItem);
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ error: "Invalid item data" });
    safeServerError(res, error);
  }
});

app.put("/api/items/:itemId", async (req, res) => {
  if (!validObjectId(req.params.itemId)) return res.status(400).json({ error: "Invalid item id" });
  try {
    const allowed = ["name", "description", "price", "quantity", "category"];
    const updates = Object.fromEntries(allowed.filter((key) => key in req.body).map((key) => [key, req.body[key]]));
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.itemId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    if (error.name === "ValidationError") return res.status(400).json({ error: "Invalid item data" });
    safeServerError(res, error);
  }
});

app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

async function start() {
  if (!mongoUri) throw new Error("MONGO_URI is not configured");
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Failed to start application:", error.message);
    process.exit(1);
  });
}

module.exports = { app, escapeRegex };
