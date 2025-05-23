const Blog = require("./../models/blogModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.toggleLike = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  const userId = req.user.id;

  if (!blog) {
    return next(new AppError("Blog not found", 404));
  }

  if (!blog.likedBy) blog.likedBy = [];

  const likedIndex = blog.likedBy.findIndex((id) => id.toString() === userId);

  if (likedIndex === -1) {
    blog.likedBy.push(userId);
    blog.likes += 1;
  } else {
    blog.likedBy.splice(likedIndex, 1);
    blog.likes = Math.max(blog.likes - 1, 0);
  }

  await blog.save();

  res.status(200).json({
    status: "success",
    data: {
      likes: blog.likes,
    },
  });
});

exports.updateMyBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new AppError("Blog not find.", 404));
  }

  if (blog.author.toString() !== req.user.id) {
    return next(new AppError("You do not have perm to update this blog.", 403));
  }

  const updateBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      data: updateBlog,
    },
  });
});

exports.deleteMyBlog = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return next(new AppError("Blog not find.", 404));
  }

  if (blog.author.toString() !== req.user.id) {
    return next(new AppError("You do not have perm to update this blog.", 403));
  }

  await blog.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createMyBlog = catchAsync(async (req, res, next) => {
  req.body.author = req.user.id;
  const newBlog = await Blog.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      data: newBlog,
    },
  });
});

exports.getAllBlogs = factory.getAll(Blog, { path: "author", select: "name" });

exports.getBlog = factory.getOne(Blog, [
  { path: "reviews" },
  { path: "author", select: "name" },
]);

exports.createBlog = factory.createOne(Blog);

exports.updateBlog = factory.updateOne(Blog);

exports.deleteBlog = factory.deleteOne(Blog);
