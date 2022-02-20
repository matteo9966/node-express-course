const mongoose = require("mongoose");

const SingleCartItem = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

const Order = mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleCartItem], // cartItem è un array di schema
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "failed", "delivered", "cancelled","payed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", Order, "order");
