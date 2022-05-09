let selectedSpaceID = undefined;
let selectedCarpark = undefined;

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
        //calls function to get all the free spaces in that car park
        selectedCarpark = carparkSelector.value;
        getCarparkSpaces(carparkSelector.value);
    }
    else {
        document.getElementById('blockSpaceForm').innerHTML = "~ apparently there are no car parks available :( ~";
    }
}

async function getCarparkSpaces(carpark) {

    try {
        const carparkSpacesContainer = document.getElementById('carparkContainer');
        carparkSpacesContainer.remove();
    }

    catch {
    }

    const spacesAvailability =  await fetch(`/view-carpark/manageSpaces?carpark=${carpark}`)
    const spaces = await spacesAvailability.json();

    numberOfROws = Math.ceil(spaces.length / 12);

    const carparkSpacesContainer =  document.createElement('div');
    carparkSpacesContainer.setAttribute('id',`carparkContainer`);

    const selectorContainer = document.querySelector('#carpark-container');
    selectorContainer.appendChild(carparkSpacesContainer);


    for(let i = 0; i < numberOfROws; i++) {
        const carparkRow =  document.createElement('div');
        carparkRow.classList.add('carparkRow');
        carparkRow.setAttribute('id',`row_${i}`);
        carparkSpacesContainer.appendChild(carparkRow);
    }

    let addSpaceToRow = 0;
    for (let i = 0; i < spaces.length; i++) {
        if(i % 12 == 0 && i != 0) {
            addSpaceToRow++;
        }
        const carparkSpace =  document.createElement('div');
        carparkSpace.setAttribute('id',`space_${spaces[i].ID}`);
        carparkSpace.classList.add('space');
        carparkSpace.innerHTML = spaces[i].ID;

        if (!spaces[i].available) {

            if(spaces[i].occupier == 'Blocked By Admin') {
                carparkSpace.classList.add('adminBlock');
            }
            else {
                carparkSpace.classList.add('driverBlock');
            }
        }

        const rowToAddSpace = document.getElementById(`row_${addSpaceToRow}`);
        rowToAddSpace.appendChild(carparkSpace);
    }

    const response =  await fetch(`/view-carpark/carpark-stats?carpark=${carpark}`)
    const carparkStats = await response.json();

    const totalSpaces = document.querySelector('#total-stat');
    const freeSpaces = document.querySelector('#freespaces-stat');

    totalSpaces.innerHTML = carparkStats.total;
    freeSpaces.innerHTML = carparkStats.freespaces;

}

function changeCarPark(event) {
    event.preventDefault();

    const carparkSelector = document.querySelector('#carpark');
    selectedCarpark = carparkSelector.value;
    getCarparkSpaces(carparkSelector.value);

}

function getSelectedSpace(event) {

    const blockBtn = document.querySelector('#blockSpace');
    const freeBtn = document.querySelector('#freeSpace');

    try {
        const selectedSpace = document.querySelector('.selected');
        selectedSpace.classList.toggle('selected');

        selectedSpaceID = undefined;

        blockBtn.disabled = true;
        freeBtn.disabled = true;
    }
    catch {
    }

    if (event.target.classList.contains('space')) {

        event.target.classList.toggle('selected');

        let selectedSpace = event.target.id;
        selectedSpace = selectedSpace.split("_");

        selectedSpaceID = parseInt(selectedSpace[1]);

        console.log(selectedCarpark);
        console.log(selectedSpaceID);

        if(event.target.classList.contains('adminBlock') || event.target.classList.contains('driverBlock')) {
            freeBtn.disabled = false;
        }
        else {
            blockBtn.disabled = false;
        }

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

    updateSpace(selectedCarpark, selectedSpaceID, false, "Blocked By Admin");
    getCarparkSpaces(selectedCarpark);
}

function unblockSpace(event) {
    event.preventDefault();
    updateSpace(selectedCarpark, selectedSpaceID, true, null);
    getCarparkSpaces(selectedCarpark);
}

document.addEventListener('DOMContentLoaded', getCarparks);
document.addEventListener('click', getSelectedSpace);

const carparkSelector = document.querySelector('#carpark');
carparkSelector.addEventListener('change', changeCarPark);


const blockBtn = document.querySelector('#blockSpace');
blockBtn.addEventListener('click', blockSpace);

const freeBtns = document.querySelector('#freeSpace');
freeBtns.addEventListener('click', unblockSpace);


