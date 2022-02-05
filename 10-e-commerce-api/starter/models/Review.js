const { required } = require('joi');
const mongoose = require('mongoose');
const Review = new mongoose.Schema({
 rating:{
   type:Number,
   min:0,
   max:10,
   required:[true,'please provide review rating!'],
 },
 title:{
     type:String,
     minlength:[3,'review length must be at least 3'],
     maxlength:[25,'title is too long, max length is 25 chars!'],
     required:[true,'please provide review title'],
 },
 comment:{
     type:String,
     maxlenght:200,
 },
user:{
  ref:'User',
  type:mongoose.Types.ObjectId,
  required:true,
},
product:{
  ref:'Product',
  type:mongoose.Types.ObjectId,
  required:true,
}

},{timestamps:true})

//user can leave only one review per product: ? 
Review.index({user:1,product:1},{unique:true})

module.exports = mongoose.model('Review',Review);