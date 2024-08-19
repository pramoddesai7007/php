const mongoose = require('mongoose');

// Define the subdocument schema for recipient
const recipientSchema = new mongoose.Schema({
  recipientId: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

// Define the main notification schema
const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  recipientId: [recipientSchema],
  taskId: {
    type: String,
  },
  title: {
    type: String,
    // required: true
  },
  description: {
    type: String,
    // required: true
  },
  startDate: {
    type: Date,
    // required: true
  },
  deadlineDate: {
    type: Date,
    // required: true
  },
  startTime: {
    type: String,
    // required: true
  },
  endTime: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    // required: true
  },
  assignedByname: {
    type: String
  },
  message: {
    type: String,
    // required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending' 
    
  }
});

module.exports = mongoose.model('Notification', notificationSchema);