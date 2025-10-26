import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/authContext";
import { Link } from "react-router-dom";

const RecipeDetail = () => {
  const [recipe, setrecipe] = useState(null);
  const { user } = useContext(AuthContext);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await axios.get(`/api/recipes/${id}`);
      setrecipe(res.data);
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/recipes/${id}`);
      navigate("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };
  // console.log(user);
  // console.log("id :", user?._id);
  console.log("recipe  ", recipe);
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-white to-gray-50 shadow-xl rounded-2xl transition-all duration-300 hover:shadow-2xl">
      {recipe.photoUrl && (
        <div className="relative group mb-6">
          <img
            src={recipe.photoUrl}
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="text-center mb-6">
        <h1 className="capitalize text-4xl font-extrabold text-gray-900 mb-2">
          {recipe.title}
        </h1>
        <p className="text-gray-500 text-lg">
          by{" "}
          <span className="font-medium text-gray-700">
            {recipe?.createdBy?.username}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap justify-between text-gray-600 mb-6">
        <p className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Category:</span>{" "}
          {recipe.category}
        </p>
        <p className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Cooking time:</span>{" "}
          {recipe.cookingTime} mins
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-yellow-400 inline-block mb-3">
          🧂 Ingredients
        </h2>
        <ul className="pl-6 list-disc text-gray-700 space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-yellow-400 inline-block mb-3">
          🍳 Instructions
        </h2>
        <p className="text-gray-700 leading-relaxed">{recipe.instructions}</p>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Last Updated:{" "}
        <span className="font-medium text-gray-700">
          {recipe.updatedAt.toString().slice(0, 10)}
        </span>
      </p>

      {user && user?._id === recipe?.createdBy?._id && (
        <div className="flex space-x-3">
          <Link to={`/edit-recipe/${id}`}>
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-5 py-2 rounded-lg font-medium shadow hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300">
              ✏️ Edit
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg font-medium shadow hover:from-red-600 hover:to-red-700 transition-all duration-300"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
