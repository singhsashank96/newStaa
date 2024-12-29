const mongoose = require("mongoose");

const Userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    }
  ,
    phoneNum: {
      type: String,
      required: true,
      unique: true,

    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    otp: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    coin: {
      type: Number,
      default: 0,
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", Userschema);
module.exports = User;
