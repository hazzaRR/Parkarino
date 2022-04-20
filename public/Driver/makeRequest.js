//function runs whenever a form is submitted sends it to server to create a new parking request
async function makeRequest(event) {
    event.preventDefault();

    //selects the form element from makeRequest.hmtl
    const formData = document.querySelector('#requestForm');
    console.log(sessionStorage.getItem('id'));

    //create a new request object
    const parkingRequest = {
        id: null,
        driverId: sessionStorage.getItem('id'),
        registration: sessionStorage.getItem('registration'),
        location: formData.elements.namedItem('location').value,
        arrivalDate: formData.elements.namedItem('arrivalDate').value,
        arrivalTime: formData.elements.namedItem('arrivalTime').value,
        departureDate: formData.elements.namedItem('departureDate').value,
        departureTime: formData.elements.namedItem('departureTime').value,
        approved: null
    };

    // turns loginCreds object into JSON string
    const serializedMessage = JSON.stringify(parkingRequest);

    // posts JSON string to the server at the end point /request
    const response = await fetch('/request', { method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                    }
                )

    const json = await response.json();

    console.log(json);

}

//Selects form element from form.html and adds a loginAttempt event listener

const form = document.querySelector('#requestForm');
form.addEventListener('submit', makeRequest);


