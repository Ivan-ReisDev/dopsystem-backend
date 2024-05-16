const mongoose = require('mongoose');

const requirementsSchema = new mongoose.Schema({
    promoted: {
        type: String,
        required: true
    },

    newPatent: {
        type: String,
        required: true
    },

    patentOperador : {
        type: String,
        required: true
    },

    operator: {
        type: String,
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    typeRequirement: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Pendente", "Aprovado" ,"Reprovado" ],
        required: true
    },

},{ timestamps: true })


const Requirements = mongoose.model('Requirements', requirementsSchema);
module.exports = {
    Requirements,
    requirementsSchema
}

