const mongoose = require('mongoose');
// Define the Verification schema
const verificationSchema = new mongoose.Schema({
  useremail: {
    type: String,
    // required: true, 
  },
  verificationCode: {
    type: String,
    // required: true,
  },
  expirationTime: {
    type: Date,
    // required: true,
  },
});

// Create the Verification model
const VerificationModel = mongoose.model('Verification', verificationSchema);

module.exports = VerificationModel;
