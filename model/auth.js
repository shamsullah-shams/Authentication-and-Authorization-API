const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Auth = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    varified: {
        type: Boolean,
        default: true,
    },
    roll: {
        type: String,
        default: ''
    }
}, { timeStamps: true });



module.exports = mongoose.model('Auth', Auth);