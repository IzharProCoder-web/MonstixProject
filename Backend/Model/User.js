import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: {
      type: String,
      lowercase: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email address format",
      },
    },
    role: {
      type: String,
      enum: [
        "ProjectManger",
        "FrontendDev",
        "BackendDev",
        "User",
        "Designer",
        "Tester",
        "SocialMedia Manager",
      ],
      default: "User",
    },

    password: { type: String },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
    emailOtp: { type: String },
    emailOtpExpiry: { type: Date },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
