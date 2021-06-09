const mongoose = require('mongoose');

const UserCollection = new mongoose.Schema(
    {
        email_user:{
            type: String,
            min: 7,
            required: true
        },
        firstname_user:{
            type: String,
            min: 2,
            max:4,
            required: true
        },
        lastname_user:{
            type: String,
            min: 2,
            max:4,
            required: true
        },
        password_user:{
            type: String,
            min: 6,
            required: true
        },
        toke_valid_user:{
            type: Number,
            required: true
        },
        role:{
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date, 
            default: Date.now
        }
    }
);

const User = mongoose.model('User', UserCollection);

module.exports =  { User } ;

