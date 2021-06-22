const socket = io();

const bar_seach_friends_speak_private_message_container_inp =
  document.getElementById(
    "bar_seach_friends_speak_private_message_container_inp"
  );

const form_seach_friends_speak_private_message_container_fom =
  document.getElementById(
    "form_seach_friends_speak_private_message_container_fom"
  );

const list_seach_friends_speak_private_message_container_div =
  document.getElementById(
    "list_seach_friends_speak_private_message_container_div"
  );

  const list_friends_speak_private_message_container_div = document.getElementById('list_friends_speak_private_message_container_div');

let click_bar_search_fiend = false;

var recipient_user = '';

//AJAX SEARCH FRIENDS --------------------

function ajax_search_friends(form_type_view, input_search_friends) {
  function reqListener() {

    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var reponce_search_friends = JSON.parse(this.response);

      for (var i = 0; i < reponce_search_friends.frind_friends.length; i++) {
          //CRATION LISTE FRIENDS
        var status_friends_speak_private_message_container_div =
            document.createElement("div");

        status_friends_speak_private_message_container_div.setAttribute(
          "class",
          "status_friends_speak_private_message_container_div",
        );
  
        status_friends_speak_private_message_container_div.setAttribute(
          "onclick",
          "status_friends(this)"
        );

        //PREMIERE BLOQUE IMG
        const img_user_container_div = document.createElement("div");
        img_user_container_div.setAttribute("id", "img_user_container_div");

        const img_personnage_authentification_img = document.createElement("img");
        img_personnage_authentification_img.setAttribute(
          "id",
          "img_personnage_authentification_img"
        );
        img_personnage_authentification_img.setAttribute(
          "name",
          "img_personnage_authentification_img"
        );
        img_personnage_authentification_img.setAttribute(
          "src",
          `/avatar_user/${reponce_search_friends.frind_friends[i].avatar_user}`
        );
        img_user_container_div.appendChild(img_personnage_authentification_img);

        const inline_friends_speak_private_message_container_div = document.createElement("span");
        inline_friends_speak_private_message_container_div.setAttribute(
            "id",
            "inline_friends_speak_private_message_container_div"
        );
        img_user_container_div.appendChild(inline_friends_speak_private_message_container_div);


        //BLOQUE 2
        status_friends_speak_private_message_container_div.appendChild(img_user_container_div)

        const info_friends_speak_private_message_container_div = document.createElement("div");
        info_friends_speak_private_message_container_div.setAttribute('id', 'info_friends_speak_private_message_container_div');
        img_user_container_div.after(info_friends_speak_private_message_container_div);

        const chield_search_friends_one = document.createElement('div');
        chield_search_friends_one.setAttribute('id', `${reponce_search_friends.frind_friends[i]._id}`)
        chield_search_friends_one.textContent = `${reponce_search_friends.frind_friends[i].firstname_user} ${reponce_search_friends.frind_friends[i].lastname_user}`;

        const chield_search_friends_two = document.createElement('div');
        chield_search_friends_two.textContent = " En ligne";



        info_friends_speak_private_message_container_div.appendChild(chield_search_friends_one);
        info_friends_speak_private_message_container_div.appendChild(chield_search_friends_two);
        



        status_friends_speak_private_message_container_div.appendChild(info_friends_speak_private_message_container_div);


        list_seach_friends_speak_private_message_container_div.appendChild(status_friends_speak_private_message_container_div);

      }


      // reponce_search_friends.frind_friends[i].id_user
      // reponce_search_friends.frind_friends[i].mail_user
      // reponce_search_friends.frind_friends[i].firstname_user
      // reponce_search_friends.frind_friends[i].lastname_user
      // reponce_search_friends.frind_friends[i].avatar_user

      //   list_seach_friends_speak_private_message_container_div.appendChild(
      //     write(`<div id="status_friends_speak_private_message_container_div">
      //           <div id="img_user_container_div">
      //             <img name="img_personnage_authentification_img" id="img_personnage_authentification_img" src="/avatar_user/${reponce_search_friends.frind_friends[i].avatar_user}>" alt="" srcset="" />
      //             <span id="inline_friends_speak_private_message_container_div"></span>
      //           </div>
      //           <div id="info_friends_speak_private_message_container_div">
      //             <div>${reponce_search_friends.frind_friends[i].firstname_user} ${reponce_search_friends.frind_friends[i].lastname_user}</div>
      //             <div>En ligne</div>
      //           </div>
      //         </div>`));
    }
  }

  var oReq = new XMLHttpRequest();
  oReq.onload = reqListener;
  oReq.open("post", "/search_friends_ajax", true);
  oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  oReq.send(
    "form_type_view=" +
      form_type_view +
      "&" +
      "input_search_friends=" +
      input_search_friends
  );
}


//PRESS TOUCH INPUT ----------------------
bar_seach_friends_speak_private_message_container_inp.addEventListener(
  "keyup",
  function (evt) {
    evt.preventDefault();
    document.getElementById('list_seach_friends_speak_private_message_container_div').innerHTML = '';
    const input_seach_value =
      bar_seach_friends_speak_private_message_container_inp.value;
    const form_type_view =
      form_seach_friends_speak_private_message_container_fom.id;
    ajax_search_friends(form_type_view, input_seach_value);
  }
);
var element_status_friends;

