import { Routes, Route } from "react-router-dom";
import EditBook from "./pages/EditBook/EditBook";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import AddBook from "./pages/AddBook/AddBook";
import MyBooks from "./pages/MyBooks/MyBooks";
import BookDetails from "./pages/BookDetails/BookDetails";
import PurchaseRequests from "./pages/PurchaseRequests/PurchaseRequests";
import BuyerRequests from "./pages/BuyerRequests/BuyerRequests";

function App() {
  return (
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/add-book" element={<AddBook />} />

        <Route path="/my-books" element={<MyBooks />} />

        <Route path="/book/:id" element={<BookDetails />} />

        <Route path="/edit-book/:id" element={<EditBook />} />

        <Route path="/purchase-requests"element={<PurchaseRequests />}/>
        
        <Route path="/my-requests"element={<BuyerRequests />}/>

      </Routes>
  );
}

export default App;