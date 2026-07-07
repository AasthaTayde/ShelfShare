import { useEffect, useState } from "react";
import "./Home.css";

import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import SearchBar from "../../components/SearchBar/SearchBar";
import BookCard from "../../components/BookCard/BookCard";

import { getAllBooks } from "../../services/bookService";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getAllBooks();
      setBooks(data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Hero />
        <SearchBar />
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>
          Loading Books...
        </h2>
      </>
    );
  }

  return (
    <div className="home">
      <Navbar />

      <Hero />

      <SearchBar />

      <section className="books-section">
        <h2>Explore Books</h2>

        <div className="books-grid">
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
              />
            ))
          ) : (
            <h3>No books available.</h3>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;