import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import BlogCard from "../Components/BlogCard";
import Header from "../Components/Header";

function HomePage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/blogs")
      .then((res) => setBlogs(res.data.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center gap-6 p-4">
        {blogs.map((blog) => (
          <Link
            to={`/blog/${blog._id}`}
            key={blog._id}
            className="w-full max-w-xl"
          >
            <BlogCard blog={blog} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
