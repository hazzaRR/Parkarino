//fetches all the carparks in the database and adds them to the select box for the driver to pick from
async function getCarparks() {
    const allCarparks_res = await fetch('/view-carpark/all-carparks');
    const carparks_json = await allCarparks_res.json();

    carparks_str = carparks_json.replace(/[^a-zA-Z, ]/g, ""); // strip all specials except comma,spaces
    const options = carparks_str.split(",");
    
    if (allCarparks_res.status == 200)
    {
        const carparkSelector = document.querySelector('#carpark');
        options.forEach(item => addOptions(item, carparkSelector)); // add new select option for each car park
        getSpaces(); //calls function to get all the free spaces in that car park
    }
    else {
        document.getElementById('blockSpaceForm').innerHTML = "~ apparently there are no car parks available :( ~";
    }
}

async function getSpaces() {
    
    const formData = document.querySelector('#blockSpaceForm');
    const spaceSelector = document.querySelector('#parkingSpace');

    const selectedCarPark = formData.elements.namedItem('carpark').value;

    console.log(`/view-carpark/spaces?carpark=${selectedCarPark}`);

    const response = await fetch(`/view-carpark/spaces?carpark=${selectedCarPark}`);
    const spaces_json = await response.json();

    spaces_str = spaces_json.replace(/[^a-zA-Z0-9, ]/g, ""); // strip all specials except comma,spaces
    const options = spaces_str.split(",");

    if (response.status == 200)
    {
        removeOptions(spaceSelector); // remove current selection of spaces for select box
        options.forEach(item => addOptions(item, spaceSelector)); // add new select option for each car park
    }
    else {
        document.getElementById('parkingSpace').innerHTML = "~ apparently there are no spaces available :( ~";
    }

}

//removes all current options for the passed select box
function removeOptions(selector) {
    while (selector.options.length > 0) {                
        selector.remove(0);
    }        
}

//adds the carpark options to the select tag 
function addOptions(item, selector)
{
    const option = document.createElement("option");
    option.value = item;
    option.text = item;
    selector.add(option);
}

async function getOccupiedSpaces() {

    const occupiedSpacesList = document.querySelector('.OccupiedSpaces-list');
    occupiedSpacesList.innerHTML = "";

    // gets all driver requests from the server that have not been managed and stores them in an array called requests
    const response = await fetch('/view-carpark/occupiedSpaces');
    const blockedSpaces = await response.json();

    //iterate over requests, making divs requests
    blockedSpaces.forEach(space => {

        const parkingSpaceDiv = document.createElement('div');
        parkingSpaceDiv.classList.add('occupiedSpace');
        const spaceDetails = document.createElement('ul');
        parkingSpaceDiv.appendChild(spaceDetails);

        const carparkName = document.createElement('li');
        carparkName.innerText = "Car park: " + space.carparkName;
        carparkName.classList.add('occupiedSpace-item');
        spaceDetails.appendChild(carparkName);

        const parkingSpaceID = document.createElement('li');
        parkingSpaceID.innerText = "parking Space Number: " + space.parkingSpaceID;
        parkingSpaceID.classList.add('occupiedSpace-item');
        spaceDetails.appendChild(parkingSpaceID);

        const occupiedBy = document.createElement('li');
        occupiedBy.innerText = "Occupied by: " + space.occupiedBy;
        occupiedBy.classList.add('occupiedSpace-item');
        spaceDetails.appendChild(occupiedBy);
        
        //accept button
        const unblockSpaceButton = document.createElement('button');
        unblockSpaceButton.innerHTML = 'Free Space';
        unblockSpaceButton.classList.add("unblockSpace-button")
        parkingSpaceDiv.appendChild(unblockSpaceButton);

        //decline button

        //append to list

        occupiedSpacesList.appendChild(parkingSpaceDiv);

    })

}

async function updateSpace(carParkValue, spaceValue, availableValue, occupierValue) {

    const spaceDetails = {
        carpark : carParkValue,
        parkingSpaceID: spaceValue,
        available: availableValue,
        occupier: occupierValue
    };

    // turns spaceDetails object into JSON string
    const serializedMessage = JSON.stringify(spaceDetails);

    // posts JSON string to the server at the end point /admin/updateSpace
    const response = await fetch('/admin/updateSpace', { method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                    }
                )

                
            
    const json = await response.json();

    console.log(response.status);

}



function blockSpace(event) {
    event.preventDefault();
    const carParkValue = document.querySelector('#carpark');
    const spaceValue = document.querySelector('#parkingSpace');

    updateSpace(carParkValue.value, spaceValue.value, false, "Blocked By Admin");

    getOccupiedSpaces();
    getSpaces();
}

function unblockSpace(event) {
    console.log(event.srcElement.classList[0]);
    event.preventDefault();

    if(event.srcElement.classList[0] == "unblockSpace-button") {
        const space = event.target.parentElement;

        const carParkValue = space.childNodes[0].childNodes[0].innerText;
        const spaceValue = space.childNodes[0].childNodes[1].innerText;

        console.log(carParkValue.substr(10));
        console.log(spaceValue.substr(-1));

        updateSpace(carParkValue.substr(10), spaceValue.substr(-1), true, null);
        space.remove();
        getSpaces();
    }
}

document.addEventListener('DOMContentLoaded', getCarparks);
document.addEventListener('DOMContentLoaded', getOccupiedSpaces);

const carparkSelector = document.querySelector('#carpark');
carparkSelector.addEventListener('change', getSpaces);


const blockBtn = document.querySelector('#block');
blockBtn.addEventListener('click', blockSpace);

const unblockBtns = document.querySelector('.OccupiedSpaces-list');
unblockBtns.addEventListener('click', unblockSpace);

//const form = document.querySelector('#blockSpaceForm');
//form.addEventListener('submit', blockSpace);