

async function dropper(){
    let dropdown = document.getElementById('ticket-dropdown');
    dropdown.length = 0;
    let defaultOption = document.createElement('option');
    defaultOption.text = 'Select Ticket';
    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;
    const response = await fetch('/viewMap/getTicks')
    const data = await response.json();
    data.forEach(tickets => {
        if (tickets.driverId === sessionStorage.getItem("id") && !tickets.checked_out) {
            let option;
            option = document.createElement('option');
            option.text = tickets.arrivalTime;
            option.value = tickets.ticketId;
            dropdown.add(option);
        }
    });
}

async function loadTicket(thing){
    console.log("ASDHuasnd")
    const response = await fetch('/viewMap/getTicks')
    const data = await response.json();

    data.forEach(tickets => {

        if (tickets.ticketId == thing) {
            allList.innerHTML = "";
            const userDiv = document.createElement('div');
            const userDetails = document.createElement('ul');
            userDiv.appendChild(userDetails);
            const ticketId = document.createElement('li');
            ticketId.innerText = "Ticket ID: " + tickets.ticketId;
            ticketId.value = tickets.ticketId;
            userDetails.appendChild(ticketId);
            const arrivalTime = document.createElement('li');
            arrivalTime.innerText = "Arrival time: " + tickets.arrivalTime;
            userDetails.appendChild(arrivalTime);
            const departureTime = document.createElement('li');
            departureTime.innerText = "Departure Time: " + tickets.departureTime;
            userDetails.appendChild(departureTime);
            const cost = document.createElement('li');
            cost.innerText = "Cost: " + tickets.chargePrice;
            userDetails.appendChild(cost);
            const location = document.createElement('li');
            location.innerText = "Car park: " + tickets.carPark;
            userDetails.appendChild(location);
            allList.appendChild(userDiv);
        }
    });
}


async function changeCheck(){

    const serializedMessage = JSON.stringify(currentTick);
    const response = await fetch('/check_in/check1', { method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: serializedMessage
        }
    )
    await response.json();
}
async function changeCheckout(){

    const serializedMessage = JSON.stringify(currentTick);
    const response = await fetch('/check_in/check2', { method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: serializedMessage
        }
    )
    await response.json();
}
const allList = document.querySelector('.all-lists');
let currentTick;
document.addEventListener('DOMContentLoaded', dropper);
document.getElementById('ticket-dropdown').addEventListener('change', function() {
    loadTicket(this.value);
    currentTick = {ticket:this.value};});

const test = document.getElementById("check_in")
test.addEventListener("click", changeCheck);

const yes = document.getElementById("check_out")
yes.addEventListener("click", changeCheckout);

