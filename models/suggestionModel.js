let mongoose = require('mongoose');


let suggestionSchema = mongoose.Schema({

    SugDiscription: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },

});

module.exports = mongoose.model('Suggestion', suggestionSchema);




