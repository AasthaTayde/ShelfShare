import "./BookCard.css";
import { useNavigate } from "react-router-dom";

function BookCard({ book }) {

  const navigate = useNavigate();

  return (
    <div className="book-card">

      <img
        src={
          book.bookImage?.url ||
          "https://via.placeholder.com/250x320?text=No+Image"
        }
        alt={book.title}
        className="book-image"
      />

      <div className="book-details">

        <h3>{book.title}</h3>

        <p className="author">
          {book.author}
        </p>

        <span className="genre">
          {book.genre}
        </span>

        <p className="condition">
          {book.condition}
        </p>

        <h2 className="price">
          ₹ {book.price}
        </h2>

        <button
          className="view-btn"
          onClick={() => navigate(`/book/${book._id}`)}
        >
          View Details
        </button>

      </div>

    </div>
  );
}

export default BookCard;