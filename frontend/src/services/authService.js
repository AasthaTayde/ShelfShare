import axios from "axios";

const API = axios.create({
  baseURL: "https://bookflow-backend-jz01.onrender.com/api/auth",
 
});

// Signup
export const signupUser = async (userData) => {
  const response = await API.post("/signup", userData);
  return response.data;
};

// Login
export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};