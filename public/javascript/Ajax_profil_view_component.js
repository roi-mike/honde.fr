const img_personnage_authentification_img = document.getElementById('img_personnage_authentification_img');

function ajax_register(form_type_view, email_user, firstname_user, lastname_user, password_user, conf_password_user){

    function reqListener(){
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
  
      }
    }
    
    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("post", "/updatevideoandimage", true);
    oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    oReq.send("form_type_view="+form_type_view+"&"+"email_user="+email_user+"&"+"firstname_user="+firstname_user+"&"+"lastname_user="+lastname_user+"&"+"password_user="+password_user+"&"+"conf_password_user="+conf_password_user);
  
    //
  }



img_personnage_authentification_img.addEventListener('click', function (param) {
    console.log('CLIQUE SUR PHOTO');


})