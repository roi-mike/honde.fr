const socket = io();

const button_discussion_private_user = document.getElementById('button_discussion_private_user');
const text_discussion_private_user = document.getElementById('text_discussion_private_user');

socket.on('old_messages', old_message => {
    if(old_message.id_session_user === old_message.old_messages[0].id_sender){
        old_message.old_messages.forEach(old_message_user => {
            createElementFunction('old_messages_me', old_message_user.message);
        });
    }else{
        createElementFunction('old_messages', old_message.old_messages[0].message);
    }
});


socket.on('new_message_friend', (newMessage) => {
    console.log('new_message_friend : ',newMessage);
    createElementFunction("new_message_friend",newMessage);
});


button_discussion_private_user.addEventListener('click', function(evt){
    evt.preventDefault()

    socket.emit("new_message_user", text_discussion_private_user.value );
    
    createElementFunction("new_message_me", text_discussion_private_user.value);

    text_discussion_private_user.value = '';
    text_discussion_private_user.focus();
});

function createElementFunction(element, content){
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
        case 'new_message_friend':
            newElement.classList.add(element, 'message_send');
            newElement.textContent = `${content.send_by} : ${content.message_user}`;
            document.getElementById('message_discussion_private_message_container_div').appendChild(newElement);
        break
    }
}

