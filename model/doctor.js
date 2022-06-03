const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Doctor = new Schema({
    authId: {
        type: mongoose.Types.ObjectId,
        ref: "Auth",
    },
    fullName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        require: true
    },
    gender: {
        type: String,
        required: true,
    },
    bloodGroup: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    }
}, { timestamps: true });


module.exports = mongoose.model('Doctor', Doctor);