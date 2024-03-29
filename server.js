const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});

const sharedsession = require("express-socket.io-session");
var favicon = require("serve-favicon");
var path = require("path");
const multer = require('multer');
const cors = require('cors');

const ejs = require("ejs");

const bcrypt = require("bcrypt");
const Mailer = require("./node_emailer/Mailer.js");
const nb_salt = 10;
const crypt_salt = bcrypt.genSaltSync(nb_salt);

//SESSION
app.use(session);

io.use(sharedsession(session));

//BDD CONNEXION
const mongoose = require('mongoose'); 
require("./Models/dbConfig.js");
//COLLECTION
const ObjectId = mongoose.Types.ObjectId;
const { User } = require("./Models/User_db.js");
const { Posts } = require("./Models/Posts_db.js");
const { MessagePrivate } = require("./Models/Message_private_db.js");
const { RoomMessagePrivate } = require("./Models/Room_message_private_db");

//ROUTE SERVEUR
const servePort = process.env.PORT || 8080;

//PARSE METHODE POST
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//FIVICON
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

//EJS
app.set("view engine", "ejs");

//CSS STATIC
app.use("/css", express.static("public/css"));
app.use("/js", express.static("public/javascript"));
app.use("/imgstatic", express.static("public/assets"));
app.use("/avatar_user", express.static("imgs_videos_customers_posts/post_profil_avatar_customers"));
app.use("/post_img_user", express.static("imgs_videos_customers_posts/post_images_videos_customers"));

app.use(cors());

//Middleware INCLUDE
// const checkfield = require('./Middleware/checkfield');
const validation_registration_midd = require("./Middleware/validation_registration_midd");
const deconnected = require("./Middleware/deconnected");
//const account_midd = require('./Middleware/account_midd');

//Middleware URL
// app.use('/checkfield', checkfield);
app.use(
  "/account/validationregistration/:toke_validation_user",
  validation_registration_midd
);
app.use("/deconnected", deconnected);
//app.use('/account', account_midd);


//SOCKET IO SERVER


//HOME PAGE
app.get("/", (req, res) => {
  if (req.session.mail_user) {
    res.set("Content-Type", "text/html");
    res.redirect("/account");
    return res.end();
  } else {
    res.render("index_view_component.ejs");
  }
});

//PAGE CONNECTION
app.get("/accounts/login", (req, res) => {
  if (req.session.mail_user) {
    console.log("UNE SESSION");
    res.set("Content-Type", "text/html");
    res.redirect("/account");
    return res.end();
  } else {
    console.log("PAS SESSION");
    res.render("login_view_component.ejs");
  }
});

//PAGE REGISTER FOR NEW CUSTOMER
app.get("/accounts/emailsignup", (req, res) => {
  if (req.session.mail_user) {
    console.log("UNE SESSION");
    res.set("Content-Type", "text/html");
    res.redirect("/account");
    return res.end();
  } else {
    console.log("PAS SESSION");
    res.render("register_view_component.ejs");
  }
});

//PAGE MESSAGE REGISTER IS GOOD CHECK MAIL FOR VALIDE TOKEN REGISTER
app.get("/account/registerok/checkmail", (req, res) => {
  res.render("check_mail_after_register_view_component.ejs");
});

//PAGE MESSAGE AFTER VALID TOKEN REGISTER
app.get("/account/validationregistration/:toke_validation_user", (req, res) => {
  res.render("validation_registration.ejs");
});

//PAGE SEND MAIL FOR CHANGE PASSE WORD
app.get("/accounts/password/reset", (req, res, next) => {
  res.render("pwd_reset_view_component.ejs");
});

//PAGE MESSAGE CHECK MAIL FOR CONFIRME RESET PASS WORD
app.get("/accounts/passwordreset/checkmail", (req, res, next) => {
  console.log(
    "/accounts/passwordreset/checkmail 123 SESSION : ",
    req.session.mail_user
  );
  res.render("pwd_reset_after_view_compnent.ejs");
});

