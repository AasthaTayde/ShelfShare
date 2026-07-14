import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AddBook from "./pages/AddBook/AddBook";
import MyBooks from "./pages/MyBooks/MyBooks";
import BookDetails from "./pages/BookDetails/BookDetails";
import EditBook from "./pages/EditBook/EditBook";
import PurchaseRequests from "./pages/PurchaseRequests/PurchaseRequests";
import BuyerRequests from "./pages/BuyerRequests/BuyerRequests";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/book/:id"
        element={<BookDetails />}
      />

      <Route
        path="/add-book"
        element={
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-books"
        element={
          <ProtectedRoute>
            <MyBooks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-book/:id"
        element={
          <ProtectedRoute>
            <EditBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/purchase-requests"
        element={
          <ProtectedRoute>
            <PurchaseRequests />
          </ProtectedRoute>
        }
      />

      <Route
        path="/buyer-requests"
        element={
          <ProtectedRoute>
            <BuyerRequests />
          </ProtectedRoute>
        }
      />

    </Routes>

  );

}

export default App;