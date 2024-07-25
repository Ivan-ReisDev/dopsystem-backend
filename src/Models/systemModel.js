import mongoose from 'mongoose';

const infoSystemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nameOrganization: {
        type: String,
        required: true
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
        required: false
    },
    destaques1: {
        type: String,
        required: false
    },
    destaques2: {
        type: String,
        required: false
    },
    destaques3: {
        type: String,
        required: false
    },
    destaques4: {
        type: String,
        required: false
    },
}, { timestamps: true });

const InfoSystem = mongoose.model('System', infoSystemSchema);

export { InfoSystem, infoSystemSchema };
