import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token");

  const loginTime = localStorage.getItem("loginTime");

  if (!token || !loginTime) {

    return <Navigate to="/login" replace />;

  }

  const oneHour = 60 * 60 * 1000;

  const expired = Date.now() - Number(loginTime) > oneHour;

  if (expired) {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem("loginTime");

    return <Navigate to="/login" replace />;

  }

  return children;

}

export default ProtectedRoute;