//PAGE FORM 2 FIELDS FOR RESET PASS WORD
app.get("/accounts/password/reset/:toke_pdw_reseting_user", (req, res) => {
  //console.log("PARAMETTRE", req.params);
  console.log(
    "/accounts/password/reset/:toke_pdw_reseting_user 131 SESSION : ",
    req.session.mail_user
  );
  req.session.toke_pdw_reseting_user = req.params.toke_pdw_reseting_user;

  User.findOne({ toke_pwd_reseting_user: req.params.toke_pdw_reseting_user })
    .exec()
    .then((result) => {
      console.log("result ", result);
      if (result) {
        req.session.toke_pdw_reseting_user = req.params.toke_pdw_reseting_user;
        res.render("pwd_reseting_view_component.ejs");
      } else {
        res.redirect(301, "/");
      }
    })
    .catch((erreur) => {
      console.log("erreur :", erreur);
    });
});

//PAGE MESSAGE CONFIRME RESET PASSWORD
app.get("/accounts/passwordreset/congratulations", (req, res, next) => {
  console.log(
    "/accounts/passwordreset/congratulations 152 SESSION : ",
    req.session.mail_user
  );
  res.render("pwd_reseting_after_view_compnent.ejs");
});

//PAGE IF HE IS CONNECTED
app.get("/account", (req, res) => {
  if (req.session.mail_user) {
    res.render("account_view_component.ejs", { user_session: req.session });
  } else {
    res.set("Content-Type", "text/html");
    res.redirect("/");
    return res.end();
  }
});

app.get("/direct/inbox", (req, res) => {
  if (req.session.id_user) {
    res.render("private_message_view_component.ejs", { user_session: req.session });
  } else {
    res.set("Content-Type", "text/html");
    res.redirect("/account");
    return res.end();
  }
});


app.get("/direct/t/:id_friends", (req, res) => {
  console.log("/direct/inbox/:profil_id 181 SESSION : ", req.params);
  if (req.session.id_user) {
    res.render("private_message_view_component.ejs", { user_session: req.session });
  } else {
    res.set("Content-Type", "text/html");
    res.redirect("/account");
    return res.end();
  }
});

app.get("/account/profil", (req, res) => {
  if (req.session.id_user) {
    Posts.find({ id_post_user :req.session.id_user})
    .exec()
    .then( result_post => {
      console.log('result_post : ', result_post);
      res.render("profil_view_component.ejs", { user_session: req.session, result_post:result_post  });
    })
    .catch(erreur_post => {

    })
  } else {
    res.set("Content-Type", "text/html");
    res.redirect("/account");
    return res.end();
  }
});

app.get("/accounts/edit", (req, res) => {
  if (req.session.id_user) {
    console.log("UNE SESSION");
    res.render("setting_view_component.ejs", { user_session: req.session });
  } else {
    res.set("Content-Type", "text/html");
    res.redirect("/account");
    return res.end();
  }
});

//Search Friends Ajax 

