const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    value:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default:Date.now,
    }
})

module.exports = mongoose.model('CrashPoints', gameSchema)