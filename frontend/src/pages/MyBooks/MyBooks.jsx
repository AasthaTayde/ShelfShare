import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import BookCard from "../../components/BookCard/BookCard";
import { getMyBooks, deleteBook } from "../../services/bookService";
import "./MyBooks.css";

function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const data = await getMyBooks();
      console.log(data);
      setBooks(data.books);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) return;

    try {
      await deleteBook(id);

      alert("Book deleted successfully!");

      // Refresh the list
      fetchMyBooks();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Failed to delete book."
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>
          Loading...
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="mybooks-container">
        <h1>My Books</h1>

        <div className="mybooks-grid">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                isOwner={true}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <h3 style={{ textAlign: "center" }}>
              No books uploaded yet.
            </h3>
          )}
        </div>
      </div>
    </>
  );
}

export default MyBooks;