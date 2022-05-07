//function runs whenever a form is submitted sends it to server to check if the email and password are correct
async function loginAttempt(event) {
    event.preventDefault();

    //selects the form element from form.hmtl
    const formData = document.querySelector('#loginForm');

    //create a new object that stores email and password
    const loginCreds = {
        email: formData.elements.namedItem('email').value,
        password: formData.elements.namedItem('password').value,
    };

    // turns loginCreds object into JSON string
    const serializedMessage = JSON.stringify(loginCreds);

    // posts JSON string to the server at the end point /login
    const response = await fetch('/login', { method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                    }
                )

    const json = await response.json();


    if (response.status === 200) {
        window.location.href = "/";
        sessionStorage.setItem('id', json.id);
        sessionStorage.setItem('email', json.email);
        sessionStorage.setItem('name', json.name);
        sessionStorage.setItem('registration', json.registration);
        sessionStorage.setItem('userType', json.userType);
        sessionStorage.setItem('wallet', json.wallet);

        if(sessionStorage.getItem('userType').toLowerCase() === 'admin') {
            window.location.href = "/admin";
        }
        else {
            window.location.href = "/index";
        }
    }
    else {
        const incorrectDetails = document.createElement('p');
        incorrectDetails.innerText = json;
        document.getElementById('loginContainer').appendChild(incorrectDetails);

        document.getElementById('password').value = ''; 
    }

}

//Selects form element from form.html and adds a loginAttempt event listener

const form = document.querySelector('#loginForm');
form.addEventListener('submit', loginAttempt);
