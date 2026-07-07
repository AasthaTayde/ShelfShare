import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllBooks = async (page = 1) => {
  const response = await API.get(`/books?page=${page}`);
  return response.data;
};

export const searchBooks = async (keyword) => {
    const response = await API.get(
      `/books/search?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
};

export const getBookById = async (id) => {
  const response = await API.get(`/books/${id}`);
  return response.data;
};