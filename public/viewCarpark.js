//function runs whenever user requests to see carpark etc
async function viewCarpark(event) {
    event.preventDefault();

    //selects the form element from form.hmtl
    const formInfo = document.querySelector('#viewCarparkForm');

    //create a new object that stores session email and additional credit
    const addCredit = {
        //email: sessionStorage.getItem('email'),
        //carpark: formInfo.elements.namedItem('credit').value,
    };

    // turns addCredit object into JSON string
    const serializedMessage = JSON.stringify(addCredit);

    // posts JSON string to the server at the end point /login
    const response = await fetch('/view-carpark', { method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        body: serializedMessage
                    }
                )
    const json = await response.json();

    if (response.status === 200) {
        if(sessionStorage.getItem('userType').toLowerCase() === 'admin') {
            window.location.href = "/admin";
        }
        else {
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
    carparks_str = carparks_json.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, "");
    carparks_str = carparks_str.replace(/[[\]]/g, "");
    const options = carparks_str.split(",");
    
    if (allCarparks_res.status == 200)
    {
        options.forEach(item => addOptions(item));
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
/* Remove credit form if not logged in
if (!sessionStorage.email)
{
    document.getElementById('addCreditForm').innerHTML = "~ you must log in or register to  add credit to your account ~";
}*/
getCarparks();
const form = document.querySelector('#viewCarparkForm');
form.addEventListener('submit', viewCarpark);