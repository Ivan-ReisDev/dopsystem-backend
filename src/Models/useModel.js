const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    patent: {
        type: String,
        required: true
    },

    classes: {
        type: Array,
        required: true
    },

    teans: {
        type: Array,
        required: true
    },

    status: {
        type: String,
        enum: ["Pendente", "Ativo", "Desativado", "Exonerado", "Banido", "Reformado"],
        required: true
    },

    tag: {
        type: String,
        required: true
    },
    
    warnings: {
        type: Number,
        required: true
    },

    medals: {
        type: String,
        required: true
    },

    userType: {
        type: String,
        enum: ["User", "Admin"],
        required: true,
    },
},{ timestamps: true })


const User = mongoose.model('User', userSchema);
module.exports = {
    User,
    userSchema
}

