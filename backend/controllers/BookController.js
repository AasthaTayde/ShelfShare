const Book = require("../models/Books");
const uploadToCloudinary = require("../utils/CloudinaryUpload");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");


exports.addBook = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const {
      title,
      author,
      genre,
      description,
      condition,
      price,
    } = req.body;

    if (!title || !author || !genre || !price) {
      return res.status(400).json({
        success: false,
        message: "Title, Author, Genre and Price are required",
      });
    }

    let imageData = {
      url: "",
      public_id: "",
    };

    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "ShelfShare_Books"
      );

      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      condition,
      price,

      bookImage: imageData,

      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAllBooks = async (req, res) => {
  try {

    // Current page (default = 1)
    const page = parseInt(req.query.page) || 1;

    // Books per page (default = 12)
    const limit = parseInt(req.query.limit) || 12;

    // Skip previous books
    const skip = (page - 1) * limit;

    // Total number of books
    const totalBooks = await Book.countDocuments();

    // Fetch books for current page
    const books = await Book.find()
      .populate("owner", "name email")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalBooks / limit),
      totalBooks,
      count: books.length,
      books,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this book",
      });
    }

    // If a new image is uploaded
    if (req.file) {

      // Delete old image from Cloudinary
      if (book.bookImage && book.bookImage.public_id) {
        await cloudinary.uploader.destroy(book.bookImage.public_id);
      }

      // Upload new image
      const result = await uploadToCloudinary(
        req.file.buffer,
        "ShelfShare_Books"
      );

      req.body.bookImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (book.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this book",
      });
    }

    // Delete image from Cloudinary
    if (book.bookImage && book.bookImage.public_id) {
      await cloudinary.uploader.destroy(book.bookImage.public_id);
    }

    // Delete book from MongoDB
    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.searchBooks = async (req, res) => {
  try {

    const keyword = req.query.keyword || "";

    const books = await Book.find({

      $or: [

        { title: { $regex: keyword, $options: "i" } },

        { author: { $regex: keyword, $options: "i" } },

        { genre: { $regex: keyword, $options: "i" } }

      ]

    }).populate("owner", "name email");

    res.status(200).json({

      success: true,

      count: books.length,

      books

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message

    });

  }
};

exports.myBooks = async (req, res) => {
  try {
    const books = await Book.find({
      owner: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};