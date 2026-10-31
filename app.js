require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const itemRoutes = require("./routes/itemRouter");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());
app.use("/api", itemRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Marketplace API is running." });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
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
