const mongoose = require('mongoose');               

const siteSchema = new mongoose.Schema({
    siteName: { type: String, trim: true, },
    siteDescription: { type: String, trim: true, },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    siteImage1: { type: String, trim: true, },
    siteImage2: { type: String, trim: true, },
    siteImage3: { type: String, trim: true, },
    siteVideo: { type: String, trim: true, },
});

const Site = mongoose.model('Site', siteSchema);

module.exports = Site;
