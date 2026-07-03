const express = require("express");
const router = express.Router();

const auth = require("../middleware/midauth");

const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/BookController");

router.post("/", auth, addBook);

router.get("/", getAllBooks);

router.get("/:id", getBookById);

router.put("/:id", auth, updateBook);

router.delete("/:id", auth, deleteBook);

module.exports = router;