const mongodb = require('mongodb');
const mongoose = require('mongoose');

const validation_registration_midd = async (req, res, next) => {

    if(req.params.toke_validation_user){
        console.log('OK VALIDATION ', req.params);
        toke_valid_user = req.params.toke_validation_user;
        //COLLECTION
        const { User } = require('../Models/User_db.js');

        await User.findOneAndUpdate({toke_valid_user : toke_valid_user},{$set:{role:1}});

        next();
    }else{
        res.redirect('/');
        next();
    }




}



module.exports = validation_registration_midd;