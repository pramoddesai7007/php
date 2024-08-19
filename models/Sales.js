const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  role: {
    type: String,
    default:"Sales emp"
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  shiftHours: {
    type: String,
    required: true,
  },
  adminName: {
    type: String, // Field to store the URL of the profile picture
    default: 'undefined', // Default value if no profile picture is set
  },  
  adminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to the admin user in the "Employee" collection
  },
  adminCompanyName: {
    type: String,
    required: true,
  },

});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;

