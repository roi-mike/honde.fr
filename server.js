const express = require('express');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
var favicon = require('serve-favicon');
var path = require('path');
const app = express();
const ejs = require('ejs');

const bcrypt = require('bcrypt');
const Mailer = require('./node_emailer/Mailer.js');
const nb_salt = 10;
const crypt_salt = bcrypt.genSaltSync(nb_salt);
//SESSION
app.use(session({
    store: new FileStore(fileStoreOptions),
    secret: 'honde',
    name: 'session_user',
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: true,
        maxAge: (1000*60)*2
    }
}));

//BDD CONNEXION
require('./Models/dbConfig.js');

//ROUTE SERVEUR
const servePort = process.env.PORT || 8080;



//PARSE METHODE POST
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//FIVICON
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//EJS
app.set('view engine', 'ejs');

//CSS STATIC
app.use('/css',express.static('public/css'));
app.use('/js',express.static('public/javascript'));
app.use('/imgstatic',express.static('public/assets'));


//Middleware INCLUDE
// const checkfield = require('./Middleware/checkfield');
const validation_registration_midd = require('./Middleware/validation_registration_midd');
const deconnected = require('./Middleware/deconnected');
//const account_midd = require('./Middleware/account_midd');


//Middleware URL
// app.use('/checkfield', checkfield);
app.use('/account/validationregistration/:toke_validation_user', validation_registration_midd);
app.use('/deconnected', deconnected);
//app.use('/account', account_midd);

app.get('/',(req,res, next) => {
    console.log('req.session.mail_user 62 : ', req.session);
    res.render('index_view_component.ejs');
});

app.get('/account',(req,res) => {
    console.log("req.session.mail_user 70 : ", req.session);
    res.render('account_view_component.ejs');
});

app.get('/accounts/login',(req,res) => {
    res.render('login_view_component.ejs');
});

app.get('/accounts/emailsignup',(req,res) => {
    console.log('req.session.mail_user 79 : ', req.session);
    res.render('register_view_component.ejs');
});

app.get('/account/registerok/checkmail',(req,res) => {
    console.log('req.session.mail_user 86 : ', req.session);
    res.render('check_mail_view_component.ejs');
});

app.get('/accounts/password/reset',(req,res, next) => {
    console.log('req.session.mail_user 89', req.session.mail_user);
    res.render('pwd_reset_view_component.ejs');
});

