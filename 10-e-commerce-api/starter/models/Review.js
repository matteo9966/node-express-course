const mongoose = require("mongoose");
const Product = require("./Product");
const Review = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 0,
      max: 10,
      required: [true, "please provide review rating!"],
    },
    title: {
      type: String,
      minlength: [3, "review length must be at least 3"],
      maxlength: [25, "title is too long, max length is 25 chars!"],
      required: [true, "please provide review title"],
    },
    comment: {
      type: String,
      maxlenght: 200,
    },
    user: {
      ref: "user",
      type: mongoose.Types.ObjectId,
      required: true,
    },
    product: {
      ref: "product",
      type: mongoose.Types.ObjectId,
      required: true,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//user can leave only one review per product: ?
Review.index({ user: 1, product: 1 }, { unique: true }); //mongoose indexes

Review.statics.calculateAvgRating = async function (productID) {
  const result = await this.aggregate([
    {
      $match: {
        product: productID,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result);
  return result[0];
};

Review.post("save", async function () {
  console.log("created a review!"); //QUESTO VIENE CHIAMATO CON IL METODO
  const result = await this.constructor.calculateAvgRating(this.product);
  
  const avgRating = Math.ceil( result?.averageRating || 0);
  const numOfReviews = result?.numOfReviews || 0;
  const id = this.product;
  console.log("id del prodotto da cercare:",id);

  await this.model('product').findOneAndUpdate({_id:id},{averageRating:avgRating,numberOfReviews:numOfReviews});
  
});
Review.post("remove", function () {});

module.exports = mongoose.model("review", Review, "review");
