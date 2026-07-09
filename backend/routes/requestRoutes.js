const express = require("express");
const router = express.Router();

const auth = require("../middleware/midauth");

const {
  createRequest,
  getMyRequests,
  getBuyerRequests,
  updateRequestStatus,
} = require("../controllers/RequestController");

router.post("/create/:bookId", auth, createRequest);

// Seller Requests
router.get("/my", auth, getMyRequests);

// Buyer Requests
router.get("/buyer", auth, getBuyerRequests);

// Accept / Reject
router.put("/:id", auth, updateRequestStatus);

module.exports = router;