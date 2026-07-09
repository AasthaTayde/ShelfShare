import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BookDetails.css";

import Navbar from "../../components/Navbar/Navbar";

import { getBookById } from "../../services/bookService";
import { createRequest } from "../../services/requestService";

function BookDetails() {

  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchBook();
  }, []);

  const fetchBook = async () => {

    try {

      const data = await getBookById(id);

      setBook(data.book);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const handleRequest = async () => {

    try {

      await createRequest(book._id);

      alert("Purchase Request Sent Successfully!");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to send request."
      );

    }

  };

  if (loading) {

    return (
      <>
        <Navbar />

        <h2
          style={{
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          Loading...
        </h2>
      </>
    );

  }

  return (
    <>
      <Navbar />

      <div className="book-details-page">

        <div className="book-image-section">

          <img
            src={
              book.bookImage?.url ||
              "https://via.placeholder.com/300x400"
            }
            alt={book.title}
          />

        </div>

        <div className="book-info">

          <h1>{book.title}</h1>

          <h3>{book.author}</h3>

          <p>
            <strong>Genre:</strong> {book.genre}
          </p>

          <p>
            <strong>Condition:</strong> {book.condition}
          </p>

          <p>
            <strong>Description:</strong> {book.description}
          </p>

          <h2>₹ {book.price}</h2>

          <hr />

          <h3>Seller Details</h3>

          <p>{book.owner.name}</p>

          <p>{book.owner.email}</p>

          {user && user.id !== book.owner._id && (
            <button
              className="buy-btn"
              onClick={handleRequest}
            >
              Request to Buy
            </button>
          )}

        </div>

      </div>

    </>
  );
}

export default BookDetails;