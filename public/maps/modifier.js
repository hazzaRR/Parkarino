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
    map2 = new google.maps.Map(document.getElementById("map2"), {
        zoom: 15,
        center: {lat:52.62237,lng:1.24139,}
    });

    for(let i =0;i<pins.length;i++){
        console.log(pins[i].location);
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
            console.log(currentSpace);
            allList.innerHTML = "";
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


async function getClosest(test){
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

    closest = new google.maps.Marker({
        position: new google.maps.LatLng(smallest.position.lat,smallest.position.lng),
        title:smallest.title,
        label:smallest.label,
        map: map2,
        optimized: false,
    });

    console.log(smallest.title);

}

async function showSpace(parkingSpace){
    let first_row = document.getElementById('row1')
    let second_row = document.getElementById('row2')
    let third_row = document.getElementById('row3')
    let fourth_row = document.getElementById('row4')
    first_row.innerHTML ="";
    second_row.innerHTML ="";
    third_row.innerHTML ="";
    fourth_row.innerHTML ="";
    for(let i =0;i<6;i++){
        if (i==parkingSpace){
            let perfect = document.createElement("li");
            perfect.id = "correct"
            first_row.appendChild(perfect)
        }
        else{
            let li =document.createElement("li");
            li.id = "incorrect"
            first_row.appendChild(li);
        }
    }
    for(let i =6;i<12;i++){
        if (i==parkingSpace){
            let perfect = document.createElement("li");
            perfect.setAttribute('id','correct');
            second_row.appendChild(perfect);
        }
        else{
            let li =document.createElement("li");
            li.id = "incorrect"
            second_row.appendChild(li);

        }
    }
    for(let i =12;i<18;i++){
        if (i==parkingSpace){
            let perfect = document.createElement("li");
            perfect.id = "correct";
            third_row.appendChild(perfect);
        }
        else{
            let li =document.createElement("li");
            li.id = "incorrect"
            third_row.appendChild(li);
        }
    }
    for(let i =18;i<24;i++){
        if (i==parkingSpace){
            let perfect = document.createElement("li");
            perfect.id = "correct";
            fourth_row.appendChild(perfect);
        }
        else{
            let li =document.createElement("li");
            li.id = "incorrect"
            fourth_row.appendChild(li);
        }
    }
    console.log("SPMSIENF")
}

window.initMap = initMap;
document.addEventListener('DOMContentLoaded', dropper);
document.addEventListener('DOMContentLoaded', mapDirection);
document.addEventListener('DOMContentLoaded', showSpace);
const allList = document.querySelector('.all-lists');
document.getElementById('ticket-dropdown').addEventListener('change', function() {
    loadTicket(this.value);
    showSpace(this.value);});
document.getElementById("calculate").addEventListener("click", getClosest);