import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <nav className="navbar">

      <div className="logo">
        <Link to="/">📚 ShelfShare</Link>
      </div>

      <div className="nav-center">

        <Link to="/">Home</Link>

        {token && (
          <>
            <Link to="/add-book">Sell Book</Link>

            <Link to="/my-books">My Books</Link>

            <Link to="/purchase-requests">
              Requests
            </Link>
          </>
        )}

      </div>

      <div className="nav-right">

        {token ? (

          <>
            <span className="username">
              Hi, {user?.name}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>

        ) : (

          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>

        )}

      </div>

    </nav>

  );
}

export default Navbar;