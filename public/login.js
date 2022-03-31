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
    await fetch('/login', { method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                    }
                )
                .then(onResponse, onError)
                .then(onJsonReady);


    //clears the html form
    formData.reset();

}

const onJsonReady = (json) => {
    console.log(json.email);
    const text = JSON.stringify(json);
}

//if prmomise is fulfilled onResponse is invoked and returns json string
const onResponse = (response) => {
    return response.json()
}

//logs error if promise is rejected
const onError = (error) => {
    console.log('Error: ${error}')
}


//Selects form element from form.html and adds a loginAttempt event listener

const form = document.querySelector('#loginForm');
form.addEventListener('submit', loginAttempt);

