if (localStorage.getItem('username'))
    window.location.replace(location.protocol + '//' + document.domain + ':' + location.port + '/chat');

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#sub').onclick = () => {
        let input = document.querySelector('#inp').value;
        if(input.length > 0) {
            localStorage.setItem('username', input);
            window.location = location.protocol + '//' + document.domain + ':' + location.port + '/chat';
        }
    };
});