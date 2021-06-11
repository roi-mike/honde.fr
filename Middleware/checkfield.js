const bcrypt = require('bcrypt');
const Mailer = require('../node_emailer/Mailer.js');
const nb_salt = 10;
const crypt_salt = bcrypt.genSaltSync(nb_salt);

const checkfield = async (req, res, next) => {

    const form_register_type_view = req.body.form_register_type_view;
    const email_user = req.body.email_user;
    const firstname_user = req.body.firstname_user;
    const lastname_user = req.body.lastname_user;
    const password_user = req.body.password_user;
    const conf_password_user = req.body.conf_password_user;

    //COLLECTION
    const { User } = require('../Models/User_db.js');

    //let User = require('./Models/User_db');
    var reponse_check = {};

    //VERIFICATION
    var regex_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    if(form_register_type_view === 'register_type_view'){


        //Email CHECK

        if(!regex_email.test(String(email_user))){
            reponse_check["email_user"] = " Email incorect ";
        }

        if(regex_email.test(String(email_user))){
            await User.findOne({email_user: email_user})
            .then(find_email_user => {
                if(find_email_user){
                    try{
                        reponse_check["email_user"] = " Email déja utilisé ";
                    }catch(error){
                        console.log('TRY CATCH ERROR');
                    }
                }
            })
            .catch(err => {
                console.log("ERREUR MESSAGE : => "+err);
            });
        }

        if(firstname_user.length <= 2){
            reponse_check["firstname_user"] = "2 catacteres minimum ";
        }
        if(lastname_user.length <= 2){
            reponse_check["lastname_user"] = "2 catacteres minimum ";
        }
        if(password_user.length <= 6){
            reponse_check["password_user"] = " Doit comprendre 6 caracteres minimum ";
        }
        if(conf_password_user != password_user || conf_password_user.length <= 6 ){
            reponse_check["conf_password_user"] = " Doit étre égal au mot de passe ";
        }


        //SAVA IN THE DATA BASE
        if(Object.keys(reponse_check).length === 0){

            //INSCRIPTION A LA BASE DE DONNEE

            const password_user_crypt = bcrypt.hashSync(password_user, crypt_salt);
            const selt_token = 10000000000;
            const toke_validation_user = parseInt(Math.random() * selt_token);
            const use_save_register = new User({
                email_user: email_user,
                firstname_user: firstname_user,
                lastname_user: lastname_user,
                password_user: password_user_crypt,
                toke_valid_user: toke_validation_user,
            });
            use_save_register.save();


            //ENVOIE DU MAIL DE VALIDATION POUR L INSCRIPTION
            require('../node_emailer/Mailer.js');
            const mailer_register = new Mailer();
            mailer_register.send_mail_register(email_user, firstname_user,toke_validation_user);
            
        }else{
            console.log('NOT SAVE ! ');
        }
    }

    res.status(200).json(reponse_check);
}




module.exports = checkfield;