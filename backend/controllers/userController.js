const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const helper = require("../helper/helper");
const createToken = require("../utils/createToken");

// ****************** Get Users ********************
// @desc Get users
// @route GET /api/users
// @access Public
const getUser = asyncHandler(async (req, res) => {
  //   let users;
  //   if (req.query.gender === "both") {
  //     users = await User.find({}).exec();
  //   } else {
  //     users = await User.find({ gender: req.query.gender }).exec();
  //   }

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

  const userExist = await User.findOne({ email: email });

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
    const user = await User.findOne({ email });

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

module.exports = { getUser, registerUser, loginUser };
