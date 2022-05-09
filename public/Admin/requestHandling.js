
//selectors
const requestsList = document.querySelector('.requests-list');
const selectorContainer = document.getElementById('spacePickerContainer');
//event listeners

document.addEventListener('DOMContentLoaded', getRequests);
requestsList.addEventListener('click', adminSelection);
document.addEventListener('click', getSelectedSpace);


let selectedRequest;
let ticketToCreate;



async function adminSelection(event) {

    //gets the requestObject that was just clicked on
    const item = event.target;
    const request = item.parentElement;

    //if the accept or decline button was selected, the  request id is fetched from the request object
    if (item.classList[0] == "accept-button") {


        let approved;

        let requestId = request.childNodes[0].childNodes[0].innerText;

        requestId = requestId.split(" ");
        requestId = requestId[1];

        //gets request details for the provided request id
        const response = await fetch(`/admin/getRequest?requestId=${requestId}`)
        const requestDetails = await response.json()

        //need to add manual functionality. Currently can only autoAssign a space
        const autoOrManual = confirm("Would you like to manually select a space? \nPress OK for Manual Selection or Cancel for Auto Assign")
        
        if (autoOrManual) {
            selectedRequest = {
                requestId: parseInt(requestId),
                approved: true

            }

            ticketToCreate = {
                ticketId: null,
                driverId: requestDetails.driverId,
                arrivalTime: requestDetails.arrivalTime,
                departureTime: requestDetails.departureTime,
                carPark: requestDetails.location,
                parkingSpace: null,
                chargePrice: calculateParkingCharge(requestDetails.arrivalTime, requestDetails.departureTime)
            };

            await getCarparks();
            //getCarparkSpaces(requestDetails.location, requestDetails.arrivalTime, requestDetails.departureTime);

            // const spacesAvailability =  await fetch(`/view-carpark/FreeSpaces?carpark=${ticketRequest.location}&aTime=${ticketRequest.arrivalTime}&dTime=${ticketRequest.departureTime}`)
            // const spaces = await spacesAvailability.json()
        }
        else {

            //finds a free space in the carpark to assign to the ticket
            
            const autoAssignResponse = await fetch(`/admin/autoAssignSpace?carpark=${requestDetails.location}&aTime=${requestDetails.arrivalTime}&dTime=${requestDetails.departureTime}`)
            const parkingSpaceDetails = await autoAssignResponse.json()


            if(parkingSpaceDetails == null) {
                approved = false;
            }
            else {

                approved = true;

                //creates a new ticket object
                const newTicket = {
                    ticketId: null,
                    driverId: requestDetails.driverId,
                    arrivalTime: requestDetails.arrivalTime,
                    departureTime: requestDetails.departureTime,
                    carPark: parkingSpaceDetails.carpark,
                    parkingSpace: parkingSpaceDetails.parkingSpace,
                    chargePrice: calculateParkingCharge(requestDetails.arrivalTime, requestDetails.departureTime)
                };

                ticketToCreate = newTicket;

                await createTicket(newTicket);
                console.log("Why are we not here??");

            }

            const requestToUpdate = {
                requestId: parseInt(requestId),
                approved: approved
            };
    
            await updateRequest(requestToUpdate);
    
            //removes the requestObject from the DOM
            if (approved === false) {
                alert("Request was Declined, there is no free spaces for that selected time");
            }
            else {
                alert("Request was Accepted");
            }
            request.remove();
        }
    }

    //if decline button was pressed then the request object is updated to be rejected
    if (item.classList[0] == "decline-button") {

        let requestId = request.childNodes[0].childNodes[0].innerText;
        requestId = requestId.split(" ");

        const requestToUpdate = {
            requestId: parseInt(requestId[1]),
            approved: false
        };

        await updateRequest(requestToUpdate);

        alert("Request was Declined");
        request.remove();
    }
}


async function updateRequest(requestDetails) {
    
    // turns requestDetails object into JSON string
    
    const serializedMessage = JSON.stringify(requestDetails);

    // posts JSON string to the server at the end point /admin/requests/response
    const response = await fetch('/admin/requests/response', { method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                        }
                )      
}

