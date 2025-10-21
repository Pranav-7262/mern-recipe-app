import express from "express";
import Recipe from "../models/Recipe.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

// POST /api/recipes
router.post("/", protect, async (req, res) => {
  const { title, ingredients, instructions, category, photoUrl, cookingTime } =
    req.body;
  try {
    if (
      !title ||
      !ingredients ||
      !instructions ||
      !category ||
      !photoUrl ||
      !cookingTime
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    // Normalize ingredients: accept array or comma-separated string
    let ingredientsArr = ingredients; // Assume it's an array , here we accept both array and string
    if (typeof ingredients === "string") {
      ingredientsArr = ingredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);
    }

    // Normalize cookingTime: accept number or strings like "25 mins" -> 25
    let cookingTimeNum = cookingTime;
    if (typeof cookingTime === "string") {
      const m = cookingTime.match(/\d+/);
      cookingTimeNum = m ? Number(m[0]) : NaN;
    }
    if (isNaN(cookingTimeNum)) {
      return res
        .status(400)
        .json({ message: "Invalid cookingTime; expected number of minutes" });
    }

    const recipe = new Recipe({
      title,
      ingredients: ingredientsArr,
      instructions,
      category,
      photoUrl,
      cookingTime: cookingTimeNum,
      createdBy: req.user?._id,
    });
    const createdRecipe = await recipe.save(); // Save the new recipe to the database
    res.status(201).json(createdRecipe);
  } catch (error) {
    // Provide error message to help debugging
    console.error("Create recipe error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// GET /api/recipes?category=categoryName
router.get("/", async (req, res) => {
  const { category } = req.query;
  try {
    const query = category ? { category } : {}; // If category is provided, filter by it else get all
    const recipes = await Recipe.find(query).populate(
      "createdBy",
      "username email"
    ); //this populates the createdBy field with username and email from User model
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  // Used to get a specific recipe by its ID
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id).populate(
      "createdBy",
      "username email"
    ); // Populate the createdBy field with username and email from User model
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT /api/recipes/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const {
      title,
      ingredients,
      instructions,
      category,
      photoUrl,
      cookingTime,
    } = req.body;

    // Normalize ingredients
    let ingredientsArr = recipe.ingredients;
    if (ingredients) {
      ingredientsArr =
        typeof ingredients === "string"
          ? ingredients
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean)
          : ingredients;
    }

    // Normalize cookingTime
    let cookingTimeNum = recipe.cookingTime; //here we accept both array and string
    if (cookingTime) {
      if (typeof cookingTime === "string") {
        const m = cookingTime.match(/\d+/);
        cookingTimeNum = m ? Number(m[0]) : NaN;
      } else {
        cookingTimeNum = cookingTime;
      }
      if (isNaN(cookingTimeNum)) {
        return res
          .status(400)
          .json({ message: "Invalid cookingTime; expected number of minutes" });
      }
    }

    if (typeof title !== "undefined") recipe.title = title;
    if (typeof ingredients !== "undefined") recipe.ingredients = ingredientsArr;
    if (typeof instructions !== "undefined") recipe.instructions = instructions;
    if (typeof category !== "undefined") recipe.category = category;
    if (typeof photoUrl !== "undefined") recipe.photoUrl = photoUrl;
    if (typeof cookingTime !== "undefined") recipe.cookingTime = cookingTimeNum;

    const updatedRecipe = await recipe.save();
    res.json(updatedRecipe);
  } catch (error) {
    console.error("Update recipe error:", error);
    res.status(500).json({ message: "Server Error for update" });
  }
});

// DELETE /api/recipes/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const removeRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!removeRecipe) {
      res.status(404).json({ message: "Recipe not found" });
    }
    if (removeRecipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized " });
    }
    res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;

// | Step      | Needs Token | URL Example        | Description         |
// | --------- | ----------- | ------------------ | ------------------- |
// | POST      | ✅           | `/api/recipes`     | Create a recipe     |
// | GET all   | ❌           | `/api/recipes`     | List all recipes    |
// | GET by ID | ❌           | `/api/recipes/:id` | Get specific recipe |
// | PUT       | ✅           | `/api/recipes/:id` | Update recipe       |
// | DELETE    | ✅           | `/api/recipes/:id` | Delete recipe       |
