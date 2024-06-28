const mongoose = require('mongoose');

const teamsSchema = new mongoose.Schema({

    nameTeams: {
        type: String,
        require: true
    },

    leader: {
        type: String,
        required: true
    },

    viceLeader: {
        type: String,
        required: false
    },

    emblema: {
        type: String,
        required: false
    },

    members: {
        type: Array,
        required: false
    },



},{ timestamps: true })


const Teams = mongoose.model('Teams', teamsSchema);
module.exports = {
    Teams,
    teamsSchema
}