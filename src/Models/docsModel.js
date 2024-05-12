const mongoose = require('mongoose');

const DocsSystemSchema = new mongoose.Schema({

    nameDocs: {
        type: String,
        require: true
    },

    content: {
        type: String,
        require: true
    },

    create: {
        type: String,
        require: true
    },

})


const DocsSystem = mongoose.model('Docs', DocsSystemSchema);
module.exports = {
    DocsSystem,
    DocsSystemSchema
}