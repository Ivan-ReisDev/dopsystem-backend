const mongoose = require('mongoose');

const teamsSchema = new mongoose.Schema({

    nameTeams: {
        type: String,
        require: true
    },

    teamsType: {
        type: String,
        enum: ["Equipe", "Órgão"],
        required: true,
    },

    leader: {
        type: String,
        required: true
    },

    viceLeader: {
        type: String,
        required: false
    },

    members: {
        type: Array,
        required: true
    },

    classes: {
        type: Array,
        
    },

})


const Teams = mongoose.model('Teams', teamsSchema);
module.exports = {
    Teams,
    teamsSchema
}