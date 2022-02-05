const {createReview,deleteReview,updateReview,getAllReviews,getSingleReview} = require('../controllers/reviewController');
const {authentication} = require('../middleware/authentication');
const router = require('express').Router();

router.route('/').get(getAllReviews).post(authentication,createReview);

router.route('/:id').get(getSingleReview).patch(authentication,updateReview).delete(authentication,deleteReview);





module.exports=router;