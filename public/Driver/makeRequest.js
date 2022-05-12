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
        arrivalTime: formData.elements.namedItem('arrivalTime').value,
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

    alert("Request has successfully been made");
    form.reset();


}

//fetches all the carparks in the database and adds them to the select box for the driver to pick from
async function getCarparks() {
    const allCarparks_res = await fetch('/view-carpark/all-carparks');
    const carparks_json = await allCarparks_res.json();

    carparks_str = carparks_json.replace(/[^a-zA-Z, ]/g, ""); // strip all specials except comma,spaces
    const options = carparks_str.split(",");
    //console.log(carparks_str);
    
    if (allCarparks_res.status == 200)
    {
        options.forEach(item => addOptions(item)); // add new select option for each car park
    }
    else {
        document.getElementById('requestForm').innerHTML = "~ apparently there are no car parks available :( ~";
    }
}

//adds the carpark options to the select tag 
function addOptions(item)
{
    const ops = document.getElementById("location");
    const option = document.createElement("option");
    option.text = item;
    ops.add(option);
}

document.addEventListener('DOMContentLoaded', getCarparks);


function getMaxDepartureDate() {

    //get the  date value stored in the arrival time ipnput
    const formData = document.querySelector('#requestForm');
    const arrivalDateValue = formData.elements.namedItem('arrivalTime').value;

    //make the arrival date value into a date object and create a date object
    //add 10 days onto that date object to get the max stay date
    let maxStay = new Date(arrivalDateValue);
    maxStay.setDate(maxStay.getDate() + 10);
    

    //put a constraint on the departure date input of a min date of the arrival date and max date of 10 days later
    const DepartureTimeInput = document.querySelector('#departureTime');
    DepartureTimeInput.setAttribute("min", arrivalDateValue);
    DepartureTimeInput.setAttribute("max", maxStay.toISOString().slice(0, 16));
}

//Selects form element from form.html and adds a loginAttempt event listener

const form = document.querySelector('#requestForm');
form.addEventListener('submit', makeRequest);


//everytime a new date is selected in the arrival input the getMaxDepartureDate is called
const arrivalTimeInput = document.querySelector('#arrivalTime');
arrivalTimeInput.addEventListener('change', getMaxDepartureDate);

//sets the minimum date picked by the users to today
arrivalTimeInput.setAttribute("min", new Date().toISOString().slice(0, 16));




