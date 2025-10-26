import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import axios from "axios";

const MyRecipes = () => {
  const [myRecipes, setMyRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(AuthContext);
  const navigator = useNavigate();

  useEffect(() => {
    if (!user) {
      <div className="flex items-center justify-center h-[70vh] bg-gradient-to-br from-amber-100 to-amber-300">
        <div className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md mx-auto border border-amber-300">
          <h2 className="text-2xl font-bold text-amber-700 mb-3">
            Please Log In
          </h2>
          <p className="text-gray-700 mb-5">
            You need to be logged in to view your recipes and manage them.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-2 bg-amber-500 text-white font-medium rounded-full hover:bg-amber-600 transition duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>;
    }

    const fetchMyRecipes = async () => {
      try {
        const res = await axios.get(`/api/recipes`);
        const myRecipes = res.data.filter(
          (recipe) => recipe?.createdBy?._id === user?._id
        );
        setMyRecipes(myRecipes); //here we set only user recipes
      } catch (error) {
        console.error("Error fetching recipes:", err);
      }
    };
    fetchMyRecipes();
  }, [user, navigator]); //it means when user or navigator change it will re run

  const filteredRecipes = myRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axios.delete(`/api/recipes/${id}`);
        setMyRecipes(myRecipes.filter((recipe) => recipe._id !== id));
      } catch (err) {
        console.error("Error deleting recipe:", err);
      }
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Recipes</h1>

      {/* Search */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search your recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 w-full sm:w-64"
        />
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Link
              to={`/recipe/${recipe._id}`}
              key={recipe._id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {recipe.photoUrl && (
                <img
                  src={recipe.photoUrl}
                  alt={recipe.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold capitalize mb-1">
                    {recipe.title}
                  </h2>
                  <p className="text-gray-500 mb-1">{recipe.category}</p>
                  <p className="text-gray-500">{recipe.cookingTime} mins</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/edit-recipe/${recipe._id}`}
                    onClick={(e) => e.stopPropagation()} // prevent navigating to details
                    className="px-3 py-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // prevent navigating to details
                      handleDelete(recipe._id);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center mt-10">
            {myRecipes.length === 0
              ? "You have not added any recipes yet."
              : "No recipes match your search."}
          </p>
        )}
      </div>
    </div>
  );
};

export default MyRecipes;
