import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentForm from "./CommentForm";
import axios from "axios";
import jwtDecode from "jwt-decode";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const token = localStorage.getItem("jwt");
  const user = token ? jwtDecode(token) : null;
  const userId = user?.id || user?._id;

  const handleDeleteReview = async (reviewId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/api/v1/blogs/${id}/reviews/${reviewId}/deleteMyReview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Review deleted successfully.");
      fetchBlog();
    } catch (error) {
      console.error("Failed to delete review", error);
      alert("You do not have permission to delete this review.");
    }
  };

  const handleDelete = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/api/v1/blogs/deleteMyBlog/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Blog deleted successfully.");
      navigate("/");
    } catch (error) {
      console.error("Failed to delete blog", error);
      alert("You are not the owner of this blog.");
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
      setBlog(res.data.data.data);
    } catch (err) {
      console.error("Failed to fetch blog", err);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const handleToggleLike = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (isLiking) return;

    try {
      setIsLiking(true);

      const res = await axios.patch(
        `http://localhost:3000/api/v1/blogs/${id}/toggleLike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlog((prev) => ({
        ...prev,
        likes: res.data.data.likes,
      }));
    } catch (error) {
      console.error("Like operation failed", error);
      alert("An error occurred during the like operation.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleNewComment = async () => {
    await fetchBlog();
    setShowCommentForm(false);
  };

  if (!blog)
    return <p className="flex justify-center items-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <img
        src={blog.image}
        alt={blog.name}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{blog.name}</h1>
      <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
        <span>✍️ {blog.author?.name || "Unknown Author"}</span>

        <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="text-lg leading-relaxed text-gray-800 mb-6">
        {blog.content}
      </div>
      <div className="flex gap-2 flex-wrap mb-4">
        {blog.tags?.map((tag, i) => (
          <span
            key={i}
            className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center text-gray-700 text-sm mt-4">
        <span
          className={`cursor-pointer select-none ${
            isLiking ? "opacity-50 pointer-events-none" : ""
          }`}
          onClick={handleToggleLike}
        >
          ❤️ {blog.likes}
        </span>

        <span
          className="cursor-pointer hover:underline"
          onClick={() => setShowCommentForm((prev) => !prev)}
        >
          💬 {blog.reviews.length} comment
        </span>

        {blog.isPublished ? (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Published
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
            Not published
          </span>
        )}
      </div>
      <div className="space-x-2">
        {token && blog.author?._id === userId && (
          <>
            <button
              onClick={handleDelete}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
            >
              Delete
            </button>
            <button
              onClick={() => navigate(`/blogs/${blog._id}/edit`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 cursor-pointer"
            >
              Edit
            </button>
          </>
        )}
      </div>

      {showCommentForm && (
        <CommentForm blogId={blog._id} onCommentSubmit={handleNewComment} />
      )}

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {blog.reviews.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {blog.reviews.map((review, i) => (
              <li
                key={i}
                className="relative border border-gray-200 p-4 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                  <span>👤 {review.user?.name || "Anonym"}</span>
                  <span>
                    🕒 {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{review.review}</p>

                {review.user?._id === userId && (
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="mt-2 text-red-600 hover:underline text-sm cursor-pointer"
                  >
                    Delete comment
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BlogDetail;
