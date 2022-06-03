const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Clinic = new Schema({
    authId: {
        type: mongoose.Types.ObjectId,
        ref: "Auth",
    },
    fullName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    }
}, { timestamps: true });


module.exports = mongoose.model('Clinic', Clinic);