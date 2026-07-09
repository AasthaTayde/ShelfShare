require("dotenv").config();
require("./config/cloudinary");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/Bookroutes");
const purchaseRoutes = require("./routes/PurchaseRoutes");
const requestRoutes = require("./routes/requestRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth",authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/requests", requestRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });