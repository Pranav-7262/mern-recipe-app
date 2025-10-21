import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],

    instructions: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: false,
    },
    cookingTime: {
      type: Number,
      required: true,
    },
    createdBy: {
      // It is required to know which user created which recipe
      type: mongoose.Schema.Types.ObjectId, // Reference to User model
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model("Recipe", recipeSchema); //Recipe model creation
export default Recipe;
