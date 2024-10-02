let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true, required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        trim: true,
       
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    country:{
type:String,
trim:true
    },
    iscontactverified: {
        type: Boolean,
    },
    isemailverified: {
        type: Boolean,
    },
    isverified: {
        type: Boolean,
        default: true
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



}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);




