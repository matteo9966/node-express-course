/* 



rest only by admin (setup middlewares)
typical setup
router.route('/uploadImage').post(uploadImage)
import productRoutes as productRouter in the app.js
setup app.use('/api/v1/products', productRouter)

*/

const express = require('express');
const {createProduct, getAllProducts,getSingleProduct, updateProduct, deleteProduct, uploadImage} = require('../controllers/productController');
const {authorize,authentication} = require('../middleware/authentication')
const Router = express.Router();

Router.route('/').get(getAllProducts)
Router.route('/uploadImage').post(authentication,authorize('admin'),uploadImage);
Router.route('/:id').get(getSingleProduct).post(authentication,authorize('admin'),createProduct).patch(authentication,authorize('admin'),updateProduct).delete(authentication,authorize('admin'),deleteProduct);

 
module.exports = Router;