const mongoose = require('mongoose');

const EndorsementSchema = new mongoose.Schema({

    nicknameAval: {
        type: String,
        require: true
    },

    startDate: {
        type: String,
        require: true
    },

    endorsementdays: {
        type: Number,
        require: true
    },

    endDate: {
        type: String,
        require: true
    },

    reason: {
        type: String,
        require: true
    },
    
    status: {
        type: String,
        enum: ["Pendente", "Aprovado" ,"Reprovado" ],
        required: true
    },
 
},{ timestamps: true })


const Endorsement = mongoose.model('Endorsement', EndorsementSchema);
module.exports = {
    Endorsement,
    EndorsementSchema
}