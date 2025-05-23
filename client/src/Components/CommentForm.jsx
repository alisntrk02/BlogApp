import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CommentForm({ blogId, onCommentSubmit }) {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const token = localStorage.getItem("jwt");
    if (!token) {
      return navigate("/login");
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:3000/api/v1/blogs/${blogId}/reviews`,
        { review: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newComment = res.data.data || res.data;
      onCommentSubmit(newComment);
      setComment("");
    } catch (error) {
      console.error("While posting comment error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        className="w-full p-3 border rounded-md"
        rows={4}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
      >
        {loading ? "Sending..." : "Make a comment"}
      </button>
    </form>
  );
}

export default CommentForm;
