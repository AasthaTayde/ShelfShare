const express = require("express");
const router = express.Router();

const auth = require("../middleware/midauth");

const {
  requestPurchase,
  myRequests,
  mySales,
  acceptPurchase,
  rejectPurchase,
  completePurchase,
} = require("../controllers/purchaseController");

router.post("/request/:bookId", auth, requestPurchase);
router.get("/myrequests", auth, myRequests);
router.get("/mysales", auth, mySales);
router.put("/accept/:id", auth, acceptPurchase);
router.put("/reject/:id", auth, rejectPurchase);
router.put("/complete/:id", auth, completePurchase);
module.exports = router;