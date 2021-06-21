const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const RoomMessagePrivateCollection = new mongoose.Schema(
    {
        name_room:{
            type: String,
            min: 7,
            required: true
        },
    }
);

const RoomMessagePrivate = mongoose.model('RoomMessagePrivate', RoomMessagePrivateCollection);

module.exports =  { RoomMessagePrivate } ;