//EVENEMENT SUR L AMI CLIQUÉ REPRENDRE LE HTML DE LA DIV
function status_friends(evt){
  var fiends_to_speak = evt;

  element_status_friends = list_friends_speak_private_message_container_div.appendChild(fiends_to_speak);
  element_status_friends.setAttribute('onclick','speack_with_him(this)');
  var quit_speak = document.createElement('span');
  quit_speak.setAttribute('class', "qui_speak");
  quit_speak.setAttribute('onclick',"quit_speak(this)")
  quit_speak.innerHTML = "X";
  element_status_friends.appendChild(quit_speak);
}

//GIVE ID AT CLICK 
function speack_with_him(evt){

    for(var i = 0; i<document.getElementsByClassName('status_friends_speak_private_message_container_div').length; i++){
        document.getElementsByClassName('status_friends_speak_private_message_container_div')[i].classList.remove("active");
    }

    evt.classList.add('active');

    id_speak_me = evt.childNodes[1].firstChild.id;

    window.localStorage.setItem('id_speak_me', id_speak_me);
}

//QUI THE DIV PARENT
function quit_speak(evt){
  evt.parentNode.remove();
}

//CLICK SUR INPUT
bar_seach_friends_speak_private_message_container_inp.addEventListener(
  "click",
  function (evt) {
    evt.preventDefault();
    if (click_bar_search_fiend) {
      click_bar_search_fiend = 0;
      list_seach_friends_speak_private_message_container_div.classList.remove(
        "show_list_friends"
      );
      list_seach_friends_speak_private_message_container_div.classList.add(
        "hide_list_friends"
      );
      bar_seach_friends_speak_private_message_container_inp.value = "";
      bar_seach_friends_speak_private_message_container_inp.blur();
      document.getElementById('list_seach_friends_speak_private_message_container_div').innerHTML = '';
    } else {
      list_seach_friends_speak_private_message_container_div.classList.remove(
        "hide_list_friends"
      );
      list_seach_friends_speak_private_message_container_div.classList.add(
        "show_list_friends"
      );
      click_bar_search_fiend = 1;
      bar_seach_friends_speak_private_message_container_inp.value = "";
      bar_seach_friends_speak_private_message_container_inp.focus();
      document.getElementById('list_seach_friends_speak_private_message_container_div').innerHTML = '';
    }
  }
);

//---------------------------------------

//SOCKET.IO
const button_discussion_private_user = document.getElementById('button_discussion_private_user');
const text_discussion_private_user = document.getElementById('text_discussion_private_user');

socket.on('old_messages', (old_message) => {
    console.log('old_message : ', old_message.old_messages[2])
    for(var i = 0; i<old_message.old_messages.length; i++){
        if(old_message.id_session_user === old_message.old_messages[i].id_sender){
            createElementFunction('old_messages_me', old_message.old_messages[i].message);
        }else{
            createElementFunction('old_messages', { id_sender: old_message.old_messages[i].id_sender, message: old_message.old_messages[i].message});
        }
    }
    
});


socket.on('new_message_friend', (newMessage) => {
    console.log('new_message_friend 233 : ',newMessage);
    createElementFunction("new_message_friend",newMessage);
});

//IF QUIT REMOVE THE recipient_user
socket.on('quit_user', (localstorageremove) =>{
    console.log('QUIT QUIT REMOVE STORE 239 ',localstorageremove);
})

//AU CLIQUE ENVOYÉ MESSAGE
button_discussion_private_user.addEventListener('click', function(evt){
    evt.preventDefault()

    //VAR SEND AT...
    var recipient_user = window.localStorage.getItem('id_speak_me');

    if(recipient_user){
        //SEND MESSAGE PRIVATE 251
        socket.emit("new_message_user", text_discussion_private_user.value, recipient_user);
        console.log('MESSAGE ENVOYÉ');
        //DISPLAY ME MESSAGE 253
        createElementFunction("new_message_me", text_discussion_private_user.value);
    }
        

    text_discussion_private_user.value = '';
    text_discussion_private_user.focus();
});

function createElementFunction(element, content){
    console.log('ELEMENTD ', element)
    console.log('CONTENT', content)
    const newElement = document.createElement('div');
    switch(element){
        case 'new_message_me':
            newElement.classList.add(element, 'message_send');
            newElement.textContent = `Moi : ${content}`;
            document.getElementById('message_discussion_private_message_container_div').appendChild(newElement);
        break
        case 'old_messages_me':
            console.log('ME MESSAGES');
            newElement.classList.add(element, 'message_send');
            newElement.textContent = `Moi : ${content}`;
            document.getElementById('message_discussion_private_message_container_div').appendChild(newElement);
        break
        case 'old_messages':
            console.log('ME MESSAGES', content);
            newElement.classList.add(element, 'message_send');
            newElement.textContent = `${content.id_sender} : ${content.message}`;
            document.getElementById('message_discussion_private_message_container_div').appendChild(newElement);
        break
        case 'new_message_friend':
            newElement.classList.add(element, 'message_send');
            newElement.textContent = ` ${content}`;
            document.getElementById('message_discussion_private_message_container_div').appendChild(newElement);
        break
    }
}

