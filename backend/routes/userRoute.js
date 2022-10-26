const express = require("express");
const router = express.Router();
const {
  getUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  activeUser,
} = require("../controllers/userController");
const { protectAuth } = require("../middleware/authMiddleware");

router.get("/", getUser);
router.post("/", registerUser);
router.post("/login", loginUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", activeUser);

module.exports = router;
