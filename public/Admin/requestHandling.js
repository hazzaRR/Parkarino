
//selectors
const requestsList = document.querySelector('.requests-list');
const filterOption = document.querySelector('.requestFilter')
//event listeners

document.addEventListener('DOMContentLoaded', getRequests);
requestsList.addEventListener('click', updateRequest);
// filterOption.addEventListener('click', filterTodo);



async function updateRequest(event) {

    //gets the requestObject that was just clicked on
    const item = event.target;
    const request = item.parentElement;

    //if the accept or decline button was selected, the  request id is fetched from the request object
    if (item.classList[0] == "accept-button" || item.classList[0] == "decline-button") {

        const requestId = request.childNodes[0].childNodes[0].innerText;

        let approved;

        if(item.classList[0] == "decline-button") {
            approved = false;
        }
        else {
            approved = true;
        }

        console.log(parseInt(requestId.slice(-1)));

        const requestDetails = {
            requestId: parseInt(requestId.slice(-1)),
            approved: approved
        };

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

        //gets the request that was just updated
        const ticketToCreate = await response.json();

        //if the request was approved, a ticket is generated for that request
        if(ticketToCreate.approved === true) {
            await createTicket(ticketToCreate);
        }

        //removes the requestObject from the DOM
        request.remove();

    }
}

async function createTicket(ticketRequest) {


    //creates a new ticket object
    const newTicket = {
        ticketId: null,
        driverId: ticketRequest.driverId,
        arrivalDate: ticketRequest.arrivalDate,
        arrivalTime: ticketRequest.arrivalTime,
        departureDate: ticketRequest.departureDate,
        departureTime: ticketRequest.departureTime,
        carPark: null,
        parkingSpace: null,
        chargePrice: calculateParkingCharge(ticketRequest.arrivalDate, ticketRequest.arrivalTime, ticketRequest.departureDate, ticketRequest.departureTime)
    };

        // turns ticket object into JSON string
        const serializedMessage = JSON.stringify(newTicket);
        

        // posts JSON string to the server at the end point ticket/createTicket
        const response = await fetch('/ticket/createTicket', { method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            body: serializedMessage
                        }
                    )
    
        const json = await response.json();

}

function calculateParkingCharge(arrivalDate, arrivalTime, departureDate, departureTime) {
    //create two date objects and calculate the difference in time in hours
    const startTime = new Date(`${arrivalDate} ${arrivalTime}`);
    const endTime = new Date(`${departureDate} ${departureTime}`);

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

function filterTodo(event) {
    const todos = todoList.childNodes;
    todos.forEach(function(todo) {
        switch(event.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if(todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                }
                else {
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if(!todo.classList.contains('completed')) {
                    todo.style.display = "flex";
                }
                else {
                    todo.style.display = "none";
                }
                break;

        }
    })

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
        arrivalDate.innerText = "Arrival Date: " + request.arrivalDate + ", Arrival Time: " + request.arrivalTime;
        arrivalDate.classList.add('request-item');
        requestDetails.appendChild(arrivalDate);

        const departureDate = document.createElement('li');
        departureDate.innerText = "Departure Date: " + request.departureDate + ", Departure Time: " + request.departureTime;
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

