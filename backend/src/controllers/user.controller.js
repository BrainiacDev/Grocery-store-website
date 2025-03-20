import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generateAccessToken.js";
import generatedRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOTP.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";

// Register controller
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide name, email, password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.json({
        message: "Email already exists",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from Grocery store",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Verify email controller
export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.json({
      message: "Verify email done",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Login controller
export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        message: "Provide email and password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not register",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact Admin",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    const cookiesOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.status(200).json({
      message: "Login successfully",
      error: false,
      success: true,
      data: {
        accessToken: accessToken, // Rename key
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Logout controller
export async function logoutController(req, res) {
  try {
    const userId = req.userId; //coming from middleware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const user = await UserModel.findById(userId);
    if (user && user.refresh_token) {
      await UserModel.findByIdAndUpdate(userId, {
        refresh_token: "",
      });
    }
    console.log(`User ${userId} logged out at ${new Date().toISOString()}`);

    return res.json({
      message: "Logout successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: true,
      success: false,
    });
  }
}

// Upload user avatar
export async function uploadAvatarController(req, res) {
  try {
    const userId = req.userId; // from auth middleware
    const image = req.file; // from multer middleware

    console.log("Image", image);

    const upload = await uploadImageCloudinary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.json({
      message: "Upload profile successfully",
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Update user details controller
export async function updateUserDetailsController(req, res) {
  try {
    const userId = req.userId; // coming from auth middleware
    const { name, email, mobile, password } = req.body;

    let hashedPassword = "";

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashedPassword = await bcryptjs.hash(password, salt);
    }

    const updateUser = await UserModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashedPassword }),
      }
    );

    return res.json({
      message: "User updated successfully",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Forgot password when user not yet login
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        error: true,
        success: false,
      });
    }

    const Otp = generateOtp();
    // const expireTime = new Date() + 60 + 60 * 1000; //1hr

    // const update = await UserModel.findByIdAndUpdate(user._id, {
    //   forgot_password_otp: Otp,
    //   forgot_password_expiry: new Date(expireTime).toISOString(),
    // });

    const expireTime = new Date();
    expireTime.setHours(expireTime.getHours() + 1); // Add 1 hour for expiry

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: Otp,
      forgot_password_expiry: expireTime.toISOString(), // Correctly expires in 1 hour
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot Password OTP from Grocery store",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: Otp,
      }),
    });

    return res.json({
      message: "OTP sent to your email",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Verify forgot password OTP
export async function verifyForgotPasswordOTPController(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide email and otp",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();

    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }

    if (user.forgot_password_otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    //If OTP is not expired and is correct

    const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
      forgot_password_otp: "",
      forgot_password_expiry: "",
    });

    return res.json({
      message: "OTP verified successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Reset password
export async function resetPasswordController(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide required fields",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Password does not match",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    const update = await UserModel.findOneAndUpdate(user._id, {
      password: hashedPassword,
    });

    return res.json({
      message: "Password reset successfully",
      error: false,
      success: true,
      data: update,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Refresh token controller
export async function refreshTokenController(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
        error: true,
        success: false,
      });
    }

    console.log("Refresh Token", refreshToken);

    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRETE_KEY_REFRESH_TOKEN
    );

    if (!verifyToken) {
      return res.status(401).json({
        message: "Token expired",
        error: true,
        success: false,
      });
    }

    console.log("Verify Token", verifyToken);
    const userId = verifyToken?._id;

    // Generate a new access token
    const newAccessToken = await generatedAccessToken(userId);
    const newRefreshToken = await generatedRefreshToken(userId); // Optional: Refresh token rotation

    // Update refresh token in DB
    await UserModel.findByIdAndUpdate(userId, {
      refresh_token: newRefreshToken, // Save the new refresh token in DB
    });

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // Clear old accessToken & refreshToken
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    // Set new tokens
    res.cookie("accessToken", newAccessToken, cookiesOption);
    res.cookie("refreshToken", newRefreshToken, cookiesOption);

    return res.json({
      message: "New Access token generated",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken, // Return new refresh token too
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Get login user details
export async function getUserDetailsController(req, res) {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    return res.json({
      message: "User details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: true,
      success: false,
    });
  }
}
