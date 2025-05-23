import BlogDetail from "../Components/BlogDetail";
import Header from "../Components/Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function BlogDetailPage() {
  const { id } = useParams(); // URL parametrelerinden 'id'yi alıyoruz
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/blogs/${id}`)
      .then((res) => {
        console.log("API cevabı:", res.data); // Burada cevabı kontrol et
        setBlog(res.data.data.data); // Burada doğru veriyi aldığından emin ol
      })
      .catch((err) => console.error("Hata:", err));
  }, [id]);

  if (!blog) return <p>Yükleniyor...</p>;

  return (
    <div>
      <Header />
      <div className="p-6">
        <BlogDetail blog={blog} />
      </div>
    </div>
  );
}

export default BlogDetailPage;
