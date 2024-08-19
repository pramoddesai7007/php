"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var adminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: {
    type: String
  },
  resetTokenExpires: {
    type: Date
  }
});
var Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;