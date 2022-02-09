
const Review = require('../models/Review');
const Product = require('../models/Product');
const  CustomError  = require('../errors');
const {checkPermissions} = require('../utils')
const createReview = async (req,res)=>{
   const  {product:productId} = req.body;
   if(!productId){
       throw new CustomError.BadRequestError('no product id in body')
   }

   const product = await Product.findById(productId);

   if(!product){
       throw new CustomError.BadRequestError('product with id '+ productId+ 'doesnt exist');
   }
   const review = await Review.findOne({product:productId,user:req.user._id});
   if(review){
       throw new CustomError.BadRequestError("you already wrote a review for this product!");
   }

   req.body.user = req.user._id;
   const createdReview = await Review.create(req.body);

   res.send(createdReview);
}

const getAllReviews = async (req,res)=>{
    
    const reviews = await Review.find({});

    res.status(200).json(reviews)
}

const getSingleReview = async (req,res)=>{
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId).populate({path:'user',select:['name','email']});
    if(!review){
        throw new CustomError.BadRequestError("no review with this ID!");
    }
    res.status(200).json(review);
}

const updateReview = async (req,res)=>{
   

    const reviewID = req.params.id;
    const {rating,title,comment} = req.body;
    
    const review = await Review.findById(reviewID)
     
    if(!review){
        throw new CustomError.BadRequestError("review does not exist");
    }

    //ogni volta restituisco tutti i campi non torna mai indietro undefined
    
    checkPermissions(req.user,review.user);
    
    review.rating=rating;
    review.title=title;
    review.comment=comment;
    
    const result = await review.save();




    res.json(result)
}

const deleteReview = async (req,res)=>{

    /* 
    
- [] get id from req.params
- [] check if review exists
- [] if no review, 404
- [] check permissions (req.user, review.user)
- [] use await review.remove()
- [] send back 200

    */

    const review = await Review.findById(req.params.id)
   
    if(!review){
        throw new CustomError.BadRequestError("no review with id "+req.params.id);
    }
    const productID = review.product;
    const product = await Product.findById(productID);
    if(!product){
        throw new CustomError.BadRequestError('product does not exist');
    }
    
    checkPermissions(req.user,review.user);
    const deleted = await Review.findByIdAndDelete(req.params.id);
    res.status(200).json(deleted)

}



module.exports = {createReview,deleteReview,updateReview,getAllReviews,getSingleReview}