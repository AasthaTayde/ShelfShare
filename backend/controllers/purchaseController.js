const Purchase = require("../models/Purchase");
const Book = require("../models/Books");

exports.requestPurchase = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    if (!book.availability) {
      return res.status(400).json({
        success: false,
        message: "Book is no longer available",
      });
    }

    if (book.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot purchase your own book",
      });
    }

    const existingRequest = await Purchase.findOne({
      buyer: req.user.id,
      book: book._id,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Purchase request already sent",
      });
    }

    const purchase = await Purchase.create({
      buyer: req.user.id,
      seller: book.owner,
      book: book._id,
    });

    res.status(201).json({
      success: true,
      message: "Purchase request sent successfully",
      purchase,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.myRequests = async (req, res) => {
    try {
      const purchases = await Purchase.find({
        buyer: req.user.id,
      })
        .populate("book")
        .populate("seller", "name email");
  
      res.status(200).json({
        success: true,
        count: purchases.length,
        purchases,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  exports.mySales = async (req, res) => {
    try {
      const purchases = await Purchase.find({
        seller: req.user.id,
      })
        .populate("buyer", "name email")
        .populate("book");
  
      res.status(200).json({
        success: true,
        count: purchases.length,
        purchases,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  exports.acceptPurchase = async (req, res) => {
    try {
      const purchase = await Purchase.findById(req.params.id);
  
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase request not found",
        });
      }
  
      // Only the seller can accept the request
      if (purchase.seller.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to accept this request",
        });
      }
  
      // Request must be pending
      if (purchase.status !== "Pending") {
        return res.status(400).json({
          success: false,
          message: "This request has already been processed",
        });
      }
  
      purchase.status = "Accepted";
      await purchase.save();
  
      res.status(200).json({
        success: true,
        message: "Purchase request accepted",
        purchase,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  exports.rejectPurchase = async (req, res) => {
    try {
      const purchase = await Purchase.findById(req.params.id);
  
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase request not found",
        });
      }
  
      if (purchase.seller.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to reject this request",
        });
      }
  
      if (purchase.status !== "Pending") {
        return res.status(400).json({
          success: false,
          message: "This request has already been processed",
        });
      }
  
      purchase.status = "Rejected";
      await purchase.save();
  
      res.status(200).json({
        success: true,
        message: "Purchase request rejected",
        purchase,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  exports.completePurchase = async (req, res) => {
    try {
      const purchase = await Purchase.findById(req.params.id);
  
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "Purchase request not found",
        });
      }
  
      // Only seller can complete the sale
      if (purchase.seller.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to complete this sale",
        });
      }
  
      // Sale must already be accepted
      if (purchase.status !== "Accepted") {
        return res.status(400).json({
          success: false,
          message: "Only accepted purchases can be completed",
        });
      }
  
      // Mark purchase as completed
      purchase.status = "Completed";
      await purchase.save();
  
      // Mark book as unavailable
      const book = await Book.findById(purchase.book);
  
      if (book) {
        book.availability = false;
        await book.save();
      }
  
      res.status(200).json({
        success: true,
        message: "Sale completed successfully",
        purchase,
        book,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };