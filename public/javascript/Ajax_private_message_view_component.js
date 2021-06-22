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

let click_bar_search_fiend = false;

//AJAX SEARCH FRIENDS --------------------

function ajax_search_friends(form_type_view, input_search_friends) {
  function reqListener() {

    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      var reponce_search_friends = JSON.parse(this.response);

      console.log(' rep : ', reponce_search_friends.frind_friends);

      for (var i = 0; i < reponce_search_friends.frind_friends.length; i++) {
          //CRATION LISTE FRIENDS
          var status_friends_speak_private_message_container_div =
            document.createElement("div");

        status_friends_speak_private_message_container_div.setAttribute(
          "class",
          "status_friends_speak_private_message_container_div"
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
      console.log("AFFICHE =", click_bar_search_fiend);
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
      console.log("CACHÉ =", click_bar_search_fiend);
    }
  }
);
