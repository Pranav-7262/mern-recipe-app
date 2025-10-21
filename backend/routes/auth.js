import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { protect } from "../middleware/auth.js";
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields!" });
    }
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      //here we using matchPassword method from User model
      return res.status(400).json({ message: "Invalid credential!" });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error!" });
  }
});

//Me
router.get("/me", protect, async (req, res) => {
  //used for protecting route , it means only logged in user can access this route
  //for current  logged in user informationnnnn.
  res.status(200).json(req.user); //it having user info from protect middleware
});

//Generate token  -->
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" }); //this line creates a JWT token with user id as payload, secret from env variable and expiry of 30 days
};

export default router;
