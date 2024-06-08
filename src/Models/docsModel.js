const mongoose = require('mongoose');

const DocsSystemSchema = new mongoose.Schema({

    nameDocs: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    create: {
        type: String,
        required: true
    },
    docsType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Ativo", "Desativado"],
        required: true,
    },
    script: {
        type: Boolean,
        required: true,
    }
}, { timestamps: true });

const DocsSystem = mongoose.model('Docs', DocsSystemSchema);
module.exports = {
    DocsSystem,
    DocsSystemSchema
}
