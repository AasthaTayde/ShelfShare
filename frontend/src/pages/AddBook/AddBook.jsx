import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../../services/bookService";
import "./AddBook.css";

function AddBook() {

  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    genre: "",
    condition: "",
    price: "",
    description: "",
  });

  const [bookImage, setBookImage] = useState(null);

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

      await addBook(formData);

      alert("Book Added Successfully!");

      navigate("/");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message || "Failed to Add Book"
      );

    }
  };

  return (

    <div className="addbook-container">

      <form
        className="addbook-form"
        onSubmit={handleSubmit}
      >

        <h2>Sell Your Book</h2>

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
          placeholder="Description"
          rows="5"
          value={bookData.description}
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        <button type="submit">
          Add Book
        </button>

      </form>

    </div>

  );
}

export default AddBook;