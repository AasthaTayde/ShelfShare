const Request = require("../models/Request");
const Book = require("../models/Books");

// Create Purchase Request

exports.createRequest = async (req, res) => {
  try {

    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Owner cannot buy own book
    if (book.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own book.",
      });
    }

    // Prevent duplicate requests
    const existingRequest = await Request.findOne({
      book: book._id,
      buyer: req.user.id,
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request already sent.",
      });
    }

    const request = await Request.create({
      book: book._id,
      buyer: req.user.id,
      seller: book.owner,
    });

    res.status(201).json({
      success: true,
      message: "Purchase request sent.",
      request,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// Get all requests received by seller

exports.getMyRequests = async (req, res) => {

    try {
  
      const requests = await Request.find({
        seller: req.user.id,
      })
        .populate("book")
        .populate("buyer", "name email");
  
      res.status(200).json({
        success: true,
        count: requests.length,
        requests,
      });
  
    } catch (error) {
  
      res.status(500).json({
        success: false,
        message: error.message,
      });
  
    }
  
  };

  // Get all requests sent by buyer

exports.getBuyerRequests = async (req, res) => {

  try {

    const requests = await Request.find({
      buyer: req.user.id,
    })
      .populate("book")
      .populate("seller", "name email");

    res.status(200).json({

      success: true,

      count: requests.length,

      requests,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

  // Accept / Reject Request

exports.updateRequestStatus = async (req, res) => {

    try {
  
      const { status } = req.body;
  
      if (!["Accepted", "Rejected"].includes(status)) {
  
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
  
      }
  
      const request = await Request.findById(req.params.id);
  
      if (!request) {
  
        return res.status(404).json({
          success: false,
          message: "Request not found",
        });
  
      }
  
      if (request.seller.toString() !== req.user.id) {
  
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
  
      }
  
      request.status = status;
  
      await request.save();
  
      res.status(200).json({
  
        success: true,
  
        message: `Request ${status}`,
  
        request,
  
      });
  
    } catch (error) {
  
      res.status(500).json({
  
        success: false,
  
        message: error.message,
  
      });
  
    }
  
  };