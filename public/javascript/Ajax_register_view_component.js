"use strict";

const form_register_type_view = document.getElementById('register_type_view').getAttribute('id');
const button_user = document.getElementById("button_user");

function ajax_register(form_register_type_view, email_user, firstname_user, lastname_user, password_user, conf_password_user){

  function reqListener(){
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

      var reponce_register = JSON.parse(this.response);
      var remove_element_1 = document.getElementById("email_user_erreur");
      var remove_element_2 = document.getElementById("firstname_user_erreur");
      var remove_element_3 = document.getElementById("lastname_user_erreur");
      var remove_element_4 = document.getElementById("password_user_erreur");
      var remove_element_5 = document.getElementById("conf_password_user_erreur");
      if(remove_element_1){
        remove_element_1.remove();
        console.log('REMOVE');
      }
      if(remove_element_2){
        remove_element_2.remove();
      }
      if(remove_element_3){
        remove_element_3.remove();
      }
      if(remove_element_4){
        remove_element_4.remove();
      }
      if(remove_element_5){
        remove_element_5.remove();
      }
      for(var i = 0; i < Object.keys(reponce_register).length; i++){
        var tag_insert = document.getElementById(Object.keys(reponce_register)[i]);
        var create_write_element_span = document.createElement("div");
        create_write_element_span.setAttribute('id',Object.keys(reponce_register)[i]+"_erreur");
        create_write_element_span.style.color = "red";
        create_write_element_span.setAttribute('class',"span_erreur");
        create_write_element_span.innerHTML = Object.values(reponce_register)[i];
        tag_insert.after(create_write_element_span);
      }
    }
  }
  
  var oReq = new XMLHttpRequest();
  oReq.onload = reqListener;
  oReq.open("post", "/checkfield", true);
  oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  oReq.send("form_register_type_view="+form_register_type_view+"&"+"email_user="+email_user+"&"+"firstname_user="+firstname_user+"&"+"lastname_user="+lastname_user+"&"+"password_user="+password_user+"&"+"conf_password_user="+conf_password_user);

  //
}


button_user.addEventListener('click', function(evt){
  evt.preventDefault();
  let email_user = document.getElementById("email_user").value;
  const firstname_user = document.getElementById("firstname_user").value;
  const lastname_user = document.getElementById("lastname_user").value;
  const password_user = document.getElementById("password_user").value;
  const conf_password_user = document.getElementById("conf_password_user").value;
  
  ajax_register(form_register_type_view, email_user, firstname_user, lastname_user, password_user, conf_password_user);
});


// REQUETE AJAX
// function check_field_input(type_view, type_tag, value_tag, field_compar) {

//   function checkfield() {
//     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {

//       console.log(this.response);
//       // Requête finie, traitement ici.
//       // var response = JSON.parse(this.response);
//       // console.log('THSI ', response);
//       // document.getElementById(response.field).style.color = response.color;
//       // document.getElementById(response.field).style.borderColor = response.color;
//       //   if(response.placeholder){
//       //     document.getElementById(response.field).value = '';
//       //     document.getElementById(response.field).placeholder = response.placeholder;
//       //   }
//       // setTimeout(() => {
//       // document.getElementById(response.field).style.color = "black";
//       // }, 1200);
//     }
//   }

//   var check_field = new XMLHttpRequest();
//   check_field.onload = checkfield;
//   check_field.open("post", "/checkfield", true);
//   check_field.setRequestHeader(
//     "Content-Type",
//     "application/x-www-form-urlencoded"
//   );
//   check_field.send("type_view"+"="+type_view+"&"+"field_tag"+"="+type_tag+"&"+"value_tag"+ "="+value_tag+"&"+"field_compar"+"="+field_compar.value);
// }
