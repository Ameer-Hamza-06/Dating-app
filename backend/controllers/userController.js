const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const helper = require("../helper/helper");
const createToken = require("../utils/createToken");

// ****************** Get Users ********************
// @desc Get users
// @route GET /api/users
// @access Public
const getUser = asyncHandler(async (req, res) => {
  const users = await User.find(
    req.query.gender === "both" ? {} : { gender: req.query.gender }
  ).exec();
  res.status(200).json(users);
});

// ******************Register User ********************
// @desc Register User
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, gender, phoneNumber, email, password } = req.body;
  if (!helper.isValid(email)) {
    throw new Error("Email is not correct");
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(409).json({
      message: "User already exist",
      success: false,
      error: true,
    });
  }

  const user = await User.create({
    fullName,
    gender,
    phoneNumber,
    email,
    password,
  });

  res.json({
    data: {
      _id: user._id,
      fullName: user.fullName,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: user.password,
    },
    authToken: createToken(user._id),
    success: true,
    message: "User has been created",
  });
});

// ****************** Login User ********************
// @desc Login User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (helper.isValid(email)) {
    const user = await User.findOne({ email, active: true });

    if (user) {
      if (await user.matchPassword(password)) {
        res.json({
          data: {
            _id: user._id,
            fullName: user.fullName,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            email: user.email,
            password: user.password,
          },
          authToken: createToken(user._id),
          success: true,
          error: false,
          message: "User logged in successfully",
        });
      } else {
        res.status(404);
        throw new Error("Password not matched");
      }
    } else {
      throw new Error("Email not Found");
    }
  } else {
    throw new Error("Email not correct");
  }
});

// ****************** Update User ********************
// @desc Update User
// @route PUT /api/users/:id
// @access Public
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("User not Found");
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ updatedUser, message: "User updated successfully" });
});

// ****************** Delete User ********************
// @desc    Delete User by ID
// @route   delete api/users/:id
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("User not Found");
  }

  await user.remove();
  res.status(200).json({ id: req.params.id, message: "User has been deleted" });
});

// ****************** Active OR Inactive User ********************
// @desc    Find User by ID
// @route   delete api/users/:id/?action
// @access  Public
const activeUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  const userStatus = await User.findByIdAndUpdate(req.params.id, req.query, {
    new: true,
  });
  res.status(200).json({ user: userStatus, message: "User Status changed" });
});

// param Id
// user find on id
// user.active ? fasle : ture
//
// http://localhost:8000/endpoint/:id/?action true
// req.query.action
// await user.findByIdAndUpdate(req.params.id, req.query, {new: true})
module.exports = {
  getUser,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  activeUser,
};
