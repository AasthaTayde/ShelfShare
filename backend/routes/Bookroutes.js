const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

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


router.post("/add",auth,upload.single("bookImage"),addBook);
router.get("/", getAllBooks);

router.get("/search", searchBooks);

router.get("/mybooks", auth, myBooks);

router.get("/:id", getBookById);

router.put("/:id",auth,upload.single("bookImage"),updateBook);

router.delete("/:id", auth, deleteBook);


module.exports = router;