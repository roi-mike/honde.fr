var formData = new FormData();
function ajax_setting_avatar(avatar_user_inp){

  function reqListener(){
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        
      var reponce_setting = JSON.parse(this.response);

      if(reponce_setting){
          console.log('FILE REçU !')
      }
    }
  }
  
  var oReq = new XMLHttpRequest();
  oReq.onload = reqListener;
  oReq.open("post", "/updatevideoandimage");
  oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  oReq.send("avatar_user_inp="+avatar_user_inp);
}

//BUTTON
const reset_avatar_btn = document.getElementById('reset_avatar_btn');

//BUTTON CLIQUÉ
// reset_avatar_btn.addEventListener('click', function(evt){
//   evt.preventDefault();
  
// //const form_type_view = document.getElementById('form_reset_avatar_user').getAttribute('id');
// const avatar_user_inp = document.getElementById('avatar_user_inp');
  

//     ajax_setting_avatar(avatar_user_inp.files[0].File);



//   console.log('AJAX ENVOYÉ ! ');
// });
