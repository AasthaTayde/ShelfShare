import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <Link to="/">📚 ShelfShare</Link>
      </div>

      <div className="nav-center">
        <Link to="/">Home</Link>
        <Link to="/add-book">Sell Book</Link>
        <Link to="/my-books">My Books</Link>
        <Link to="/purchase-requests">Requests</Link>
      </div>

      <div className="nav-right">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>

    </nav>
  );
}

export default Navbar;