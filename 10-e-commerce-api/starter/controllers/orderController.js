const CustomAPIError = require("../errors");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");

/* 
  name
  image
  price
 amount
product
*/

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "some random value";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  const orderItems = [];
  let subtotal = 0;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomAPIError.BadRequestError("No cart items provided!");
  }
  if (!tax || !shippingFee) {
    throw new CustomAPIError.BadRequestError(
      "No tax or shippingFee!, please provide tax and shipping fee"
    );
  }

  // per ciascun item,vedo se è valido => faccio un find dentro product, se dentro product non c'è restituisco un errore
  // creo un oggetto di tipo OrederItem da inserire nell'array di ordini dell ordine
  // aggiungo all'array che mettero nel oggetto order da mandare al db
  // calcolo is subTotale

  for (const item of cartItems) {
    const productId = item.product; // item.product è l'id del prodotto
    const dbProduct = await Product.findById(productId);

    if (!dbProduct) {
      throw new CustomAPIError.BadRequestError("no item with id: " + productId);
    }

    const { _id, name, price, image } = dbProduct;
    const itemForOrderArray = {
      product: _id,
      name,
      price,
      image,
      amount: item.amount,
    };
    orderItems.push(itemForOrderArray);
    subtotal += item.amount * item.price;
  }
  const total = tax + shippingFee + subtotal;

  //1) GET CLIENT SECRET

  const paymentIntent = await fakeStripeAPI({ amount: total, currency: "usd" });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user._id,
  });

  console.log("ordine ricevuto con:\n", orderItems);
  console.log("ordine ricevuto con subtotale:\n", subtotal);

  res.status(StatusCodes.CREATED).json({ order });
};

const getAllOrders = async (req, res) => {
  res.send("getAllOrders");
};
const getSingleOrders = async (req, res) => {
  res.send("getSingleOrders");
};
const getCurrentUserOrders = async (req, res) => {
  res.send("getCurrentUserOrders");
};
const updateOrder = async (req, res) => {
  res.send("updateOrder");
};

module.exports = {
  getAllOrders,
  getSingleOrders,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
