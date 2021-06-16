const bcrypt = require('bcrypt');
const Mailer = require('../node_emailer/Mailer.js');
const nb_salt = 10;
const crypt_salt = bcrypt.genSaltSync(nb_salt);

const checkfield = async (req, res, next) => {

   

<<<<<<< HEAD
    //COLLECTION
    const { User } = require('../Models/User_db.js');

    //let User = require('./Models/User_db');
    var reponse_check = {};

    //VERIFICATION
    var regex_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    /*FORM REGISTER*/
    if(form_type_view === 'register_type_view'){


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


    /*FORM LOGIN CONNECTION*/
    if(form_type_view === 'login_type_view'){
        
        if(regex_email.test(String(email_user)) && password_user.length >= 6 ){

            await User.findOne({ email_user: email_user })
            .exec()
            .then(async (find_user)=> {
                reponse_check["find_useryes"] = "USER FIND";

                var compare_password_user = bcrypt.compareSync(password_user, find_user.password_user)
                    // result == true 
                    if(compare_password_user){
                        reponse_check["find_user"] = " TROUVÉ ";
                        console.log(' find_user ', find_user);
                        if(find_user.email_user === email_user && find_user.role < 2){
                            console.log('EMAIL OK 2')
                            await User.findOneAndUpdate({email_user : email_user},{$set:{role:2}})
                                .exec()
                                .then(result => {
                                    
                                    if(result){
                                        reponse_check["find_user_change_role"] = " TROUVÉ ";
                                        //REDIRECTION ACCOUNT 
                                        next();
                                    }

                                })
                                .catch(erreur => {
                                    console.log('ERREUR VALIDATION TOKEN : ',erreur);
                                })
                        }else{
                            reponse_check["find_user_withou_change_role"] = " TROUVÉ ";
                            //REDIRECTION ACCOUNT 
                            next();
                        }
                    }
                    if(!compare_password_user){
                        reponse_check["find_userrrr"] = "Email ou mot de passe incorrecte ";
                    }
            })
            console.log('LOGIN FIN');
        }





    }
=======
>>>>>>> main
    
}




module.exports = checkfield;