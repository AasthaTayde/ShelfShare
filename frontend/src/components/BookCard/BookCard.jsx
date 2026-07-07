import "./BookCard.css";

function BookCard({ book }) {
  return (
    <div className="book-card">

      <img
        src={book.bookImage?.url || "https://via.placeholder.com/250x320?text=No+Image"}
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

        <button className="view-btn">
          View Details
        </button>

      </div>

    </div>
  );
}

export default BookCard;