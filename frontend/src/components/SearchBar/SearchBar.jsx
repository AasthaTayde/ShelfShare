import "./SearchBar.css";

function SearchBar() {
  return (
    <section className="search-section">

      <div className="search-container">

        <input
          type="text"
          placeholder="Search by title, author or genre..."
          className="search-input"
        />

        <button className="search-btn">
          Search
        </button>

      </div>

    </section>
  );
}

export default SearchBar;