// redirect to home if not logged in
if (!localStorage.getItem('username'))
    window.location.replace(location.protocol + '//' + document.domain + ':' + location.port);

document.addEventListener('DOMContentLoaded', () => {
    
    // Make sidebar collapse on click
    document.querySelector('#show-sidebar-button').onclick = () => {
        document.querySelector('#sidebar').classList.toggle('view-sidebar');
    };
    
    // Make 'enter' key submit message
    let msg = document.getElementById("user_message");
    msg.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("send_message").click();
        }
    });

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    const username = localStorage.getItem('username')
    var cur_room = '';

    // Set default room
    if (!localStorage.getItem('defroom'))
    	localStorage.setItem('defroom', 'General')
    joinRoom(localStorage.getItem('defroom'));

    document.querySelector("#user_message").placeholder = "Type here " + localStorage.getItem('username');

    // Select a room
    document.querySelectorAll('.select-room').forEach(p => {
        p.onclick = () => {
            let newRoom = p.innerHTML
            joinRoom(newRoom);
        };
    });

    // Send messages
    document.querySelector('#send_message').onclick = () => {
        socket.emit('incoming_msg', {'msg': document.querySelector('#user_message').value,
            'username': username, 'room': cur_room});

        document.querySelector('#user_message').value = '';
    };

    // populate current room with previous messages
    socket.on("cur_messages", msgs => {
    	msgs.forEach(data => {
    		// Display current message
        if (localStorage.getItem('defroom') == data["room"]) {
        if (data.msg) {
            const p = document.createElement('p');
            const span_username = document.createElement('span');
            const span_timestamp = document.createElement('span');
            const br = document.createElement('br')
            // Display user's own message
            if (data.username == username) {
                    p.setAttribute("class", "my-msg");

                    // Username
                    span_username.setAttribute("class", "my-username");
                    span_username.innerText = data.username;

                    // Timestamp
                    span_timestamp.setAttribute("class", "timestamp");
                    span_timestamp.innerText = data.time_stamp;

                    // HTML to append
                    p.innerHTML += span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML

                    //Append
                    document.querySelector('#display-message-section').append(p);
            }
            // Display other users' messages
            else if (typeof data.username !== 'undefined') {
                p.setAttribute("class", "others-msg");

                // Username
                span_username.setAttribute("class", "other-username");
                span_username.innerText = data.username;

                // Timestamp
                span_timestamp.setAttribute("class", "timestamp");
                span_timestamp.innerText = data.time_stamp;

                // HTML to append
                p.innerHTML += span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML;

                //Append
                document.querySelector('#display-message-section').append(p);
            }
        }
        scrollDownChatWindow(); }
    	});
    })

    // Display all incoming messages
    socket.on('message', data => {

        // Display current message
      if (localStorage.getItem('defroom') == data["room"]) {
        if (data.msg) {
            const p = document.createElement('p');
            const span_username = document.createElement('span');
            const span_timestamp = document.createElement('span');
            const br = document.createElement('br')
            // Display user's own message
            if (data.username == username) {
                    p.setAttribute("class", "my-msg");

                    // Username
                    span_username.setAttribute("class", "my-username");
                    span_username.innerText = data.username;

                    // Timestamp
                    span_timestamp.setAttribute("class", "timestamp");
                    span_timestamp.innerText = data.time_stamp;

                    // HTML to append
                    p.innerHTML += span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML

                    //Append
                    document.querySelector('#display-message-section').append(p);
            }
            // Display other users' messages
            else if (typeof data.username !== 'undefined') {
                p.setAttribute("class", "others-msg");

                // Username
                span_username.setAttribute("class", "other-username");
                span_username.innerText = data.username;

                // Timestamp
                span_timestamp.setAttribute("class", "timestamp");
                span_timestamp.innerText = data.time_stamp;

                // HTML to append
                p.innerHTML += span_username.outerHTML + br.outerHTML + data.msg + br.outerHTML + span_timestamp.outerHTML;

                //Append
                document.querySelector('#display-message-section').append(p);
            }
        }
        scrollDownChatWindow(); }
    });

    // create a new room
    document.querySelector('#new_room').onclick = () => {

        // Initialize new request
        const room_name = prompt("Enter Room Name:");
        if(!room_name) return;
        const request = new XMLHttpRequest();
        request.open('POST', '/cnroom');

        // Add data to send with request
        const data = new FormData();
        data.append('room_name', room_name);


        // Send request
        request.send(data);
        localStorage.setItem('defroom', capitalizeFirstLetter(room_name))
        window.location = location.protocol + '//' + document.domain + ':' + location.port + '/chat';
        // socket.emit('new_room', {'room_name': room_name, 'username': username});
    };



    // Scroll chat window down
    function scrollDownChatWindow() {
        const chatWindow = document.querySelector("#display-message-section");
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Trigger 'join' event
    function joinRoom(room) {

    	localStorage.setItem('defroom', room)

        // Highlight selected room
        document.querySelectorAll('.select-room').forEach(p => {
            p.style.color = "black";
        });
        document.querySelector('#' + CSS.escape(room)).style.color = "#ffc107";
        document.querySelector('#' + CSS.escape(room)).style.backgroundColor = "white";

        // Clear message area
        document.querySelector('#display-message-section').innerHTML = '';

        // Autofocus on text box
        document.querySelector("#user_message").focus();

        cur_room = room;
        socket.emit('room_joined', {'room': cur_room});
    }

    function capitalizeFirstLetter(string) {
    	return string.charAt(0).toUpperCase() + string.slice(1);
	}

	// function populate(data) {

	// }
});