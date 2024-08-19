"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var mongoose = require('mongoose'); // Define the subdocument schema for recipient


var recipientSchema = new mongoose.Schema({
  recipientId: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    "default": false
  }
}); // Define the main notification schema

var notificationSchema = new mongoose.Schema(_defineProperty({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  recipientId: [recipientSchema],
  taskId: {
    type: String
  },
  title: {
    type: String // required: true

  },
  description: {
    type: String // required: true

  },
  startDate: {
    type: Date // required: true

  },
  deadlineDate: {
    type: Date // required: true

  },
  startTime: {
    type: String // required: true

  },
  endTime: {
    type: String // required: true

  },
  status: {
    type: String // required: true

  },
  assignedByname: {
    type: String
  },
  message: {
    type: String // required: true

  },
  createdAt: {
    type: Date,
    "default": Date.now
  }
}, "status", {
  type: String,
  "default": 'Pending'
}));
module.exports = mongoose.model('Notification', notificationSchema);