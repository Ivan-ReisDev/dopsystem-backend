const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema({
    
    user: {
        type: String,
        require: true
    },

    title: {
        type: String,
        require: true
    },

    content: {
        type: String,
        require: true
    },

    linkImg: {
        type: String,
        require: true
    },

},{ timestamps: true })


const Publication = mongoose.model('Publication', PublicationSchema);
module.exports = {
    Publication,
    PublicationSchema
}