const socket = io();

const button_discussion_private_user = document.getElementById('button_discussion_private_user');
const text_discussion_private_user = document.getElementById('text_discussion_private_user');


button_discussion_private_user.addEventListener('click', function(evt){
    evt.preventDefault()
    console.log('MESSAGE :', text_discussion_private_user.value );
    socket.emit("message_user", text_discussion_private_user.value );
    console.log('MESSAGE SEND !');
});