const express = require("express");
const router = express.Router();
const {
  getUser,
  registerUser,
  loginUser,
} = require("../controllers/userController");
const { protectAuth } = require("../middleware/authMiddleware");

router.get("/", getUser);
router.post("/", registerUser);
router.post("/login", loginUser);

module.exports = router;
