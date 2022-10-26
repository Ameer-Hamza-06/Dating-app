const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    fullName: String,
    discription: String,
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Enter Your Email"],
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
    password: String,
    image_key: String,
    image_url: String,
    images: [Object],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
