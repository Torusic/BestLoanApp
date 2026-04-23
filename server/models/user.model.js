import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

   phone: {
  type: String,
  required: true,
  unique: true,
  trim: true,
  validate: {
    validator: function (v) {
      return /^\+254\d{9}$/.test(v);
    },
    message: "Phone must be in format +2547XXXXXXXX"
  }
},
    email: {
      type: String,
      unique: true,
      sparse: true, // allows null emails
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔐 hides password in queries
    },

    nationalId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 20,
    },

    role: {
      type: String,
      enum: ["admin", "agent", "client"],
      default: "client",
    },

    refresh_token: {
      type: String,
      default: null,
      select: false, // 🔐 hidden from queries
    },

    last_login_date: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true, // 🔐 allows soft delete / blocking users
    },

    isVerified: {
      type: Boolean,
      default: false, // 🔐 email/phone verification ready
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
      notifications: {
  type: Boolean,
  default: true
},
  },

  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;