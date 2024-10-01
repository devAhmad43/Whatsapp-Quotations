const mongoose = require('mongoose');

const doorsSchema = new mongoose.Schema({
    doorNameEng: { type: String, trim: true, },
    doorNameArb: { type: String, trim: true, },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    gateNumber: { type: String, trim: true, },
    additionalInfo: { type: String, trim: true, },
    doorOrigin: { type: String, trim: true , required: true  },
    doorImage1: { type: String, trim: true, },
    doorImage2: { type: String, trim: true, },
    doorImage3: { type: String, trim: true, },
    doorVideo: { type: String, trim: true, },
},{ timestamps: true });

const Doors = mongoose.model('Doors', doorsSchema);

module.exports = Doors;