async function createTicket(ticketRequest) {

    // turns ticket object into JSON string
    let serializedMessage = JSON.stringify(ticketRequest);
    

    // posts JSON string to the server at the end point ticket/createTicket
    let response = await fetch('/ticket/createTicket', { method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                    }
                )

    let json = await response.json();


    const accountToCharge = {
        userId: parseInt(ticketToCreate.driverId),
        ticketCost: ticketToCreate.chargePrice
    }

    serializedMessage = JSON.stringify(accountToCharge);

    // posts JSON string to the server at the end point payment/chargeAccount
    response = await fetch('/payment/chargeAccount', { method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                    }
                ) 

    json = await response.json();

    console.log("harry");
    return;
}

function calculateParkingCharge(arrivalTime, departureTime) {
    //create two date objects and calculate the difference in time in hours
    const startTime = new Date(arrivalTime);
    const endTime = new Date(departureTime);

    differenceInHours = (endTime - startTime)/ 60 / 60 / 1000;

    let parkingPrice;
    
    //gets a parkingPrice based off the number of hours you are parked in the car park
    if (differenceInHours <= 2) {
        parkingPrice = 200;
    }
    else if (differenceInHours <= 5) {
        parkingPrice = 500;
    }
    else if (differenceInHours <= 8) {
        parkingPrice = 800;
    }
    else if (differenceInHours <= 12) {
        parkingPrice = 1000;
    }
    else if (differenceInHours <= 24) {
        parkingPrice = 2000;
    }
    else if (differenceInHours <= 48) {
        parkingPrice = 2500;
    }
    else if (differenceInHours <= 72) {
        parkingPrice = 3000;
    }
    else if (differenceInHours <= 96) {
        parkingPrice = 3500;
    }
    else if (differenceInHours <= 120) {
        parkingPrice = 4000;
    }
    else if (differenceInHours <= 144) {
        parkingPrice = 4500;
    }
    else if (differenceInHours <= 168) {
        parkingPrice = 5000;
    }
    else if (differenceInHours <= 192) {
        parkingPrice = 5500;
    }
    else if (differenceInHours <= 216) {
        parkingPrice = 6000;
    }
    else {
        parkingPrice = 6500;
    }

    return parkingPrice;

}

async function getRequests(event) {
    event.preventDefault();

    // gets all driver requests from the server that have not been managed and stores them in an array called requests
    const response = await fetch('/admin/requests/manageRequests')
    const requests = await response.json();

    //iterate over requests, making divs requests
    requests.forEach(request => {


        const RequestDiv = document.createElement('div');
        RequestDiv.classList.add('request');
        const requestDetails = document.createElement('ul');
        RequestDiv.appendChild(requestDetails);

        const requestId = document.createElement('li');
        requestId.innerText = "TicketID: " + request.id;
        requestId.classList.add('request-item');
        requestDetails.appendChild(requestId);

        const arrivalDate = document.createElement('li');
        arrivalDate.innerText = "Arrival Time: " + request.arrivalTime.replace('T', ' ');
        arrivalDate.classList.add('request-item');
        requestDetails.appendChild(arrivalDate);

        const departureDate = document.createElement('li');
        departureDate.innerText = "Departure Time: " + request.departureTime.replace('T', ' ');
        departureDate.classList.add('request-item');
        requestDetails.appendChild(departureDate);
        
        //accept button
        const acceptButton = document.createElement('button');
        acceptButton.innerHTML = '<i class = "fas fa-check"><i>';
        acceptButton.classList.add("accept-button")
        RequestDiv.appendChild(acceptButton);

        //decline button
        const declineButton = document.createElement('button');
        declineButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        declineButton.classList.add("decline-button")
        RequestDiv.appendChild(declineButton);

        //append to list

        requestsList.appendChild(RequestDiv);

    })

}

