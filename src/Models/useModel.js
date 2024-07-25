import mongoose from 'mongoose';

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
        enum: ["Pendente", "Ativo", "Desativado", "Exonerado", "Banido", "Reformado", "CFO"],
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
        enum: ["User", "Admin", "Diretor", "Recursos Humanos"],
        required: true,
    },
    code: {
        type: String,
        required: false,
    },
    tokenActive: {
        type: String,
    },
    tokenIsNotValide: { 
        type: Array,
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export { User, userSchema };
