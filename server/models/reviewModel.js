const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review can not be empty!"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "Blog",
    required: [true, "Review must belong to blog."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to user."],
  },
});

reviewSchema.index({ blog: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
