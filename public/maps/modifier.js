// Initialize and add the map
let marker=[];
let map;
let map2;
let directionsRenderer;
let directionsService;
let currentPosition;
let closest;
let currentSpace;
async function initMap() {
    const response = await fetch('/viewMap/getPins')
    let pins = await response.json();
    pins = pins.locations;

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();


    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: {lat:52.62237,lng:1.24139,}
    });


    for(let i =0;i<pins.length;i++){
        marker.push(new google.maps.Marker({
            position: new google.maps.LatLng(pins[i].location.lat,pins[i].location.lng),
            title:pins[i].name,
            label:pins[i].name,
            map: map,
            optimized: false,
        }));

    }
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
        if (tickets.driverId === sessionStorage.getItem("id")&& !tickets.checked_out) {
            let option;
            option = document.createElement('option');
            option.text = tickets.arrivalTime;
            option.value = tickets.ticketId;
            dropdown.add(option);
        }
    });
}

async function loadTicket(thing){
    const response = await fetch('/viewMap/getTicks')
    const data = await response.json();
    data.forEach(tickets => {
        if (tickets.ticketId == thing) {
            currentSpace = tickets.parkingSpace;
            currentPark = tickets.carPark;
            showSpace(currentPark,currentSpace);
            allList.innerHTML = "";
            const userDiv = document.createElement('div');
            const userDetails = document.createElement('ul');
            userDiv.appendChild(userDetails);
            const ticketId = document.createElement('li');
            ticketId.innerText = "Ticket ID: " + tickets.ticketId;
            userDetails.appendChild(ticketId);
            const spaceId = document.createElement('li');
            spaceId.innerText = "Space ID: " + tickets.parkingSpace;
            userDetails.appendChild(spaceId);
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
            getDir(tickets.carPark)

            userDetails.appendChild(location);
            allList.appendChild(userDiv);
        }
    });
}

async function mapDirection(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPos);
    } else{
        alert("Sorry, browser does not support geolocation!");
    }
}
async function showPos(position){
    currentPosition = {"lat":position.coords.latitude,"lng":position.coords.longitude};
}
async function getDir(test){
    await mapDirection();
    let dest;
    for (let i = 0; i < marker.length; i++) {
        if(marker[i].title == test){
            dest = marker[i].getPosition();
        }
    }
    let request = {
        origin:currentPosition,
        destination:dest,
        travelMode:('DRIVING'),
    };
    directionsService.route(request, function(result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    });
}


async function getClosest(){
    await mapDirection();

    let smallest = marker[0];
    let temp;
    let temp2 = (google.maps.geometry.spherical.computeDistanceBetween(marker[0].position,currentPosition));

    for (let i =0;i<marker.length;i++) {

        temp = (google.maps.geometry.spherical.computeDistanceBetween(marker[i].position,currentPosition));
        if(temp<temp2){
            smallest = marker[i];
        }
        temp2 = temp;
    }
    temp = document.getElementById("closest_park");
    temp.innerHTML = smallest.title;
    sessionStorage.setItem('closest', smallest.title);
    console.log(smallest.title);
}


async function showSpace(){
    let carpark = currentPark;

        try {
            const carparkSpacesContainer = document.getElementById('carparkContainer');
            carparkSpacesContainer.remove();
        }

        catch {
        }

        const spacesAvailability =  await fetch(`/view-carpark/manageSpaces?carpark=${carpark}`)
        const spaces = await spacesAvailability.json();

        let numberOfROws = Math.ceil(spaces.length / 12);

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
            if(i===currentSpace){
                const carparkSpace =  document.createElement('div');
                carparkSpace.setAttribute('id',`space_${spaces[i].ID}`);
                carparkSpace.classList.add('space');
                carparkSpace.classList.add('occupied');
                carparkSpace.innerHTML = spaces[i].ID;
                const rowToAddSpace = document.getElementById(`row_${addSpaceToRow}`);
                rowToAddSpace.appendChild(carparkSpace);
            }
            else {
                const carparkSpace = document.createElement('div');
                carparkSpace.setAttribute('id', `space_${spaces[i].ID}`);
                carparkSpace.classList.add('space');
                carparkSpace.innerHTML = spaces[i].ID;

                const rowToAddSpace = document.getElementById(`row_${addSpaceToRow}`);
                rowToAddSpace.appendChild(carparkSpace);
            }
        }

}
let currentPark;
window.initMap = initMap;
document.addEventListener('DOMContentLoaded', dropper);
document.addEventListener('DOMContentLoaded', mapDirection);
document.addEventListener('DOMContentLoaded', getClosest);
const allList = document.querySelector('.all-lists');
document.getElementById('ticket-dropdown').addEventListener('change', function() {
    loadTicket(this.value);

});
document.getElementById("calculate").addEventListener("click", getClosest);