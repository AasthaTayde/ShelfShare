const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const auth = require("../middleware/midauth");
router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", auth, (req, res) => {
    res.status(200).json({
      success: true,
      message: "Protected route accessed",
      user: req.user,
    });
  });
  

module.exports = router;