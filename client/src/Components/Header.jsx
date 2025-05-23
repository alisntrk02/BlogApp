import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");

    window.location.reload();
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Create", path: "/create" },
  ];

  if (isLoggedIn) {
    navItems.push({ name: "Logout", path: "#", onClick: handleLogout });
  } else {
    navItems.push(
      { name: "Login", path: "/login" },
      { name: "Register", path: "/register" }
    );
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">
          <a href="/">
            Blog<span className="text-gray-800">App</span>
          </a>
        </div>
        <ul className="flex space-x-6 text-gray-700 font-medium">
          {navItems.map((item) => (
            <li key={item.name} className="hover:text-blue-600 transition">
              {item.onClick ? (
                <button onClick={item.onClick} className="focus:outline-none">
                  {item.name}
                </button>
              ) : (
                <a href={item.path}>{item.name}</a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
