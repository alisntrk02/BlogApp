import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
        const blog = res.data.data.data;

        setFormData({
          name: blog.name,
          content: blog.content,
          tags: blog.tags.join(", "),
        });
      } catch (err) {
        setError("Failed to load blog data.");
        console.error(err);
      }
    }
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("jwt");
    if (!token) {
      setError("You must be logged in to update the blog.");
      setLoading(false);
      return;
    }

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        content: formData.content,
        tags: tagsArray,
      };

      await axios.patch(
        `http://localhost:3000/api/v1/blogs/updateMyBlog/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Blog updated successfully.");
      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Edit Blog</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg mb-1">Title</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-lg mb-1">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block text-lg mb-1">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded w-full sm:w-auto"
          >
            {loading ? "Updating..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBlog;
