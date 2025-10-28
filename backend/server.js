import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth.js";
import recipesRoutes from "./routes/recipes.js";
import { connectDB } from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
// console.log("PORT:", PORT);
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipesRoutes);

const __dirname = path.resolve(); //to get the current directory name
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); //here we are specifying the folder where our frontend build files are located
  app.get("/{*splat}", (req, res) => {
    //splat is a wildcard to match any route
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html")); //here we are sending the index.html file to the browser
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
