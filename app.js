require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.json({ message: "Marketplace API is running." });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/items", async (_req, res) => {
  try {
    res.json(await Item.find());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/items/search", async (req, res) => {
  try {
    const searchString = String(req.query.searchString || "").trim();
    const items = await Item.find({ name: { $regex: searchString, $options: "i" } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/items/:itemId", async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const savedItem = await new Item(req.body).save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/items/:itemId", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function start() {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured. Copy .env.example to .env and provide your own MongoDB connection string.");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start application:", error.message);
  process.exit(1);
});
