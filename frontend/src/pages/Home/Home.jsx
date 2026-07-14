import { useEffect, useState } from "react";
import "./Home.css";

import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import SearchBar from "../../components/SearchBar/SearchBar";
import BookCard from "../../components/BookCard/BookCard";

import {
  getAllBooks,
  searchBooks,
  searchNearbyBooks,
} from "../../services/bookService";

import toast from "react-hot-toast";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // Default nearby search radius
  const [radius] = useState(20);

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

  const handleSearch = async () => {
    try {
      if (search.trim() === "") {
        fetchBooks();
        return;
      }

      const data = await searchBooks(search);

      setBooks(data.books);
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    }
  };

  const handleNearbySearch = () => {
    if (search.trim() === "") {
      toast.error("Please enter a book title, author or genre first.");
      return;
    }

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const locationData = await response.json();

          const data = await searchNearbyBooks(
            search,
            locationData.display_name,
            radius
          );

          setBooks(data.books);

          if (data.books.length === 0) {
            toast("No nearby books found.");
          } else {
            toast.success(`${data.books.length} nearby books found.`);
          }
        } catch (error) {
          console.error(error);
          toast.error("Nearby search failed.");
        }
      },
      () => {
        toast.error("Location permission denied.");
      }
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <Hero />

        <SearchBar
          search={search}
          setSearch={setSearch}
          onSearch={handleSearch}
          onNearbySearch={handleNearbySearch}
        />

        <h2
          style={{
            textAlign: "center",
            marginTop: "40px",
          }}
        >
          Loading Books...
        </h2>
      </>
    );
  }

  return (
    <div className="home">
      <Navbar />

      <Hero />

      <SearchBar
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
        onNearbySearch={handleNearbySearch}
      />

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
            <h3
              style={{
                textAlign: "center",
              }}
            >
              No books found.
            </h3>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;