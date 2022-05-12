var marker;
async function newPark(event) {
    event.preventDefault();
    const getForm = document.querySelector('#parkForm');

    let newPark = {
        _id: 0,
        name: getForm.elements.namedItem('name').value,
        num_spaces: parseInt(getForm.elements.namedItem('spaces').value),
        freespaces: parseInt(getForm.elements.namedItem('spaces').value),
        location: marker.position,
        space:0
    };

    let test = [];
    for(let i = 0; i < newPark.freespaces; i++) {
        let temp = {ID:i,available:true,occupier:null};
        test.push(temp);
    }

    newPark.space=test;
    console.log(test);
    const serializedMessage = JSON.stringify(newPark);
    const response = await fetch('/ManagerPark', { method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: serializedMessage
        }
    )
    let temp;
    const json = await response.json;
    if (response.status == 200) {
        console.log(json);
        temp = document.getElementById("Created");
        temp.innerHTML = "Successfully created";
        location.reload();
    }
    else if (response.status == 300) {
        console.log(json);
        temp = document.getElementById("Created");
        temp.innerHTML = json;
        temp.innerHTML = "Not successful";
    }
    else {
        console.log(json);
        temp = document.getElementById("Created");
        temp.innerHTML = "Not successful";
    }
}
let test =[];
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
        test.push(new google.maps.Marker({
            position: new google.maps.LatLng(pins[i].location.lat,pins[i].location.lng),
            title:pins[i].name,
            label:pins[i].name,
            map: map,
            optimized: false,
        }));
    }



    marker = new google.maps.Marker;
    google.maps.event.addListener(map, "click", function(event){
        marker.setMap(null);
        marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            label:"Park location"
        });
    });


}

window.initMap = initMap;

const form = document.querySelector('#parkForm');
form.addEventListener('submit', newPark);
