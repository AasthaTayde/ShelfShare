import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoNotifications } from "react-icons/io5";
import {getNotifications,markNotificationAsRead,} from "../../services/NotificationService";
import logo from "../../assets/logo.png";
import "./Navbar.css";


function Navbar() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {

    if (token) {

      fetchNotifications();

    }

  }, []);

  const fetchNotifications = async () => {

    try {

      const data = await getNotifications();

      setNotifications(data.notifications);

    } catch (error) {

      console.log(error);

    }

  };

  const handleNotificationClick = async (id) => {

    try {

      await markNotificationAsRead(id);

      fetchNotifications();

    } catch (error) {

      console.log(error);

    }

  };

  const unreadCount = notifications.filter(

    (notification) => !notification.isRead

  ).length;

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem("loginTime");

    navigate("/login");

  };

  return (

    <nav className="navbar">

<div className="logo">
  <Link to="/">
    <img
      src={logo}
      alt="BookFlow Logo"
      className="logo-img"
    />

    <span>BookFlow</span>
  </Link>
</div>
      

      <div className="nav-center">

        <Link to="/">Home</Link>

        {token && (

          <>

            <Link to="/add-book">Sell Book</Link>

            <Link to="/my-books">My Books</Link>

            <Link to="/purchase-requests">

              Seller Requests

            </Link>

            <Link to="/buyer-requests">

              My Requests

            </Link>

          </>

        )}

      </div>

      <div className="nav-right">

        {token ? (

          <>

            <div
              className="notification-icon"
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
            >

              <IoNotifications />

              {

                unreadCount > 0 && (

                  <span className="notification-badge">

                    {unreadCount}

                  </span>

                )

              }

            </div>

            {

              showNotifications && (

                <div className="notification-dropdown">

                  <h3>Notifications</h3>

                  {

                    notifications.length === 0 ?

                      (

                        <p className="empty-notification">

                          No notifications

                        </p>

                      )

                      :

                      (

                        notifications.map((notification) => (

                          <div

                            key={notification._id}

                            className={`notification-item ${notification.isRead ? "read" : "unread"}`}

                            onClick={() =>
                              handleNotificationClick(notification._id)
                            }

                          >

                            <h4>

                              {notification.title}

                            </h4>

                            <p>

                              {notification.message}

                            </p>

                            <small>

                              {

                                new Date(

                                  notification.createdAt

                                ).toLocaleString()

                              }

                            </small>

                          </div>

                        ))

                      )

                  }

                </div>

              )

            }

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