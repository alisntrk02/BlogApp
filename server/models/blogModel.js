const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    image: { type: String },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    isPublished: { type: Boolean, default: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "blog",
  localField: "_id",
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
