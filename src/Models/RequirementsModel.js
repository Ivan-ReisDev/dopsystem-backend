import mongoose from 'mongoose';

const requirementsSchema = new mongoose.Schema({
    promoted: {
        type: String,
        required: true
    },
    newPatent: {
        type: String,
        required: false
    },
    newMotto: {
        type: String,
        required: false
    },
    patentOperador: {
        type: String,
        required: false
    },
    operator: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    classe: {
        type: String,
        required: false
    },
    team: {
        type: String,
        required: false
    },
    typeRequirement: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pendente", "Aprovado", "Reprovado"],
        required: true
    },
}, { timestamps: true });

const Requirements = mongoose.model('Requirements', requirementsSchema);

export { Requirements, requirementsSchema };
