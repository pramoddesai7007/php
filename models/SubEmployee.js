const mongoose = require('mongoose');

// Define the schema for sub-employee
const subEmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
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
  role: {
    type: String,
    default: 'Employee', // Default role set to 'Employee'
  },
  type: {
    type: String,
  },
  adminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to the admin user in the "Employee" collection
  },
  adminCompanyName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // Field to store the URL of the profile picture
    // default: '', // Default value if no profile picture is set
  },
  adminname: {
    type: String, // Field to store the URL of the profile picture
  },
  status: {
    type: String,
    default: 'active', // Default status set to 'active'
  },
});

// Create the model for sub-employee using the schema
const SubEmployee = mongoose.model('SubEmployee', subEmployeeSchema);

module.exports = SubEmployee;



