const express = require('express');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
var favicon = require('serve-favicon');
var path = require('path');
const app = express();
const ejs = require('ejs');

var fileStoreOptions = {};

//SESSION
app.use(session({
    store: new FileStore(fileStoreOptions),
    secret: 'honde',
    resave: false,
    saveUninitialized: false,
    cookie:{
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
const checkfield = require('./Middleware/checkfield');
const validation_registration_midd = require('./Middleware/validation_registration_midd');
//const account_midd = require('./Middleware/account_midd');


//Middleware URL
app.use('/checkfield', checkfield);
app.use('/account/validationregistration/:toke_validation_user', validation_registration_midd);
//app.use('/account', account_midd);

app.get('/',(req,res) => {
    res.render('index_view_component.ejs');
});

app.get('/account',(req,res) => {
    res.render('account_view_component.ejs');
});

app.get('/accounts/login',(req,res) => {
    res.render('login_view_component.ejs');
});

app.get('/accounts/emailsignup',(req,res) => {
    res.render('register_view_component.ejs');
});

app.get('/accounts/password/reset',(req,res) => {
    res.render('pwd_reset_view_component.ejs');
});

app.get('/account/validationregistration/:toke_validation_user',(req,res) => {

    console.log("PARAMETTRE", req.params);

    res.render('validation_registration.ejs');
});
//AUTHENTICATE AJAX REQUEST
app.post('/checkfield',(req,res) => {
});
//DECONNECTÉ AJAX REQUEST
app.get('/deconnected',(req,res) => {
    console.log('DECONNECTION')
});

app.get('**',(req,res) => {
    res.render('erreur_view_component.ejs');
});

app.listen(servePort);