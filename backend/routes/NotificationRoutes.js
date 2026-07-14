const express = require("express");

const router = express.Router();

const auth = require("../middleware/midauth");

const {

  getNotifications,

  markAsRead,

} = require("../controllers/NotificationController");

router.get("/", auth, getNotifications);

router.put("/:id/read", auth, markAsRead);

module.exports = router;