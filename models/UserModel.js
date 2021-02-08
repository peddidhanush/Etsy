const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  verificationCode: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
