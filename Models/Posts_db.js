const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const PostCollection = new mongoose.Schema(
    {
        id_post_user:{
            type: String,
            required: true
        },
        filename_post:{
            type: String,
            required: true
        },
        mimetype:{
            type: String,
            required: true
        },
        createdAt: {
            type: Date, 
            default: Date.now
        },
    }
);

const Posts = mongoose.model('Posts', PostCollection);

module.exports =  { Posts } ;

