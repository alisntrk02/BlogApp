const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router.route("/:id/deleteMyReview").delete(reviewController.deleteMyReview);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo("user"),
    reviewController.setBlogUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(authController.restrictTo("admin"), reviewController.updateReview)
  .delete(authController.restrictTo("admin"), reviewController.deleteReview);

module.exports = router;
