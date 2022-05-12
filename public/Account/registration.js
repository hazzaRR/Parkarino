async function register(event) {

    event.preventDefault();
    const getForm = document.querySelector('#regForm');

    const registrat = {
        _id: 0,
        email: getForm.elements.namedItem('email').value,
        username: getForm.elements.namedItem('Username').value,
        name: getForm.elements.namedItem('Name').value,
        password: getForm.elements.namedItem('password').value,
        registration: getForm.elements.namedItem('Registration').value,
        street: getForm.elements.namedItem('Street').value,
        city:getForm.elements.namedItem('City').value,
        postcode: getForm.elements.namedItem('Postcode').value,
        user_Type: "Driver",
        wallet:500,
    };

    const serializedMessage = JSON.stringify(registrat);
    const response = await fetch('/register', { method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: serializedMessage
        }
    );

    const json = await response.json();

    if (response.status === 200) {
        console.log(json);
        window.location.href = "/login";
    }
    if (response.status === 500) {
        incorrectDetails = document.getElementById('exist');
        incorrectDetails.innerText = json;
        document.getElementById('regContainer').appendChild(incorrectDetails);
        document.getElementById('email').value = '';
    }
    else {
        incorrectDetails = document.getElementById('exist');
        incorrectDetails.innerText = json;
        document.getElementById('regContainer').appendChild(incorrectDetails);
        document.getElementById('email').value = '';
        document.getElementById('Username').value = '';
    }

}
let incorrectDetails;
const form = document.querySelector('#regForm');
form.addEventListener('submit', register);