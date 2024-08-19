// const mongoose = require('mongoose');

// const employeeSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     phoneNumber: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true, // Ensure email addresses are unique
//         lowercase: true, // Store emails in lowercase
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     adminUserId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Admin', // Reference to the AdminUser model
//     },
//     adminCompanyName: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         default: 'Admin', // Default role set to 'Admin'
//     },
//     type: {
//         type: String
//     },
//     resetToken: {
//         type: String, // This will store the reset token
//     },
//     resetTokenExpires: {
//         type: Date, // This will store the expiration date of the reset token
//     },   // Add more fields as needed
// });

// const Employee = mongoose.model('Employee', employeeSchema);

// module.exports = Employee;




const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email addresses are unique
        lowercase: true, // Store emails in lowercase
    },
    password: {
        type: String,
        required: true,
    },
    adminUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Reference to the Admin model
    },
    adminname: {
        type: String
    },

    adminCompanyName: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'Admin', 
    },
    type: {
        type: String,
    },
    resetToken: {// This will store the reset token
    },
    resetTokenExpires: {
        type: Date, // This will store the expiration date of the reset token
    },
    profilePicture: {
        type: String, // Field to store the URL of the profile picture
        // default: '', // Default value if no profile picture is set
    },
    status: {
        type: String,
        default: 'active' // Default status set to 'active'
    }  
    // Add more fields as needed
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
