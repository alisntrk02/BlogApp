function BlogCard({ blog }) {
  return (
    <div className="flex justify-start max-w-[500px] w-full">
      <div className="border rounded-lg shadow-md p-4 flex gap-4 bg-white w-full cursor-pointer">
        <img
          src={blog.image}
          alt={blog.name}
          className="w-32 h-32 object-cover rounded-md"
        />
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-bold">{blog.name}</h2>
          <p className="text-sm text-gray-500 mb-1">
            by {blog.author?.name || "Unknown Author"}
          </p>

          <p className="text-sm text-gray-600">
            {blog.content.slice(0, 100)}...
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
