//function runs whenever user requests to see carpark etc
async function viewCarpark(event) {
    event.preventDefault();

    //selects the form element from hmtl
    const formInfo = document.querySelector('#viewCarparkForm');

    //create a new object that stores carpark choice
    const carpark = {
        carpark: formInfo.elements.namedItem('carpark').value,
    };

    // turns carpark object into JSON string
    const serializedMessage = JSON.stringify(carpark);

    // posts JSON string to the server at the end point /view-carpark/carpark-info
    const response = await fetch('/view-carpark/carpark-info', { method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                    }
                )
    const json = await response.json();

    if (response.status === 200) {
        if(sessionStorage.getItem('userType').toLowerCase() === 'admin') {
            //display the administrative admin view maybe?
            //window.location.href = "/admin";
        }
        else {
            //car park view stuff
            window.location.href = "/";
        }
    }
    else {
        document.getElementById('addCreditForm').innerHTML = "~ you must log in or register to  add credit to your account ~";
    }
}




async function getCarparks()
{
    const allCarparks_res = await fetch('/view-carpark/all-carparks', { method: 'GET'});
    const carparks_json = await allCarparks_res.json();

    carparks_str = carparks_json.replace(/[^a-zA-Z, ]/g, ""); // strip all specials except comma,spaces
    const options = carparks_str.split(",");
    //console.log(carparks_str);
    
    if (allCarparks_res.status == 200)
    {
        options.forEach(item => addOptions(item)); // add new select option for each car park
    }
    else {
        document.getElementById('viewCarparkForm').innerHTML = "~ apparently there are no car parks available :( ~";
    }
}
function addOptions(item)
{
    var ops = document.getElementById("select_carparks");
    var option = document.createElement("option");
    option.text = item, ops.add(option);
}
getCarparks();
const form = document.querySelector('#viewCarparkForm');
form.addEventListener('submit', viewCarpark);