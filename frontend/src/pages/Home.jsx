import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Dessert",
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(
          `/api/recipes/${
            category && category !== "All" ? `?category=${category}` : ""
          }`
        );
        setRecipes(res.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, [category]);

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (!recipes) {
    return <div className="bg-amber-400 p-3 ">Loading...</div>;
  }
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Categories + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 sm:px-5 py-2 rounded-full font-medium border-2 transition-colors duration-300
              ${
                category === cat
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-blue-500 border-blue-500 hover:bg-blue-100"
              }
            `}
              onClick={() => setCategory(cat)}
            >
              {cat} Recipes
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex justify-center sm:justify-end">
          <input
            type="text"
            placeholder="Search recipes..."
            className="px-4 py-2 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-300 w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <Link
              to={`/recipe/${recipe._id}`}
              key={recipe._id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {recipe.photoUrl && (
                <img
                  src={recipe.photoUrl}
                  alt={recipe.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold capitalize mb-1">
                  {recipe.title}
                </h2>
                <p className="text-gray-500 mb-1">{recipe.category}</p>
                <p className="text-gray-500">{recipe.cookingTime} mins</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center mt-10">
            {recipes.length === 0
              ? `No recipes available for ${category}.`
              : "No recipes match your search."}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
