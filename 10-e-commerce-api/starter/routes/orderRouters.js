const {
  getAllOrders,
  getSingleOrders,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");
const { authentication, authorize } = require("../middleware/authentication");
const express = require("express");
const Router = express.Router();

Router.route("/").get(authentication,authorize('admin'),getAllOrders).post(authentication,createOrder);
Router.route('/showAllMyOrders').get(authentication,getCurrentUserOrders)
Router.route('/:id').get(authentication,getSingleOrders).patch(authentication,updateOrder)


module.exports = Router;
