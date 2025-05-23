import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import PostBlog from "../Components/PostBlog";

function CreateBlog() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      // Token yoksa login sayfasına yönlendir
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <div>
        <PostBlog />
      </div>
    </div>
  );
}

export default CreateBlog;
