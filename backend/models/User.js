import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  //Pre save middleware
  if (!this.isModified("password")) return next(); // If password is not modified, proceed to next middleware
  const salt = await bcrypt.genSalt(10); // generate a salt with 10 rounds
  // salt adds random data to the password before hashing for security
  this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with hashed password
};
const User = mongoose.model("User", userSchema); //User model creation
export default User;
