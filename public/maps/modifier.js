let key = "AIzaSyDCzUVNr8Omhr8BT-41g3SZAsGSStWv4iQ";

// Initialize and add the map
async function initMap(event) {
    const response = await fetch('/viewMap/getPins')
    const pins = await response.json();

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: {lat:52.62237,lng:1.24139,}
    });
    let marker;
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
}

window.initMap = initMap;
document.addEventListener('DOMContentLoaded', initMap);
