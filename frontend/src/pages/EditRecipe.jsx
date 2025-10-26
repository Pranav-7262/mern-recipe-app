import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditRecipe = () => {
  const [formData, setformData] = useState({
    title: "",
    ingredients: [""],
    instructions: "",
    category: "",
    photoUrl: "",
    cookingTime: "",
  });
  const { id } = useParams();
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
      handleInputChange("ingredients", [...formData.ingredients, ""]);
    } else {
      seterror("Please fill in the last ingredient before adding a new one");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/recipes/${id}`, {
        title: formData.title,
        ingredients: formData.ingredients.filter((i) => i.trim() !== ""),
        instructions: formData.instructions,
        category: formData.category,
        photoUrl: formData.photoUrl,
        cookingTime: formData.cookingTime
          ? Number(formData.cookingTime)
          : undefined,
      });
      navigate("/");
    } catch (error) {
      seterror("Failed to Update recipe");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await axios.get(`/api/recipes/${id}`);
      setformData({
        title: res.data.title,
        ingredients: res.data.ingredients,
        instructions: res.data.instructions,
        category: res.data.category,
        photoUrl: res.data.photoUrl,
        cookingTime: res.data.cookingTime,
      });
    };
    fetchRecipe();
  }, [id]);
  if (!formData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Edit Recipe </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Ingredients</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="w-full p-2 border rounded"
                placeholder={`Ingredient ${index + 1}`}
                required
              />
              {formData.ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={addIngredient}
          >
            Add Ingredient
          </button>
        </div>
        <div>
          <label className="block text-gray-700">Instructions</label>
          <textarea
            type="text"
            value={formData.instructions}
            onChange={(e) => handleInputChange("instructions", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Category</label>
          <select
            onChange={(e) => handleInputChange("category", e.target.value)}
            value={formData.category}
            className="w-full p-2 border rounded"
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
        <div>
          <label className="block text-gray-700">Cooking Time (minutes) </label>
          <input
            type="number"
            value={formData.cookingTime}
            onChange={(e) => handleInputChange("cookingTime", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., 30"
            required
            min={0}
          />
        </div>
        <div>
          <label className="block text-gray-700">Photo Url </label>
          <input
            type="text"
            value={formData.photoUrl}
            onChange={(e) => handleInputChange("photoUrl", e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="url"
            required
          />
        </div>
        <button
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
          type="submit"
        >
          {loading ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
