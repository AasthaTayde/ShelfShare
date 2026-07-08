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
// Add New Book
export const addBook = async (bookData) => {

  const token = localStorage.getItem("token");

  const response = await API.post(
    "/books/add",
    bookData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteBook = async (id) => {

  const token = localStorage.getItem("token");

  const response = await API.delete(`/books/${id}`, {

    headers: {
      Authorization: `Bearer ${token}`,
    },

  });

  return response.data;

};
export const getMyBooks = async () => {

  const token = localStorage.getItem("token");

  const response = await API.get(
    "/books/mybooks",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};