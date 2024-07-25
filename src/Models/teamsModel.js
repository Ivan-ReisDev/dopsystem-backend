import mongoose from 'mongoose';

const teamsSchema = new mongoose.Schema({
    nameTeams: {
        type: String,
        required: true
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
        required: false
    },
}, { timestamps: true });

const Teams = mongoose.model('Teams', teamsSchema);

export { Teams, teamsSchema };
