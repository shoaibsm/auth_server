const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        publicId: String,
        url: String
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('authUser', userSchema)