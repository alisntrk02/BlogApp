const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");

exports.setBlogUserIds = (req, res, next) => {
  if (!req.body.blog) req.body.blog = req.params.blogId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.deleteMyReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.id;

  const review = await Review.findById(reviewId);

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  if (review.user._id.toString() !== req.user.id) {
    return next(
      new AppError("You do not have permission to delete this review.", 403)
    );
  }

  await Review.findByIdAndDelete(reviewId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
