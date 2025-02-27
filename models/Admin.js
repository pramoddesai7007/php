const mongoose = require('mongoose')
const { Schema } = mongoose;


const adminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
        type: String, 
    },
    resetTokenExpires: {
        type: Date, 
    },
});


const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin
