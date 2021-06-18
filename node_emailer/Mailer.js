"use strict";

require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

module.exports = class Mailer{

    constructor(){}

    //MAIL REGISTER
    async send_mail_register(email_user, firstname_user, toke_validation_user){
        
        try{
            const GMAIL_CLIENT_ID = process.env.CLIENTID;
            const GMAIL_CLIENT_SECRET = process.env.CLIENTSECRET;
            const GMAIL_REFRESH_TOKEN = process.env.REFRESHTOKEN;
            const GMAIL_ID = process.env.EMAIL ;
            const OAUTH_PLAYGROUND = process.env.OAUTH_PLAYGROUND ;

            const oauth2Client = new OAuth2(
            GMAIL_CLIENT_ID,
            GMAIL_CLIENT_SECRET,
            OAUTH_PLAYGROUND
            );

            oauth2Client.setCredentials({
            refresh_token: GMAIL_REFRESH_TOKEN,
            });

            google.options({ auth: oauth2Client }); // Apply the settings globally 

            const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) console.log(err); // Handling the errors
                else resolve(token);
            });
            });

            const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: GMAIL_ID,
                clientId: GMAIL_CLIENT_ID,
                clientSecret: GMAIL_CLIENT_SECRET,
                refreshToken: GMAIL_REFRESH_TOKEN,
                accessToken,
            },
            });
            const mailOptions = {
            from: GMAIL_ID,
            to: email_user,
            subject: "[INSCRIPTION] Finalisation avant de rejoindre vos amis 🤩",
            text: "message",
            html: `<h3>Bonjour et bienvenu Mr ${firstname_user}</h3><p>nous sommes tres heureuses de vous compter avec nous</p><p>pour finaliser et profitez de vos avantages cliquer sur le bouton si dessus </p><p>vos amis sont impatient de vous retrouver sur honde</p><a target='_blank' href='http://localhost:8080/account/validationregistration/${toke_validation_user}'><button type='submit'>cliquer ICI finaliser mon inscription</button></a>`
            };

            transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                console.log(err);
            } else {
                console.log(info);
            }
            });
        }catch(erreur){
            console.log(erreur);
        }
    }


    //MAIL PASS WORD FORGET
    async send_mail_reset_password(email_user, firstname_user, toke_pwd_reseting_user){
        
        try{
            const GMAIL_CLIENT_ID = process.env.CLIENTID;
            const GMAIL_CLIENT_SECRET = process.env.CLIENTSECRET;
            const GMAIL_REFRESH_TOKEN = process.env.REFRESHTOKEN;
            const GMAIL_ID = process.env.EMAIL ;
            const OAUTH_PLAYGROUND = process.env.OAUTH_PLAYGROUND ;

            const oauth2Client = new OAuth2(
            GMAIL_CLIENT_ID,
            GMAIL_CLIENT_SECRET,
            OAUTH_PLAYGROUND
            );

            oauth2Client.setCredentials({
            refresh_token: GMAIL_REFRESH_TOKEN,
            });

            google.options({ auth: oauth2Client }); // Apply the settings globally 

            const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) console.log(err); // Handling the errors
                else resolve(token);
            });
            });

            const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: GMAIL_ID,
                clientId: GMAIL_CLIENT_ID,
                clientSecret: GMAIL_CLIENT_SECRET,
                refreshToken: GMAIL_REFRESH_TOKEN,
                accessToken,
            },
            });
            const mailOptions = {
            from: GMAIL_ID,
            to: email_user,
            subject: "[Mot de passe oublié] Nous vous accompagnons pour modifier votre mot de passe 🤩",
            text: "message",
            html: `<h3>Bonjour Mr ${firstname_user}</h3><p>rien de grave !</p><p>Nous vous accompagnons pour modifier votre mot de</p><p>Cela vous permettra de garder une securité optimale</p><p>vos amis sont impatient de vous retrouver sur honde</p><a target='_blank' href='http://localhost:8080/accounts/password/reset/${toke_pwd_reseting_user}'><button type='submit'>cliquer ICI finaliser mon inscription</button></a>`
            };

            transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                console.log(err);
            } else {
                console.log(info);
            }
            });
        }catch(erreur){
            console.log(erreur);
        }
    }

    //MAIL CONF MODIF PASSE WORD
    async send_mail_conf_reset_password(email_user, firstname_user){
        
        try{
            const GMAIL_CLIENT_ID = process.env.CLIENTID;
            const GMAIL_CLIENT_SECRET = process.env.CLIENTSECRET;
            const GMAIL_REFRESH_TOKEN = process.env.REFRESHTOKEN;
            const GMAIL_ID = process.env.EMAIL ;
            const OAUTH_PLAYGROUND = process.env.OAUTH_PLAYGROUND ;

            const oauth2Client = new OAuth2(
            GMAIL_CLIENT_ID,
            GMAIL_CLIENT_SECRET,
            OAUTH_PLAYGROUND
            );

            oauth2Client.setCredentials({
            refresh_token: GMAIL_REFRESH_TOKEN,
            });

            google.options({ auth: oauth2Client }); // Apply the settings globally 

            const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) console.log(err); // Handling the errors
                else resolve(token);
            });
            });

            const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: GMAIL_ID,
                clientId: GMAIL_CLIENT_ID,
                clientSecret: GMAIL_CLIENT_SECRET,
                refreshToken: GMAIL_REFRESH_TOKEN,
                accessToken,
            },
            });
            const mailOptions = {
            from: GMAIL_ID,
            to: email_user,
            subject: "[Mot de passe modifié] Votre mot de passe vient d'étre modifié 🤩",
            text: "message",
            html: `<h3>Bonjour Mr ${firstname_user}</h3><p>Vous vené de changer votre mot de passe</p>`
            };

            transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
            });
        }catch(erreur){
            console.log(erreur);
        }
    }
}