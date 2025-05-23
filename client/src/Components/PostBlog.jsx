import { useState } from "react";
import axios from "axios"; // Axios'u dahil ediyoruz

function PostBlog() {
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    tags: "",
    image: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Formdaki her inputu kontrol et
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("jwt");

    if (!token) {
      setError("You must be logged in to post a blog.");
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/v1/blogs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Blog post created successfully!");
      setFormData({
        name: "",
        content: "",
        tags: "",
        image: null,
        author: "",
      });
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
            "Something went wrong. Please try again."
        );
      } else if (error.request) {
        setError("No response received from the server.");
      } else {
        setError(error.message || "Something went wrong. Please try again.");
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Create New Blog Post
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label className="block text-lg text-gray-700 mb-2">Blog Title</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog title"
            required
          />
        </div>

        <div className="form-group">
          <label className="block text-lg text-gray-700 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter blog content"
            required
          />
        </div>

        <div className="form-group">
          <label className="block text-lg text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter tags"
          />
        </div>

        <div className="form-group">
          <label className="block text-lg text-gray-700 mb-2">
            Image (Optional)
          </label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          {formData.image && (
            <p className="text-sm text-gray-500 mt-2">
              Selected file: {formData.image.name}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full sm:w-auto disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostBlog;
