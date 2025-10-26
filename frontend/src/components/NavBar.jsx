import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/">
            <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-500 transition duration-300">
              🍳 RecipesHub
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Explore Recipes
            </Link>
            <Link
              to="/my-recipes"
              className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
            >
              Your Recipes
            </Link>

            {user ? (
              <>
                <Link
                  to="/add-recipe"
                  className="px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                >
                  Add Recipe
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-500 font-medium transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-gray-700 hover:text-blue-600 font-medium transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 space-y-2 px-2 pb-4">
            <Link
              to="/explore"
              className="block text-gray-700 hover:text-blue-600 font-medium transition duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Explore Recipes
            </Link>
            {user ? (
              <>
                <Link
                  to="/my-recipes"
                  className="block text-gray-700 hover:text-blue-600 font-medium transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Your Recipes
                </Link>
                <Link
                  to="/add-recipe"
                  className="block px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Add Recipe
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block text-gray-700 hover:text-red-500 font-medium transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-blue-600 font-medium transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-gray-700 hover:text-blue-600 font-medium transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