//fetches all the carparks in the database and adds them to the select box for the driver to pick from
async function getCarparks() {
    const allCarparks_res = await fetch('/view-carpark/all-carparks');
    const carparks_json = await allCarparks_res.json();

    carparks_str = carparks_json.replace(/[^a-zA-Z, ]/g, ""); // strip all specials except comma,spaces
    const options = carparks_str.split(",");
    
    if (allCarparks_res.status == 200)
    {
        const carparkSelector = document.createElement('select');
        carparkSelector.classList.add("carpark-locations");
        selectorContainer.appendChild(carparkSelector);

        options.forEach(item => addOptions(item, carparkSelector)); // add new select option for each car park

        carparkSelector.value = ticketToCreate.carPark;
        getCarparkSpaces(carparkSelector.value, ticketToCreate.arrivalTime, ticketToCreate.departureTime);
        selectorContainer.addEventListener('change', changeCarPark);
    }
    else {
        document.getElementById('blockSpaceForm').innerHTML = "~ apparently there are no car parks available :( ~";
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

function changeCarPark(event) {
    event.preventDefault();

    const carparkSelector = document.querySelector('.carpark-locations');
    getCarparkSpaces(carparkSelector.value, ticketToCreate.arrivalTime, ticketToCreate.departureTime);

}

async function getCarparkSpaces(carpark, arrivalTime, departureTime) {

    try {
        const carparkContainer = document.getElementById('carparkContainer');
        carparkContainer.remove();

        const assignButton = document.getElementById('AssignSpace');
        assignButton.remove();

        const cancelButton = document.getElementById('CancelRequest');
        cancelButton.remove();
    }

    catch {
    }

    requestsList.remove();

    const spacesAvailability =  await fetch(`/view-carpark/FreeSpaces?carpark=${carpark}&aTime=${arrivalTime}&dTime=${departureTime}`)
    const spaces = await spacesAvailability.json();

    numberOfROws = Math.ceil(spaces.length / 12);

    const carparkContainer =  document.createElement('div');
    carparkContainer.setAttribute('id',`carparkContainer`);

    selectorContainer.appendChild(carparkContainer);


    for(let i = 0; i < numberOfROws; i++) {
        const carparkRow =  document.createElement('div');
        carparkRow.classList.add('carparkRow');
        carparkRow.setAttribute('id',`row_${i}`);
        carparkContainer.appendChild(carparkRow);
    }

    let addSpaceToRow = 0;
    for (let i = 0; i < spaces.length; i++) {
        if(i % 12 == 0 && i != 0) {
            addSpaceToRow++;
        }
        const carparkSpace =  document.createElement('div');
        carparkSpace.setAttribute('id',`space_${spaces[i].parkingSpace}`);
        carparkSpace.classList.add('space');
        carparkSpace.innerHTML = spaces[i].parkingSpace;

        if (!spaces[i].available) {
            carparkSpace.classList.add('occupied');
        }

        const rowToAddSpace = document.getElementById(`row_${addSpaceToRow}`);
        rowToAddSpace.appendChild(carparkSpace);

    }

    const assignSpaceButton = document.createElement('button');
    assignSpaceButton.setAttribute('id', 'AssignSpace');
    assignSpaceButton.innerHTML = "Assign";
    assignSpaceButton.addEventListener('click', AssignbuttonFunction);

    const cancelButton = document.createElement('button');
    cancelButton.innerHTML = "Cancel";
    cancelButton.setAttribute('id', 'CancelRequest');
    cancelButton.addEventListener('click', cancelButtonFunction);
    

    
    selectorContainer.appendChild(assignSpaceButton);
    selectorContainer.appendChild(cancelButton);


}

function AssignbuttonFunction(event) {
    event.preventDefault();

    createTicket(ticketToCreate);
    updateRequest(selectedRequest);

    window.location.reload();
}

function cancelButtonFunction(event) {
    window.location.reload();
}


function getSelectedSpace(event) {

    try {
        const selectedSpace = document.querySelector('.selected');
        selectedSpace.classList.toggle('selected');
    }
    catch {
    }

    if (event.target.classList.contains('space') && !event.target.classList.contains('occupied')) {
        event.target.classList.toggle('selected');

        selectedSpace = event.target.id;
        selectedSpace = selectedSpace.split("_");

        const carparkSelector = document.querySelector('.carpark-locations');

        ticketToCreate.carPark = carparkSelector.value;
        ticketToCreate.parkingSpace = parseInt(selectedSpace[1]);

    }
}



