# Project 2 (Ping me up!)

Web Programming with Python and JavaScript

When the user first visits the site they are presented with a page to enter their username and this can't be changed in future (uses localStorage in the background) as there is no logout button on the chat page.

When the server starts only one channel i.e., General is available but more can be created. Whole list is on the left side of the screen and messages are on the right with input box at bottom.

Pages are somewhat responsive and look pretty good on small screens too. When a new message appears there is a slight animation played (not instant.. like a transition).


There is no general template html file from which other files are extending. Login page is handled by login.html, login.js & login.css. Similarly for chat page. Lastly application.py has appropriate routes and socketio buckets.