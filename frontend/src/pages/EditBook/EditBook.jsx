import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getBookById,
  updateBook,
} from "../../services/bookService";
import "./EditBook.css";

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    genre: "",
    condition: "",
    price: "",
    description: "",
  });

  const [bookImage, setBookImage] = useState(null);

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {
    try {
      const data = await getBookById(id);

      setBookData({
        title: data.book.title,
        author: data.book.author,
        genre: data.book.genre,
        condition: data.book.condition,
        price: data.book.price,
        description: data.book.description,
      });

    } catch (error) {

      console.log(error);

      alert("Failed to load book.");

    } finally {

      setLoading(false);

    }
  };

  const handleChange = (e) => {
    setBookData({
      ...bookData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setBookImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append("title", bookData.title);
      formData.append("author", bookData.author);
      formData.append("genre", bookData.genre);
      formData.append("condition", bookData.condition);
      formData.append("price", bookData.price);
      formData.append("description", bookData.description);

      if (bookImage) {
        formData.append("bookImage", bookImage);
      }

      await updateBook(id, formData);

      alert("Book Updated Successfully!");

      navigate("/my-books");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to update book."
      );

    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div className="editbook-container">

      <form
        className="editbook-form"
        onSubmit={handleSubmit}
      >

        <h2>Edit Book</h2>

        <input
          type="text"
          name="title"
          placeholder="Book Title"
          value={bookData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="author"
          placeholder="Author"
          value={bookData.author}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={bookData.genre}
          onChange={handleChange}
          required
        />

        <select
          name="condition"
          value={bookData.condition}
          onChange={handleChange}
          required
        >
          <option value="">Select Condition</option>
          <option>Like New</option>
          <option>Good</option>
          <option>Fair</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={bookData.price}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          rows="5"
          placeholder="Description"
          value={bookData.description}
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit">
          Update Book
        </button>

      </form>

    </div>
  );
}

export default EditBook;