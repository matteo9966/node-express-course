const express = require('express');
const {authentication,authorize} = require('../middleware/authentication')
const {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword} = require('../controllers/userController');
const Router = express.Router();
Router.route('/').get(authentication,authorize('admin','owner'),getAllUsers);
Router.route('/showMe').get(authentication,showCurrentUser)
Router.route('/update-user').patch(updateUser)
Router.route('/update-user-password').patch(updateUserPassword)
Router.route('/:id').get(getSingleUser);

module.exports =Router;
