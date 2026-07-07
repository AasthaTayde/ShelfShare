import "./SearchBar.css";

function SearchBar({ search, setSearch, onSearch }) {
  return (
    <section className="search-section">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title, author or genre..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
        />

        <button
          className="search-btn"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
    </section>
  );
}

export default SearchBar;