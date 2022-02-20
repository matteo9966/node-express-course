const CustomAPIError = require("../errors");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");
const {checkPermissions} = require('../utils');
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

  res.status(StatusCodes.CREATED).json({ order });
};

const getAllOrders = async (req, res) => {
  //questo è accessibile solo da admin
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({orders});
};

const getSingleOrders = async (req, res) => {
  const orderId= req.params.id; //? 
  const order = await Order.findById(orderId);
  
  if(!order){
    throw new Error("no order with id"+orderId);
  }

  checkPermissions(req.user,order.user.toString()) 


  res.status(StatusCodes.OK).json({order});

};
const getCurrentUserOrders = async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({user:userId});

  res.status(StatusCodes.OK).json({orders});
};


const updateOrder = async (req, res) => {
   const orderId = req.params.id;
   const { paymentIntentId} = req.body;
  
   //controllo se l'ordine esiste
   const order = await Order.findById(orderId);
   if(!order){
     throw new CustomAPIError.BadRequestError("no order with id: "+id);

   }
   console.log(req.user._id,order.user);
   checkPermissions(req.user,order.user.toString());
   order.paymentIntentId = paymentIntentId;
   order.status="payed";
   await order.save();

 
  res.send("updateOrder");
};

module.exports = {
  getAllOrders,
  getSingleOrders,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
