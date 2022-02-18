const mongoose = require("mongoose");
const Review = require('./Review')
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
    averageRating: { type: Number,default:0 },
    numberOfReviews:{type:Number,default:0},
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true,toJSON:{virtuals:true},toObject:{virtuals:true} } //dice di considerare i virtuals nella conversione in JSON e nella conversione in js Object
);

Product.virtual('review',{ //creo un virtual
  ref:'review',
  localField:'_id', //id di user nel review
  foreignField:'product', // id si trova dentro review!
})

Product.pre('deleteOne',{ document: true, query: true },async function(next){
 const productID = this._id; 
 const deleted = await Review.deleteMany({product:productID}); // ? non cancella 
 console.log(deleted);
 next();
})

module.exports = mongoose.model("product", Product,"product"); 
