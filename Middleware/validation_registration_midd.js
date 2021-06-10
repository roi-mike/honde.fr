const mongodb = require('mongodb');
const mongoose = require('mongoose');

const validation_registration_midd = async (req, res, next) => {

    if(req.params.toke_validation_user){
        toke_valid_user = req.params.toke_validation_user;
        //COLLECTION
        const { User } = require('../Models/User_db.js');
        //UTILISE LES FONCTIONS DE MONGODB POUR MODIFIER
        mongoose.set('useFindAndModify', false);

        await User.findOneAndUpdate({toke_valid_user : toke_valid_user},{$set:{role:1}})
        .exec()
        .then(result => {
            
            if(result){
                //Si il ya un resulta en fait NEXT()
                console.log('RESULT : ', result);
                next();

            }else{
                //PAS DE RESULT DANS LA BDD RETOUR ACCUEIL
                console.log('PAS RESULT : ', result);
                res.redirect('/accounts/emailsignup');
            }

        })
        .catch(erreur => {
            console.log('ERREUR VALIDATION TOKEN : ',erreur)
        })
    }else{
        res.redirect('/');
        next();
    }




}



module.exports = validation_registration_midd;