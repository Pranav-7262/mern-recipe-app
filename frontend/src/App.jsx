import React from "react";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddRecipe from "./pages/AddRecipe";

const App = () => {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-recipe" element={<AddRecipe />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
