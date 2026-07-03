const express = require("express");
const router = express.Router();

const auth = require("../middleware/midauth");

const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
  myBooks,
} = require("../controllers/BookController");

router.post("/", auth, addBook);

router.get("/", getAllBooks);

router.get("/search", searchBooks);

router.get("/mybooks", auth, myBooks);

router.get("/:id", getBookById);

router.put("/:id", auth, updateBook);

router.delete("/:id", auth, deleteBook);


module.exports = router;