
//selectors
const requestsList = document.querySelector('.requests-list');
const filterOption = document.querySelector('.requestFilter')
//event listeners

document.addEventListener('DOMContentLoaded', getRequests);
requestsList.addEventListener('click', updateRequest);
// filterOption.addEventListener('click', filterTodo);



async function updateRequest(event) {

    const item = event.target;
    const request = item.parentElement;

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

        // turns loginCreds object into JSON string
        const serializedMessage = JSON.stringify(requestDetails);

        // posts JSON string to the server at the end point /login
        const response = await fetch('/admin/requests/response', { method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            body: serializedMessage
                        }
                    )

        const json = await response.json();

        console.log(json);

        request.remove();

    }
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

