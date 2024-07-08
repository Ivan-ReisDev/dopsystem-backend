const mongoose = require('mongoose');

const infoSystemSchema = new mongoose.Schema({

    name: {
        type: String,
        require: true
    },

    nameOrganization: {
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
    
    emblema: {
        type: String,
        require: false
    }, 
    destaques1: {
        type: String,
        require: false
    },
    destaques2: {
        type: String,
        require: false
    },
    destaques3: {
        type: String,
        require: false
    },
    destaques4: {
        type: String,
        require: false
    },
    

},{ timestamps: true })


const InfoSystem = mongoose.model('System', infoSystemSchema);
module.exports = {
    InfoSystem,
    infoSystemSchema
}