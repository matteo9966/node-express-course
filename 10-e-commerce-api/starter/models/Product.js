const mongoose = require("mongoose");

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name must be valid"],
      maxlength: [100, "max length of name is 100 char"],
    },
    price: { type: Number, required: [true, "please provide a price"] },
    description: {
      type: String,
      maxlength: 1000,
      default: "no description available",
      required: true,
    },
    image: { type: String, default: "/assets/example.png" },
    category: {
      type: String,
      required: [true,'please provide a category'],
      enum: {
        values: ["office", "kitchen", "bedroom"],
        message: "{VALUE} is not available in list",
      },
    },
    company: {
      type: String,
      required:[true,'please provide a company'],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not available in list of companies [ikea liddi or marcos]",
      },
    },
    colors: { type: [String], required: true },
    featured: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    inventory: { type: Number, default: 1 },
    averageRating: { type: Number },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", Product);
