const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const User = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    varified: {
        type: Boolean,
        default: false,
    }
}, { timeStamps: true });



module.exports = mongoose.model('User', User);