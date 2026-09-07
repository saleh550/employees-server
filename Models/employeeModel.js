const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // סוג תשלום
    payType: {
      type: String,
      enum: ["hour", "day"],
      required: true,
      default: "hour",
    },

    // מחיר לשעה / יום
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },

    hireDate: {
      type: Date,
      default: Date.now,
    },
    defaultStartTime: {
      type: String, // "08:00"
      default: "08:00",
    },
    defaultEndTime: {
      type: String, // "17:00"
      default: "17:00",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Employee", employeeSchema);
