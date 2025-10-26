import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [recipes, setrecipes] = useState([]);
  const [category, setcategory] = useState("All");
  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snacks",
    "Desserts",
  ];
  useEffect(() => {
    const fetchRecipes = async () => {
      const res = await axios.get(
        `/api/recipes/${
          category && category !== "All" ? `?category=${category}` : "" //here we are checking if category is selected and not equal to All then we are adding the category query param
        }` //if category is All or not selected we fetch all recipes
      );
      setrecipes(res.data); //set the fetched recipes to state
    };
    fetchRecipes();
  }, [category]); //fetch recipes whenever category changes

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`m-2 px-4 py-2 rounded-full border ${
              category === cat
                ? "bg-blue-500 text-white"
                : "bg-white text-blue-500"
            }`}
            onClick={() => setcategory(cat)}
          >
            {cat + " Recipes"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Link
            to={`/recipe/${recipe._id}`}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg duration-300 cursor-pointer"
            key={recipe._id}
          >
            {recipe.photoUrl && (
              <img
                src={recipe.photoUrl}
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold capitalize">
                {recipe.title}
              </h2>
              <p className="text-gray-600">{recipe.category}</p>
              <p className="text-gray-600">{recipe.cookingTime} minutes</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