app.post('/search_friends_ajax', async (req, res, next) => {

  var reponse_check = {};

  const form_type_view = req.body.form_type_view;
  const input_search_friends = req.body.input_search_friends;

  if( form_type_view === "form_seach_friends_speak_private_message_container_fom"){
    var regex = new RegExp(input_search_friends, 'i');
    await User.find({$or:[ {'lastname_user':regex}, {'firstname_user':regex}]})
    .exec()
    .then(find_friends => {
      reponse_check["frind_friends"] = find_friends;

    })
    .catch(erreur => {
      console.log('246 PAS DE AMI', erreur);
    })
  }
  res.status(200).json(reponse_check);
});
//AUTHENTICATE AJAX REQUEST
app.post("/checkfield", async (req, res, next) => {
  //let User = require('./Models/User_db');
  var reponse_check = {};

  //VERIFICATION
  var regex_email =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (req.body) {
    const form_type_view = req.body.form_type_view;
    const email_user = req.body.email_user;
    const firstname_user = req.body.firstname_user;
    const lastname_user = req.body.lastname_user;
    const password_user = req.body.password_user;
    const conf_password_user = req.body.conf_password_user;

    /*FORM REGISTER*/
    if (form_type_view === "register_type_view") {
      //Email CHECK

      if (!regex_email.test(String(email_user))) {
        reponse_check["email_user"] = " Email incorect ";
      }

      if (regex_email.test(String(email_user))) {
        await User.findOne({ email_user: email_user })
          .then((find_email_user) => {
            if (find_email_user) {
              try {
                reponse_check["email_user"] = " Email déja utilisé ";
              } catch (error) {
                console.log("TRY CATCH ERROR");
              }
            }
          })
          .catch((err) => {
            console.log("ERREUR MESSAGE : => " + err);
          });
      }

      if (firstname_user.length <= 2) {
        reponse_check["firstname_user"] = "2 catacteres minimum ";
      }
      if (lastname_user.length <= 2) {
        reponse_check["lastname_user"] = "2 catacteres minimum ";
      }
      if (password_user.length <= 6) {
        reponse_check["password_user"] =
          " Doit comprendre 6 caracteres minimum ";
      }
      if (
        conf_password_user != password_user ||
        conf_password_user.length <= 6
      ) {
        reponse_check["conf_password_user"] =
          " Doit étre égal au mot de passe ";
      }

      //SAVA IN THE DATA BASE
      if (Object.keys(reponse_check).length === 0) {
        //INSCRIPTION A LA BASE DE DONNEE

        const password_user_crypt = bcrypt.hashSync(password_user, crypt_salt);
        const selt_token = 10000000000;
        const toke_validation_user = parseInt(Math.random() * selt_token);
        const user_save_register = new User({
          email_user: email_user,
          firstname_user: firstname_user,
          lastname_user: lastname_user,
          password_user: password_user_crypt,
          toke_valid_user: toke_validation_user,
        });
        user_save_register.save();

        //ENVOIE DU MAIL DE VALIDATION POUR L INSCRIPTION
        const mailer_register = new Mailer();
        mailer_register.send_mail_register(
          email_user,
          firstname_user,
          toke_validation_user
        );

        //after register we redirect
        reponse_check["redirection_login"] = "/account/registerok/checkmail";
      } else {
        console.log("NOT SAVE ! ");
      }
    }

    /*FORM LOGIN CONNECTION*/
    if (form_type_view === "login_type_view") {
      if (!regex_email.test(String(email_user))) {
        reponse_check["email_user"] = " Email incorect ";
      }

      if (password_user.length <= 6) {
        reponse_check["password_user"] =
          " Doit comprendre 6 caracteres minimum ";
      }

      if (regex_email.test(String(email_user)) && password_user.length >= 6) {
        await User.findOne({ email_user: email_user })
          .exec()
          .then(async (find_user) => {

            //IF NOT FIND MAIL
            if (!find_user) {
              reponse_check["password_user"] =
                "Email ou mot de passe incorrecte ";
              //REDIRECTION ACCOUNT
            }

            //IF FIND MAIL
            if (find_user) {
              var compare_password_user = bcrypt.compareSync(
                password_user,
                find_user.password_user
              );
              // result == true
              if (compare_password_user) {
                if (find_user.role === 0) {
                  reponse_check["password_user"] =
                    "Email ou mot de passe incorrecte ";
                  //REDIRECTION ACCOUNT
                }

                //FOR CONNECTE THE ROLE THERE IN ARE AT 1
                if (
                  find_user.email_user === email_user &&
                  find_user.role === 1
                ) {
                  console.log("EMAIL OK 2");
                  await User.findOneAndUpdate(
                    { email_user: email_user },
                    { $set: { role: 2 } }
                  )
                    .exec()
                    .then(async (result) => {
                      if (result) {
                        //MAIL AND PASSWORD IS GOOD
                        await User.findOne({ email_user: email_user })
                          .exec()
                          .then(async (find_user) => {
                            //SI C EST LA 1ER FOIS QU IL SE CONNECT EN CREE UNE SESSION
                            if (find_user) {
                              console.log("FINI FINI", find_user);
                              req.session.id_user = find_user._id;
                              req.session.mail_user = find_user.email_user;
                              req.session.firstname_user = find_user.firstname_user;
                              req.session.lastname_user = find_user.lastname_user;
                              req.session.avatar_user = find_user.avatar_user;
                              req.session.createdAt = find_user.createdAt;

                              console.log("req.session 244 ", req.session);
                              // res.status('301');
                              // res.redirect("/account");
                              //CYRIL ReCTIF
                              reponse_check["redirection_account"] = "/account";
                              //REDIRECTION ACCOUNT
                            }
                          })
                          .catch((erreur) => {
                            console.log("erreur =>", erreur);
                          });
                      }
                    })
                    .catch((erreur) => {
                      console.log("ERREUR VALIDATION TOKEN : ", erreur);
                    });
                }
                if (
                  find_user.email_user === email_user &&
                  find_user.role === 2
                ) {
                  await User.findOne({ email_user: email_user })
                    .exec()
                    .then(async (find_user) => {
                      if (find_user) {
                        //SI C EST LA 2EME FOIS OU PLUS QU IL SE CONNECT EN CREE UNE SESSION
                        console.log("FINI FINI ROLE 2", find_user);
                        req.session.id_user = find_user._id;
                        req.session.mail_user = find_user.email_user;
                        req.session.firstname_user = find_user.firstname_user;
                        req.session.lastname_user = find_user.lastname_user;
                        req.session.avatar_user = find_user.avatar_user;
                        req.session.createdAt = find_user.createdAt;
                        // res.status('301');
                        // res.setHeader('Content-Type', 'application/json');
                        // res.status(404);
                        // res.redirect("/account");
                        //CYRIL ReCTIF
                        reponse_check["redirection_account"] = "/account";
                        //REDIRECTION ACCOUNT
                      }
                    })
                    .catch((erreur) => {
                      console.log("erreur =>", erreur);
                    });
                }
              }
              if (!compare_password_user) {
                reponse_check["password_user"] =
                  "Email ou mot de passe incorrecte ";
              }
            }
          });
      }
    }

    //REST PASS WORD
    if (form_type_view === "password_reset_type_view") {
      if (!regex_email.test(String(email_user))) {
        reponse_check["email_user"] = " Email incorect ";
      }

      if (regex_email.test(String(email_user))) {
        const selt_token = 10000000000;
        const toke_pwd_reseting_user = parseInt(Math.random() * selt_token);
        //ADD TOKEN IN THE toke_pwd_reseting_user

        await User.findOneAndUpdate(
          { email_user: email_user },
          { toke_pwd_reseting_user: toke_pwd_reseting_user }
        )
          .exec()
          .then(async (result) => {
            //IF IS NOT FIND EMAIL IN THE DATA BASE
            if (!result) {
              try {
                reponse_check["email_user"] = " Email incorect USER 353";
              } catch (error) {
                console.log("TRY CATCH ERROR");
              }
            }

            if (result) {
              //ENVOIE DU MAIL DE VALIDATION POUR L INSCRIPTION
              const mailer_reset_password = new Mailer();
              //envoie du mail
              await mailer_reset_password.send_mail_reset_password(
                email_user,
                result.firstname_user,
                toke_pwd_reseting_user
              );

              reponse_check["redirection_account"] =
                "/accounts/passwordreset/checkmail";
              console.log("IL Y A EU U CHANGEMENT 357");
            }
          })
          .catch((erreur) => {
            console.log(
              "impossible d'inserer le nouveau mot de passe : ",
              erreur
            );
          });
      }
    }

    //RESTING PASS WORD
    if (form_type_view === "password_reseting_type_view") {
      // const password_user = req.body.password_user;
      //  const conf_password_user = req.body.conf_password_user;

      if (password_user.length <= 6) {
        reponse_check["password_user"] =
          " Doit comprendre 6 caracteres minimum ";
      }

      if (
        conf_password_user != password_user ||
        conf_password_user.length <= 6
      ) {
        reponse_check["conf_password_user"] =
          " Doit étre égal au mot de passe ";
      }

      //SAVA IN THE DATA BASE
      if (Object.keys(reponse_check).length === 0) {
        //INSCRIPTION A LA BASE DE DONNEE
        const toke_pdw_reseting_user = req.session.toke_pdw_reseting_user;

        console.log("toke_pdw_reseting_user 430 => ", toke_pdw_reseting_user);
        //const password_user = req.body.password_user;
        const password_user_crypt = bcrypt.hashSync(password_user, crypt_salt);

        await User.findOneAndUpdate(
          { toke_pwd_reseting_user: toke_pdw_reseting_user },
          { password_user: password_user_crypt, toke_pwd_reseting_user: 0000 }
        )
          .then(async (result) => {
            if (result) {
              delete req.session.toke_pdw_reseting_user;
              //ENVOIE DU MAIL DE VALIDATION POUR L INSCRIPTION
              const mailer_reseting_password = new Mailer();
              //envoie du mail
              await mailer_reseting_password.send_mail_conf_reset_password(
                result.email_user,
                result.firstname_user
              );

              //after rest password we redirect
              reponse_check["redirection_account"] =
                "/accounts/passwordreset/congratulations";
            }
          })
          .catch((erreur) => {
            console.log("impossible d'inserer le nouveau mot de passe");
          });
      } else {
        console.log("NOT SAVE ! ");
      }
    }
    res.status(200).json(reponse_check);
  }
});
//set storage engine
var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, `/Users/mabozahondi/Desktop/honde.fr/imgs_videos_customers_posts/post_profil_avatar_customers`);
  },
  filename:function(req, file, cb){
    cb(null, 'honde'+'-'+Date.now()+path.extname(file.originalname));
  }
});

