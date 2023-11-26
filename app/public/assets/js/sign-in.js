const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container_signup_signin');

async function signUpValidateForm() {
	var name = document.forms["sign-up-form"]["sign-up-name"].value;
	if (name == "") {
		//   alert("'Name' can not be empty!!");
		asAlertMsg({
			type: "error",
			title: "Empty Field",
			message: "'Name' can not be empty!!",

			button: {
				title: "Close Button",
				bg: "Cancel Button"
			}
		});
		return false;
	}
	email = document.forms["sign-up-form"]["sign-up-email"].value;
	if (email == "") {
		//   alert("'Email' can not be empty!!");
		asAlertMsg({
			type: "error",
			title: "Empty Field",
			message: "'E-mail' can not be empty!!",

			button: {
				title: "Close Button",
				bg: "Cancel Button"
			}
		});
		return false;
	}
	password = document.forms["sign-up-form"]["sign-up-passwd"].value;
	if (password == "") {
		//   alert("'Password' can not be empty!!");
		asAlertMsg({
			type: "error",
			title: "Empty Field",
			message: "'Password' can not be empty!!",

			button: {
				title: "Close Button",
				bg: "Cancel Button"
			}
		});
		return false;
	}
	
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
	} catch (error) {
		console.error('Fetch error:', error);
	}

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

		console.log(parseJwt(result.result.token))

		if (response.ok) {
			localStorage.setItem('token', result.result.token);
			localStorage.setItem('email', email);
			localStorage.setItem('state', "logged-in");
			localStorage.setItem('role', parseJwt(result.result.token).role)
			window.location = "http://[::1]:3333/";
		} else {
			alert(result.message);
		}
	} catch (error) {
		console.error('Fetch error:', error);
	}
}

async function signInValidateForm() {

	email = document.forms["sign-in-form"]["sign-in-email"].value;
	if (email == "") {
		//   alert("'Email' can not be empty!!");
		asAlertMsg({
			type: "error",
			title: "Empty Field",
			message: "'E-mail' can not be empty!!",

			button: {
				title: "Close Button",
				bg: "Cancel Button"
			}
		});
		return false;
	}
	password = document.forms["sign-in-form"]["sign-in-passwd"].value;
	if (password == "") {
		//   alert("'Password' can not be empty!!");
		asAlertMsg({
			type: "error",
			title: "Empty Field",
			message: "'Password' can not be empty!!",

			button: {
				title: "Close Button",
				bg: "Cancel Button"
			}
		});
		return false;
	}

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

		console.log(parseJwt(result.result.token))

		if (response.ok) {
			localStorage.setItem('token', result.result.token);
			localStorage.setItem('email', email);
			localStorage.setItem('state', "logged-in");
			localStorage.setItem('role', parseJwt(result.result.token).role)
			window.location = "http://[::1]:3333/";
		} else {
			alert(result.message);
		}
	} catch (error) {
		console.error('Fetch error:', error);
	}
	
}

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}