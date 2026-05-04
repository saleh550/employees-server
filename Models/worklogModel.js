const mongoose = require('mongoose');

const workLogSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    // סוג רישום (שעות / ימים)
    type: {
      type: String,
      enum: ['hour', 'day'],
      required: true,
    },

    // 🕒 אם זה לפי שעות
    startTime: {
      type: String, // "08:00"
    },
    endTime: {
      type: String, // "17:00"
    },

    // 📅 אם זה לפי ימים
    dayType: {
      type: String,
      enum: ['full', 'half'],
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkLog', workLogSchema);