const User = require("../Models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Conversation = require("../Models/Conversation.js");
const ObjectId = require("mongoose").Types.ObjectId;
const cloudinary = require("cloudinary").v2;
const imageupload = require("../config/imageupload.js");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const JWT_SECRET = "sahh34";

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_ClOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const register = async (req, res) => {
  try {
    console.log("Register request received");

    const { name, phoneNum, password } = req.body;

    // Check if the fields are provided
    if (!name || !phoneNum || !password) {
      return res.status(400).json({
        error: "Please fill all the required fields (name, phone number, and password).",
      });
    }

    console.log("Checking if user already exists...");

    // Check if the user already exists
    const existingNumber = await User.findOne({ phoneNum });

    if (existingNumber) {
      return res.status(400).json({
        error: "User with this phone number already exists.",
      });
    }

    console.log("Handling profile picture...");

    // Handle profile picture
    let imageUrl = `https://ui-avatars.com/api/?name=${name}&background=random&bold=true`;

    console.log("Hashing the password...");
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    console.log("Creating new user...");

    // Create the new user
    const newUser = new User({
      name,
      phoneNum,
      password: secPass,
      profilePic: imageUrl,
    });

    await newUser.save();

    console.log("Generating JWT token...");

    // Generate JWT token for the new user
    const data = {
      user: {
        id: newUser.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);

    // Send the response with the token
    res.json({
      authtoken,
    });

  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).send("Internal Server Error");
  }
};






const login = async (req, res) => {
  console.log("login request received");

  try {
    const { phoneNum, password, otp } = req.body;

    if (!phoneNum || (!password && !otp)) {
      return res.status(400).json({
        error: "Please fill all the fields",
      });
    }

    const user = await User.findOne({
      phoneNum: phoneNum,
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid Credentials",
      });
    }
    console.log("hii");
    if (otp) {
      if (user.otp != otp) {
        return res.status(400).json({
          error: "Invalid otp",
        });
      }
      user.otp = "";
      await user.save();
    } else {
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          error: "Invalid Credentials",
        });
      }
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({
      authtoken,
      user: {
        _id: user.id,
        name: user.name,
        phoneNum: user.phoneNum,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const authUser = async (req, res) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send("Please authenticate using a valid token");
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);

    if (!data) {
      return res.status(401).send("Please authenticate using a valid token");
    }

    const user = await User.findById(data.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

const allUser = async (req, res) => {
  const requser = req.user;

  try {
    const users = await User.find().select("-password");
    //filter users such bot for other users are not included
    // users.forEach((user) => {
    //   if ( user.email != requser.email) {
    //     users.splice(users.indexOf(user), 1);
    //   }
    // });
    res.json(users);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};



const getUserById = async (req, res) => {
  try {
    // Extract user ID from request parameters
    const userId = req.params.id;

    // Fetch the user by ID and exclude the password field
    const user = await User.findById(userId).select("-password");

    // If user is not found, send a 404 response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send the user data in the response
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const updateprofile = async (req, res) => {
  try {
    const dbuser = await User.findById(req.user.id);

    if (req.body.newpassword) {
      const passwordCompare = await bcrypt.compare(
        req.body.oldpassword,
        dbuser.password
      );
      if (!passwordCompare) {
        return res.status(400).json({
          error: "Invalid Credentials",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.newpassword, salt);
      req.body.password = secPass;

      delete req.body.oldpassword;
      delete req.body.newpassword;
    }
    await User.findByIdAndUpdate(req.user.id, req.body);
    res.status(200).json({ message: "Profile Updated" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const sendotp = async (req, res) => {
  try {
    console.log("sendotp request received");
    const { email } = req.body;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();

    //delete otp after 5 minutes
    setTimeout(() => {
      user.otp = "";
      user.save();
    }, 300000);

    let mailDetails = {
      from: process.env.EMAIL,
      to: email,
      subject: "Login with your Otp",

      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <title>Otp for Login</title>
          <style>
              .container {
                  width: 50%;
                  margin: 0 auto;
                  background: #f4f4f4;
                  padding: 20px;
              }
              h1 {
                  text-align: center;
              }
    
          </style> 
      </head>
      <body>
              <strong><h1>Conversa - online chatting app</h1></strong>
          <div class="container">
              <h2>Your Otp is</h2>
              <strong><p>${otp}</p><strong>
              <p>Use this Otp to login</p>
          </div>
      </body>
      </html>`,
    };

    await mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log("Error Occurs", err);
        res.status(400).json({ message: "Error Occurs" });
      } else {
        console.log("Email sent successfully");
        res.status(200).json({ message: "OTP sent" });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};


const getCoins = async (req, res) => {
  try {
    const userId = req.params.id; // User ID from the route parameters
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ coins: user.coin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add coins to a user
const addCoins = async (req, res) => {
  try {
    const { userId, coins } = req.body;
    if (!userId || coins === undefined) {
      return res.status(400).json({ error: "User ID and coins are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.coin += coins; // Increment user's coins
    await user.save();
    res.status(200).json({ message: "Coins added successfully", coins: user.coin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update coins for a user
const updateCoins = async (req, res) => {
  try {
    const { userId, coins } = req.body;
    if (!userId || coins === undefined) {
      return res.status(400).json({ error: "User ID and coins are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.coin = coins; // Overwrite the coins value
    await user.save();
    res.status(200).json({ message: "Coins updated successfully", coins: user.coin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateUserPaymentDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { paymentNumber, phonePayNumber, gpayNumber, bankDetails } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        paymentNumber,
        phonePayNumber,
        gpayNumber,
        bankDetails,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User payment details updated successfully.", data: updatedUser });
  } catch (error) {
    console.error("Error updating user payment details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  register,
  login,
  allUser,
  authUser,
  updateprofile,
  sendotp,
  getCoins ,
  addCoins ,
  updateCoins ,
  getUserById

}
