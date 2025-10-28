import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
  const [formData, setformData] = useState({
    title: "",
    ingredients: [""],
    instructions: "",
    category: "",
    photoUrl: "",
    cookingTime: "",
  });
  const navigate = useNavigate();
  const [error, seterror] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setformData((prev) => ({ ...prev, [field]: value })); //here we spread the previous state and update only the field that changed
  };
  const handleIngredientChange = (index, value) => {
    //here we handle the change for ingredients array
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    handleInputChange("ingredients", newIngredients);
    const lastIngredient =
      formData.ingredients[formData.ingredients.length - 1];
    if (error && lastIngredient.trim() !== "") {
      seterror("");
    }
  };
  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index); //filtering out the ingredient at the given index
      handleInputChange("ingredients", newIngredients);
      const lastIngredient =
        formData.ingredients[formData.ingredients.length - 1];
      if (error && lastIngredient.trim() !== "") {
        seterror("");
      }
    }
  };
  const addIngredient = () => {
    // here we add a new ingredient input field
    const lastIngredient =
      formData.ingredients[formData.ingredients.length - 1];
    if (lastIngredient.trim() !== "") {
      seterror("");
      handleInputChange("ingredients", [...formData.ingredients, ""]); //if last ingredient is not empty, we add a new empty ingredient
    } else {
      seterror("Please fill in the last ingredient before adding a new one");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/recipes", {
        title: formData.title,
        ingredients: formData.ingredients.filter((i) => i.trim() !== ""), //here we filter out any empty ingredients
        instructions: formData.instructions,
        category: formData.category,
        photoUrl: formData.photoUrl,
        cookingTime: formData.cookingTime
          ? Number(formData.cookingTime)
          : undefined,
      });
      navigate("/");
    } catch (error) {
      seterror("Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          🍽️ Add a New Recipe
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="e.g., Spaghetti Carbonara"
              required
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <div className="space-y-2">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder={`Ingredient ${index + 1}`}
                    required
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) =>
                handleInputChange("instructions", e.target.value)
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              rows="4"
              placeholder="Step-by-step cooking instructions..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              onChange={(e) => handleInputChange("category", e.target.value)}
              value={formData.category}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          {/* Cooking Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cooking Time (minutes)
            </label>
            <input
              type="number"
              value={formData.cookingTime}
              onChange={(e) => handleInputChange("cookingTime", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="e.g., 30"
              required
              min={0}
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <input
              type="text"
              value={formData.photoUrl}
              onChange={(e) => handleInputChange("photoUrl", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="https://example.com/photo.jpg"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md transition transform hover:-translate-y-0.5 hover:shadow-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            type="submit"
          >
            {loading ? "Adding..." : "Add Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
