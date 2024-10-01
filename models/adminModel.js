const mongoose = require('mongoose');

// Define the Admin Panel schema
const AdminPanelSchema = new mongoose.Schema({
    adminemail: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    isverified: {
        type: Boolean,
        default: false,
    },
    jwtadmintoken: {
        type: String,
    },
    sessionExpiration: {
        type: String,
    },
});

// Create the AdminPanel model
const AdminPanel = mongoose.model('AdminPanel', AdminPanelSchema);

module.exports = AdminPanel;
