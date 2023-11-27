const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container_signup_signin');

async function signUp(email, name, password) {
    try {
        const response = await fetch('http://[::1]:3333/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "name": name,
                "password": password,
                "role": "USER"
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Sign Up error:', error);
        return false;
    }
}

async function signIn(email, password) {
    try {
        const response = await fetch('http://[::1]:3333/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            }),
        });

        const result = await response.json();

        if (response.ok) {
            localStorage.setItem('token', result.result.token);
            localStorage.setItem('email', email);
            localStorage.setItem('state', "logged-in");
            localStorage.setItem('role', parseJwt(result.result.token).role);
        } else {
            alert(result.message);
        }
		window.location = "http://[::1]:3333/index.html";

    } catch (error) {
        console.error('Sign In error:', error);
    }
}

async function signUpValidateForm() {
    const name = document.getElementById("sign_up_name").value;
    const email = document.getElementById("sign_up_email").value;
    const password = document.getElementById("sign_up_password").value;

    if (!name || !email || !password) {
        asAlertMsg({
            type: "error",
            title: "Empty Field",
            message: "Name, Email, and Password are required.",
            button: {
                title: "Close Button",
                bg: "Cancel Button"
            }
        });
        return;
    }

    const signUpSuccess = await signUp(email, name, password);

    if (signUpSuccess) {
        // Perform sign-in after successful sign-up
        await signIn(email, password);
    }
}

async function signInValidateForm() {
    const email = document.getElementById("sign_in_email").value;
    const password = document.getElementById("sign_in_password").value;

    if (!email || !password) {
        asAlertMsg({
            type: "error",
            title: "Empty Field",
            message: "Name, Email, and Password are required.",
            button: {
                title: "Close Button",
                bg: "Cancel Button"
            }
        });
        return;
    }

    await signIn(email, password); 
}

signUpButton.addEventListener('click', function() {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', function() {
    container.classList.remove("right-panel-active");
    console.log("Button clicked!");
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}