app.get('/account/validationregistration/:toke_validation_user',(req,res) => {
    console.log("PARAMETTRE", req.params);
    console.log('req.session.mail_user 95 : ', req.session.mail_user);

    res.render('validation_registration.ejs');

    //lol
});
//AUTHENTICATE AJAX REQUEST
app.post('/checkfield',async (req,res, next) => {
     //COLLECTION
     const { User } = require('./Models/User_db.js');

     //let User = require('./Models/User_db');
     var reponse_check = {};
 
     //VERIFICATION
     var regex_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 
 
     if(req.body){
         const form_type_view = req.body.form_type_view;
         const email_user = req.body.email_user;
         const firstname_user = req.body.firstname_user;
         const lastname_user = req.body.lastname_user;
         const password_user = req.body.password_user;
         const conf_password_user = req.body.conf_password_user;
 
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
                 toke_valid_user:toke_validation_user,
             });
             use_save_register.save();
 
 
             //ENVOIE DU MAIL DE VALIDATION POUR L INSCRIPTION
             const mailer_register = new Mailer();
             mailer_register.send_mail_register(email_user, firstname_user,toke_validation_user);
 
             //after register we redirect
             reponse_check["redirection_login"] = "/account/registerok/checkmail";
             
         }else{
             console.log('NOT SAVE ! ');
         }
     }
 
 
     /*FORM LOGIN CONNECTION*/
     if(form_type_view === 'login_type_view'){
 
         if(!regex_email.test(String(email_user))){
             reponse_check["email_user"] = " Email incorect ";
         }
 
         if(password_user.length <= 6){
             reponse_check["password_user"] = " Doit comprendre 6 caracteres minimum ";
         }
         
         if(regex_email.test(String(email_user)) && password_user.length >= 6 ){
             await User.findOne({ email_user: email_user })
             .exec()
             .then(async (find_user)=> {
 
                 console.log('find_user : ', find_user);
 
                 //IF NOT FIND MAIL
                 if(!find_user){
                     reponse_check["password_user"] = "Email ou mot de passe incorrecte ";
                     //REDIRECTION ACCOUNT 
                 }
 
                 //IF FIND MAIL
                 if(find_user){
                     var compare_password_user = bcrypt.compareSync(password_user, find_user.password_user)
                     // result == true 
                     if(compare_password_user){
 
                         if(find_user.role === 0){
                             reponse_check["password_user"] = "Email ou mot de passe incorrecte ";
                             //REDIRECTION ACCOUNT 
                         }
 
                         
                         //FOR CONNECTE THE ROLE THERE IN ARE AT 1 
                         if(find_user.email_user === email_user && find_user.role === 1){
                             console.log('EMAIL OK 2')
                             await User.findOneAndUpdate({email_user : email_user},{$set:{role:2}})
                                 .exec()
                                 .then(async result => {
                                     
                                     if(result){
                                         //MAIL AND PASSWORD IS GOOD
                                         await User.findOne({ email_user: email_user })
                                         .exec()
                                         .then(async (find_user)=> {
 
                                             if(find_user){
                                                 console.log('FINI FINI', find_user)
                                                 req.session.id_user = find_user._id;
                                                 req.session.mail_user = find_user.email_user;
                                                 req.session.firstname_user = find_user.firstname_user;
                                                 req.session.lastname_user = find_user.lastname_user;
                                                 req.session.createdAt = find_user.createdAt;
 
                                                 console.log('req.session 244 ', req.session);
                                                 // res.status('301');
                                                 // res.redirect("/account");
                                                 //CYRIL ReCTIF 
                                                 reponse_check["redirection_account"] = "/account";
                                                 //REDIRECTION ACCOUNT 
                                             }
 
                                         })
                                         .catch(erreur => {
                                             console.log('erreur =>', erreur);
                                         });
                                     }
 
                                 })
                                 .catch(erreur => {
                                     console.log('ERREUR VALIDATION TOKEN : ',erreur);
                                 })
                         }
                         if(find_user.email_user === email_user && find_user.role === 2){
                            await User.findOne({ email_user: email_user })
                            .exec()
                            .then(async (find_user)=> {

                                if(find_user){
                                    console.log('FINI FINI ROLE 2', find_user)
                                    req.session.id_user = find_user._id;
                                    req.session.mail_user = find_user.email_user;
                                    req.session.firstname_user = find_user.firstname_user;
                                    req.session.lastname_user = find_user.lastname_user;
                                    req.session.createdAt = find_user.createdAt;

                                    console.log(' req.session 276 ', req.session);
                                    // res.status('301');
                                    // res.setHeader('Content-Type', 'application/json');
                                    // res.status(404);
                                    // res.redirect("/account");
                                    //CYRIL ReCTIF 
                                    reponse_check["redirection_account"] = "/account";
                                    //REDIRECTION ACCOUNT 
                                }

                            })
                            .catch(erreur => {
                                console.log('erreur =>', erreur);
                            });
                         }
                         
                     }
                     if(!compare_password_user){
                         reponse_check["password_user"] = "Email ou mot de passe incorrecte ";
                     }
                 }
             })
         }
 
     }
     
     res.status(200).json(reponse_check);
    }
});
//DECONNECTÉ AJAX REQUEST
app.get('/deconnected',(req,res) => {
    req.session.destroy();
    res.status('301').redirect('/');
    console.log('DECONNECTION')
});

app.get('**',(req,res) => {
    res.render('erreur_view_component.ejs');
});

app.listen(servePort);