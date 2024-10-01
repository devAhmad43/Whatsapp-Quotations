let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let userSchema = mongoose.Schema({
    userName: {
        type: String,
        trim: true, required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    mobileNumber: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    iscontactverified: {
        type: Boolean,
    },
    isemailverified: {
        type: Boolean,
    },
    isverified: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        trim: true,
    },
    sessionExpiration: {
        type: String,
        trim: true,
    },
    jwttoken: {
        type: String,
    },
    lastLogin: {
        type: Date,

    },
    isPaymentVerified: {
        type: Boolean,
        default: false
    },
    latitude: { type: Number, required: true, default: 0 },
    longitude: { type: Number, required: true, default: 0 },


}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);




