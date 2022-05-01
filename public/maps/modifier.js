// Initialize and add the map
let marker;
let map;
let directionsRenderer;
let directionsService;
async function initMap() {
    const response = await fetch('/viewMap/getPins')
    const pins = await response.json();
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: {lat:52.62237,lng:1.24139,}
    });

    const infoWindow = new google.maps.InfoWindow();
    for(let i =0;i<pins.length;i++){
        marker = new google.maps.Marker({
            position: pins[i].location,
            title:pins[i].name,
            label:pins[i].name,
            map: map,
            optimized: false,
        });
    }
    marker.addListener("click",() =>{
        infoWindow.close();
        infoWindow.setContent(marker.getTitle());
        infoWindow.open(marker.getMap(), marker);
    })
    directionsRenderer.setMap(map);
}
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
        let option;
        option = document.createElement('option');
        option.text = tickets.arrivalTime;
        option.value = tickets.ticketId;
        dropdown.add(option);
    });
}

async function loadTicket(thing){
    const response = await fetch('/viewMap/getTicks')
    const data = await response.json();
    data.forEach(tickets => {
        if (tickets.ticketId == thing) {
            const userDiv = document.createElement('div');
            const userDetails = document.createElement('ul');
            userDiv.appendChild(userDetails);
            const ticketId = document.createElement('li');
            ticketId.innerText = "Ticket ID: " + tickets.ticketId;
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

async function mapDirection(){
    const test = "https://maps.googleapis.com/maps/api/directions/outputFormat?parameters"

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getDir);
    } else{
        alert("Sorry, browser does not support geolocation!");
    }
}
async function getDir(position){
    let tester = {"lat":position.coords.latitude,"lng":position.coords.longitude};
    let end = {
        "lat": 52.621520155003786,
        "lng": 1.2324725290527239
    }
    let request = {
        origin:tester,
        destination:end,
        travelMode:('DRIVING'),
    };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    });

}

window.initMap = initMap;
document.addEventListener('DOMContentLoaded', initMap);
document.addEventListener('DOMContentLoaded', dropper);
document.addEventListener('DOMContentLoaded', mapDirection);
const allList = document.querySelector('.all-lists');
document.getElementById('ticket-dropdown').addEventListener('change', function() { loadTicket(this.value);mapDirection;});