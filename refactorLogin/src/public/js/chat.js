const socket = io();

let currentUser = '';  // Almacena el nickname del usuario actual

socket.on('newMessage', function (data) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.user}: ${data.message}`;
    document.getElementById('messages').appendChild(messageElement);
});

function sendMessage() {
    const message = document.getElementById('message').value;
    if (message && currentUser) {
        socket.emit('sendMessage', { user: currentUser, message });
        document.getElementById('message').value = '';
    } else {
        alert('Por favor, ingresa un mensaje.');
    }
}

function joinChat() {
    const nickname = document.getElementById('nickname').value;
    if (nickname) {
        currentUser = nickname;  // Asigna el nickname a la variable
        document.getElementById('login').style.display = 'none';
        document.getElementById('chatRoom').style.display = 'block';
    } else {
        alert('Ingresa un nickname para ingresar al chat.');
    }
}
