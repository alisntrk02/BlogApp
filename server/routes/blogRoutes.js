const express = require("express");
const blogController = require("./../controllers/blogController");
const reviewRouter = require("./reviewRoutes");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use("/:blogId/reviews", reviewRouter);

router
  .route("/:id/toggleLike")
  .patch(authController.protect, blogController.toggleLike);

router.patch(
  "/updateMyBlog/:id",
  authController.protect,
  blogController.updateMyBlog
);
router.delete(
  "/deleteMyBlog/:id",
  authController.protect,
  blogController.deleteMyBlog
);

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(
    authController.protect,
    authController.restrictTo("admin", "user"),
    blogController.createMyBlog
  );

router
  .route("/:id")
  .get(blogController.getBlog)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    blogController.updateBlog
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    blogController.deleteBlog
  );

module.exports = router;
