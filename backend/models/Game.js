const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    crashPoint: Number,
    createdAt:{
        type: Date,
        default:Date.now,
    }
})

module.exports = mongoose.model('Game', gameSchema)