const upload = multer ({
  storage:storage,
}).single('avatar_user_inp');

//UPDATE VIDEO AND IMG AJAX REQUEST
app.post("/updatevideoandimage", async (req, res) => {
  console.log('AVATAR ');
  upload(req, res, async (err) => {
    if(err){
      console.log('Erreur : ', err);
    }else{
      await User.findOneAndUpdate({ _id :req.session.id_user},{ avatar_user : req.file.filename})
      .exec()
      .then(result => {
        if(result){
          req.session.avatar_user = req.file.filename;
          res.set("Content-Type", "text/html");
          res.redirect("/account");
        }
      })
      .catch(erreur => {
        console.log('599 add avatar erreur :', erreur);
      })
    }
  });
});

//set storage engine
var storage_post = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, `/Users/mabozahondi/Desktop/honde.fr/imgs_videos_customers_posts/post_images_videos_customers`);
  },
  filename:function(req, file, cb){
    cb(null, 'honde_posts'+'_'+Date.now()+path.extname(file.originalname));
  }
});
const upload_post = multer ({
  storage:storage_post,
}).single('post_img_inp');

//UPDATE VIDEO AND IMG 
app.post("/post_img_form", async (req, res) => {
  console.log('POST IMAGE ET VDIEOS ');
  upload_post(req, res, async (err) => {
    if(err){
      console.log('Erreur : ', err);
    }else{
      const post_save = new Posts({
        id_post_user:req.session.id_user,
        filename_post:req.file.filename,
        mimetype:req.file.mimetype
      });
      post_save.save();
      res.set("Content-Type", "text/html");
      res.redirect("/account/profil");



      //account/profil
      
    }
  });
});





