import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import BlogDetailPage from "./Pages/BlogDetailPage";
import LoginForm from "./Components/LoginForm";
import CreateBlog from "./Pages/CreateBlog";
import RegisterForm from "./Components/RegisterForm";
import EditBlog from "./Components/EditBlog";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/blogs/:id/edit" element={<EditBlog />} />
      </Routes>
    </Router>
  );
}

export default App;
