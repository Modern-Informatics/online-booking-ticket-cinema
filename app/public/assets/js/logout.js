var logout_button = document.getElementById('logout-button')

logout_button.addEventListener('click',() => logout());

function logout() {
    localStorage.setItem('token', "");
    localStorage.setItem('email', "");
    localStorage.setItem('state', "logged-out");
    localStorage.setItem('role', "");

    window.location = "http://[::1]:3333/";
}