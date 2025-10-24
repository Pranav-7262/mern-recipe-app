import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import recipesRoutes from "./routes/recipes.js";
import { connectDB } from "./config/db.js";
dotenv.config();
const PORT = process.env.PORT || 5000;
// console.log("PORT:", PORT);
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipesRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
