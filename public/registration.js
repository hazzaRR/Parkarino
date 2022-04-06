async function register(event) {

    event.preventDefault();
    const getForm = document.querySelector('#regForm');

    const registrat = {
        _id: 0,
        email: getForm.elements.namedItem('email').value,
        name: getForm.elements.namedItem('Name').value,
        username: getForm.elements.namedItem('Username').value,
        registration: getForm.elements.namedItem('Registration').value,
        street: getForm.elements.namedItem('Street').value,
        city:getForm.elements.namedItem('City').value,
        postcode: getForm.elements.namedItem('Postcode').value,
        userType: "Driver",
        password: getForm.elements.namedItem('password').value,
    };

    // turns loginCreds object into JSON string
    const serializedMessage = JSON.stringify(registrat);
    // posts JSON string to the server at the end point /login
    const response = await fetch('/register', { method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: serializedMessage
        }
    )

    if (response.status === 200) {
        console.log("Email got saved");
    }
    else {
        document.getElementById('test').innerHTML = "Email or username already exists!";
    }
}

const form = document.querySelector('#regForm');
form.addEventListener('submit', register);