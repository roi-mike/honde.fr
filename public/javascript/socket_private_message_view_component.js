const socket = io();

const button_discussion_private_user = document.getElementById('button_discussion_private_user');
const text_discussion_private_user = document.getElementById('text_discussion_private_user');

socket.on('newMessage', (newMessage) => {
    console.log('newMessage : ',newMessage);
    createElementFunction("newMessage",newMessage);
});


button_discussion_private_user.addEventListener('click', function(evt){
    evt.preventDefault()
    socket.emit("new_message_user", text_discussion_private_user.value );
    createElementFunction("new_message_user", text_discussion_private_user.value)
    console.log('ENVOYE');
});

function createElementFunction(element, content){
    const firstname_user = "Samuel";
    const newElement = document.createElement('div');

    switch(element){
        case 'new_message_user':
            newElement.classList.add(element, 'message_send');
            newElement.textContent = firstname_user+" : "+content;
            document.getElementById('message_discussion_private_message_container_div').appendChild(newElement);
            text_discussion_private_user.value = '';
            text_discussion_private_user.focus();
    }
}