//DECONNECTÉ AJAX REQUEST
app.get("/deconnected", (req, res) => {
  req.session.destroy();
  res.status("301").redirect("/");
  console.log("DECONNECTION");
});

app.get("**", (req, res) => {
  res.render("erreur_view_component.ejs");
});

var connectedUsers = [];

//SOCKET IO
io.on('connection', socket => {

  console.log('CONNECTÈ')

  socket.pseudo_id_user = socket.handshake.session.id_user;
  connectedUsers.push(socket);


  //DISPLAY OLD MESSAGES WHEN THE USER IS CONNECTED
  MessagePrivate.find({})
  .exec()
  .then(old_messages => {
    console.log('old_messages :', old_messages);
    console.log('socket.handshake.session.id_user : ', socket.handshake.session.id_user);
    socket.emit('old_messages', {old_messages : old_messages, id_session_user : socket.handshake.session.id_user });
  })
  .catch(erreur => {
    console.log('ERREUR RECUP MESSAGE');
  });


  //RECEVE MESSAGES
  socket.on('new_message_user', (message_user, recipient_user)=> {

    //MODE : message_user : SALUT TOi et recipient_user : 60be0801a389221e2a08dade 622
    console.log(`message_user : ${message_user} et recipient_user : ${recipient_user} 622`);

    //RECEVER
    User.findOne({ _id :recipient_user}, (err, user)=> {

      if(!user){
        return false;
      }else{

    const user_save_message_private = new MessagePrivate({
      id_sender : socket.handshake.session.id_user,
      message : message_user,
      recipient_user: recipient_user});

    user_save_message_private.save();

    //ENVOYER LE MESSAGE
    socket.broadcast.emit('new_message_friend', message_user);

        // socketReceveiver = connectedUsers.find(socket => socket.pseudo_id_user === recipient_user);
    
        // if(socketReceveiver){
        //   socketReceveiver.emit('new_message_friend', {send_by: socket.handshake.session.lastname_user,message_user:message_user});
        // }
      }
    });

    //console.log('SESSION SOCKET : YES SAMUEL', socket.handshake.session);
  });

  socket.on('disconnect', (reason) => {
    console.log('DECONNECTION : 649 ')
    var index = connectedUsers.indexOf(socket);
    socket.emit('quit_user', 'true');
    console.log('QUITE QUITE 652');
    if(index > -1){
      connectedUsers.splice(index, 1);
    }
  });
})

server.listen(servePort);


//looa
//lzpe
//ppdzcc