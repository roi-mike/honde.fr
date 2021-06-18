const form_type_view = document.getElementById('password_reseting_type_view').getAttribute('id');
const button_user = document.getElementById("button_user");

function ajax_register(form_type_view, password_user, conf_password_user){

  function reqListener(){
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        
      var reponce_login = JSON.parse(this.response);
      
      console.log('reponce_login ERREUR  : ', reponce_login);
      
      if(reponce_login.redirection_account){
        window.location.href = reponce_login.redirection_account;
      }

      var remove_element_1 = document.getElementById("password_user_erreur");
      var remove_element_2 = document.getElementById("conf_password_user_erreur");

      if(remove_element_1){
        remove_element_1.remove();
      }

      if(remove_element_2){
        remove_element_2.remove();
      }

      if(!reponce_login.redirection_account){
        if(reponce_login){
          for(var i = 0; i < Object.keys(reponce_login).length; i++){
            var tag_insert = document.getElementById(Object.keys(reponce_login)[i]);
            var create_write_element_span = document.createElement("div");
            create_write_element_span.setAttribute('id',Object.keys(reponce_login)[i]+"_erreur");
            create_write_element_span.style.color = "red";
            create_write_element_span.setAttribute('class',"span_erreur");
            create_write_element_span.innerHTML = Object.values(reponce_login)[i];
            
            tag_insert.after(create_write_element_span);
          }
        }
      }
      

      
    //   if(remove_element_1){
    //     remove_element_1.remove();
    //     console.log('REMOVE');
    //   }
    //   if(remove_element_2){
    //     remove_element_2.remove();
    //   }
    //   if(remove_element_3){
    //     remove_element_3.remove();
    //   }
      
    //   for(var i = 0; i < Object.keys(reponce_register).length; i++){
    //     var tag_insert = document.getElementById(Object.keys(reponce_register)[i]);
    //     var create_write_element_span = document.createElement("div");
    //     create_write_element_span.setAttribute('id',Object.keys(reponce_register)[i]+"_erreur");
    //     create_write_element_span.style.color = "red";
    //     create_write_element_span.setAttribute('class',"span_erreur");
    //     create_write_element_span.innerHTML = Object.values(reponce_register)[i];
    //     tag_insert.after(create_write_element_span);
    //   }
    }
  }
  
  var oReq = new XMLHttpRequest();
  oReq.onload = reqListener;
  oReq.open("post", "/checkfield", true);
  oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  oReq.send("form_type_view="+form_type_view+"&"+"password_user="+password_user+"&"+"conf_password_user="+conf_password_user);
}


button_user.addEventListener('click', function(evt){
  evt.preventDefault();
  const password_user = document.getElementById("password_user").value;
  const conf_password_user = document.getElementById("conf_password_user").value;
  
  ajax_register(form_type_view, password_user, conf_password_user);
});
