const Book = require("../models/Books");
const uploadToCloudinary = require("../utils/CloudinaryUpload");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const axios = require("axios");
const Request = require("../models/Request");

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
      pickupAddress,
    } = req.body;

    if (!title || !author || !genre || !price || !pickupAddress) {
      return res.status(400).json({
        success: false,
        message: "Title, Author, Genre and Price are required",
      });
    }
    // Convert address into coordinates

    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: pickupAddress,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "ShelfShare",
        },
      }
    );

    if (geoResponse.data.length === 0) {

      return res.status(400).json({
        success: false,
        message: "Invalid pickup address.",
      });

    }

    const latitude = parseFloat(
      geoResponse.data[0].lat
    );

    const longitude = parseFloat(
      geoResponse.data[0].lon
    );

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
      pickupAddress,

      pickupLocation: {

        type: "Point",

        coordinates: [longitude, latitude],

      },
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

    // If pickup address changes, regenerate coordinates
    if (req.body.pickupAddress) {

      const geoResponse = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: req.body.pickupAddress,
            format: "json",
            limit: 1,
          },
          headers: {
            "User-Agent": "ShelfShare",
          },
        }
      );

      if (geoResponse.data.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid pickup address.",
        });
      }

      const latitude = parseFloat(geoResponse.data[0].lat);
      const longitude = parseFloat(geoResponse.data[0].lon);

      req.body.pickupLocation = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
    }

    // If a new image is uploaded
    if (req.file) {

      // Delete old Cloudinary image
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

    // Delete all purchase requests related to this book
    await Request.deleteMany({
      book: book._id,
    });

    // Delete the book
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
// Get Nearby Books

exports.getNearbyBooks = async (req, res) => {

  try {

    const { keyword, address, radius } = req.query;

    if (!keyword || !address) {

      return res.status(400).json({
        success: false,
        message: "Keyword and address are required."
      });

    }

    const searchRadius = Number(radius) || 10;

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "ShelfShare"
        }
      }
    );

    if (response.data.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Location not found."
      });

    }


    const latitude = Number(response.data[0].lat);
    const longitude = Number(response.data[0].lon);

    console.log("=================================");
    console.log("Search Address:", address);
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
    console.log("Full OSM Response:", response.data[0]);
    console.log("=================================");

    const books = await Book.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distance",
          maxDistance: searchRadius * 1000,
          spherical: true,
        },
      },
    
      {
        $match: {
          $or: [
            {
              title: {
                $regex: keyword,
                $options: "i",
              },
            },
            {
              author: {
                $regex: keyword,
                $options: "i",
              },
            },
            {
              genre: {
                $regex: keyword,
                $options: "i",
              },
            },
          ],
        },
      },
    
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
    
      {
        $unwind: "$owner",
      },
    
      {
        $project: {
          title: 1,
          author: 1,
          genre: 1,
          description: 1,
          condition: 1,
          price: 1,
          availability: 1,
          pickupAddress: 1,
          pickupLocation: 1,
          bookImage: 1,
    
          distance: {
            $round: [
              {
                $divide: ["$distance", 1000],
              },
              2,
            ],
          },
    
          owner: {
            _id: "$owner._id",
            name: "$owner.name",
            email: "$owner.email",
            phone: "$owner.phone",
          },
        },
      },
    ]);
    
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