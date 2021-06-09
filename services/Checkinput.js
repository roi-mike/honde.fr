'use strict';

const User = require('../Models/User_db');

function check_field_register(type_view, type_tag,value_tag, field_compar = null){

    
        const validation = 0;
        let regex_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        //REGISTER
        if( type_view === "register_type_view"){

            //EMAIL
            if( regex_email.test(String(value_tag).toLowerCase()) && type_tag === "email_user" ){
                return {"field": type_tag  ,"color":"#00ff5f", "autho":1, "agree":true, "validate": validation };//COLOR GREEN
            }
 
            if( type_tag === "email_user" && User.find({ email_user:value_tag}) ){
                return { "salut" : "c dst bon " };
            }

            //FIRST NAME
            if(value_tag.length >= 2 && type_tag === "firstname_user"){
                return {"field": type_tag  ,color:"#00ff5f", "autho":1, "agree":true, "validate": validation };
            }

            //LAST NAME
            if(value_tag.length >= 2 && type_tag === "lastname_user"){
                return {"field": type_tag  ,color:"#00ff5f", "autho":1, "agree":true , "validate": validation };
            }

            //PDW
            if(value_tag.length >= 6 && type_tag === "password_user"){
                return {"field": type_tag  ,color:"#00ff5f", "autho":1, "agree":true , "validate": validation };
            }

            //CONF PWD
            if(value_tag === field_compar  && type_tag === "conf_password_user"){
                return {"field": type_tag  ,color:"#00ff5f", "autho":1, "agree":true , "validate": validation };
            }else{
                return {"field": type_tag  ,color:"#ff0000", "autho":-1, "agree":false , "validate": validation };
            }

        }else{
            return false;
        }



    }


    module.exports.check_field_register = check_field_register;