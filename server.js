const express = require('express');
const app = express();

const servePort = process.env.PORT || 8080;

app.use('/static',express.static('public/css'));
app.use('/imgstatic',express.static('public/assets'));


app.get('/',(req,res) => {
    res.sendFile(__dirname+'/views/index_view_component.html');
});

app.get('/accounts/login',(req,res) => {
    res.sendFile(__dirname+'/views/login_view_component.html');
});

app.get('/accounts/emailsignup',(req,res) => {
    res.sendFile(__dirname+'/views/register_view_component.html');
});

app.get('/accounts/password/reset',(req,res) => {
    res.sendFile(__dirname+'/views/pwd_reset_view_component.html');
});

app.get('**',(req,res) => {
    res.sendFile(__dirname+'/views/erreur_view_component.html');
});

app.listen(servePort);