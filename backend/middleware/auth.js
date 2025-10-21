import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Middleware function to protect routes
export const protect = async (req, res, next) => {
  let token; // Variable to store the token from headers

  // Check if the request has an Authorization header that starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Format: "Bearer <token>", so split by space and take the second part
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); //jwt.verify throws error if token is invalid

      // Use the decoded id to find the user in the database
      // Exclude the password field using .select("-password")
      req.user = await User.findById(decoded.id).select("-password");

      // Call the next middleware or route handler
      return next();
    } catch (err) {
      // If token verification fails, log the error and return 401 Unauthorized
      console.error("Token verification failed: ", err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token is found in the headers, return 401 Unauthorized
  return res.status(401).json({ message: "Not authorized, token failed" });
};
