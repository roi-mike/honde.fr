"use strict";

var bcrypt = require('bcrypt');

var Mailer = require('../node_emailer/Mailer.js');

var nb_salt = 10;
var crypt_salt = bcrypt.genSaltSync(nb_salt);

var checkfield = function checkfield(req, res, next) {
  var form_register_type_view, email_user, firstname_user, lastname_user, password_user, conf_password_user, _require, User, reponse_check, regex_email, password_user_crypt, selt_token, toke_validation_user, use_save_register, mailer_register;

  return regeneratorRuntime.async(function checkfield$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          form_register_type_view = req.body.form_register_type_view;
          email_user = req.body.email_user;
          firstname_user = req.body.firstname_user;
          lastname_user = req.body.lastname_user;
          password_user = req.body.password_user;
          conf_password_user = req.body.conf_password_user; //COLLECTION

          _require = require('../Models/User_db.js'), User = _require.User; //let User = require('./Models/User_db');

          reponse_check = {}; //VERIFICATION

          regex_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

          if (!(form_register_type_view === 'register_type_view')) {
            _context.next = 19;
            break;
          }

          //Email CHECK
          if (!regex_email.test(String(email_user))) {
            reponse_check["email_user"] = " Email incorect ";
          }

          if (!regex_email.test(String(email_user))) {
            _context.next = 14;
            break;
          }

          _context.next = 14;
          await User.findOne({
            email_user: email_user
          }).then(function (find_email_user) {
            if (find_email_user) {
              try {
                reponse_check["email_user"] = " Email déja utilisé ";
              } catch (error) {
                console.log('CRASH EMAIL DE UTILISÉ');
              }
            }
          })["catch"](function (err) {
            console.log("ERREUR MESSAGE : => " + err);
          }));

        case 14:
          if (firstname_user.length <= 2) {
            reponse_check["firstname_user"] = "2 catacteres minimum ";
          }

          if (lastname_user.length <= 2) {
            reponse_check["lastname_user"] = "2 catacteres minimum ";
          }

          if (password_user.length <= 6) {
            reponse_check["password_user"] = " Doit comprendre 6 caracteres minimum ";
          }

          if (conf_password_user != password_user || conf_password_user.length <= 6) {
            reponse_check["conf_password_user"] = " Doit étre égal au mot de passe ";
          } //SAVA IN THE DATA BASE


          if (Object.keys(reponse_check).length === 0) {
            //INSCRIPTION A LA BASE DE DONNEE
            password_user_crypt = bcrypt.hashSync(password_user, crypt_salt);
            selt_token = 10000000000;
            toke_validation_user = parseInt(Math.random() * selt_token);
            use_save_register = new User({
              email_user: email_user,
              firstname_user: firstname_user,
              lastname_user: lastname_user,
              password_user: password_user_crypt,
              toke_valid_user: toke_validation_user
            });
            use_save_register.save(); //ENVOIE DU MAIL DE VALIDATION POUR L INSCRIPTION

            require('../node_emailer/Mailer.js');

            mailer_register = new Mailer();
            mailer_register.send_mail_register(email_user, firstname_user, toke_validation_user);
          } else {
            console.log('NOT SAVE ! ');
          }

        case 19:
          res.status(200).json(reponse_check);

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = checkfield;