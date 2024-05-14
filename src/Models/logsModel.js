const mongoose = require('mongoose');

const LoggerSchema = new mongoose.Schema({

    user: {
        type: String,
        require: true
    },

    ip: {
        type: String,
        require: true
    },

    loggerType: {
        type: String,
        require: true
    },


},{ timestamps: true })


const Logger = mongoose.model('Logger', LoggerSchema);
module.exports = {
    Logger,
    LoggerSchema
}