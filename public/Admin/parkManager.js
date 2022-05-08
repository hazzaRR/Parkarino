var marker
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
    let block=1;
    for(let i = 0; i < newPark.freespaces; i++) {
        if(i%24 ==0){
            block++;
        }
        let temp = {ID:i%24,available:true,occupier:null,block:block};
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

    if (response.status === 200) {
        console.log("Received");
    }
    else if (response.status === 300) {
        console.log("Location needed");
    }
    else {
        console.log("Something happened");
    }
}

async function initMap() {
    // The location of Uluru
    const tester = {lat: 52.621937,lng:1.238824}
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: tester,
    });
    marker = new google.maps.Marker;
    google.maps.event.addListener(map, "click", function(event){
        marker.setMap(null);
        marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            label:"park location"
        });
    });


}

window.initMap = initMap;

const form = document.querySelector('#parkForm');
form.addEventListener('submit', newPark);
