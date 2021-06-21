const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const MessagePrivateCollection = new mongoose.Schema(
    {
        id_sender:{
            type: String,
            min: 7,
            required: true
        },
        recipient:{
            type: String,
            //required: true
        },
        _id_RoomMessagePrivate: {
            type: String,
            //required: true
        },
        message:{
            type: String,
            required: true
        },
        createdAt: {
            type: Date, 
            default: Date.now
        }
    }
);

const MessagePrivate = mongoose.model('MessagePrivate', MessagePrivateCollection);

module.exports =  { MessagePrivate } ;

