const mongoose = require('mongoose');

const infoSystemSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },

    patents: {
        type: Array,
        required: true
    },

    paidPositions: {
        type: Array,
        required: true
    },

    teams: {
        type: Array,
        required: true
    },
    

},{ timestamps: true })


const InfoSystem = mongoose.model('System', infoSystemSchema);
module.exports = {
    InfoSystem,
    infoSystemSchema
}