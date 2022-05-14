//function runs whenever a form is submitted sends it to server to check/change credit of user
async function addCredit(event) {
    event.preventDefault();
    
    //selects the form element from form.hmtl
    const formInfo = document.querySelector('#addCreditForm');

    //create a new object that stores session email and additional credit
    const addCredit = {
        email: sessionStorage.getItem('email'),
        wallet: formInfo.elements.namedItem('credit').value,
    };

    if (addCredit.wallet < 0 || isNaN(addCredit.wallet))
    {
        const incorrectVal = document.createElement('p');
        incorrectVal.setAttribute('id', 'incorrectCreditValue');
        incorrectVal.innerText = 'Invalid amount, must be a positive number...';
        document.getElementById('addCreditContainer').appendChild(incorrectVal);
    }

    else
    {

        // turns addCredit object into JSON string
        const serializedMessage = JSON.stringify(addCredit);

        // posts JSON string to the server at the end point /login
        const response = await fetch('/add-credit/add-credit', { method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                            body: serializedMessage
                        }
                    )
        const json = await response.json();

        if (response.status == 200) {
            if(sessionStorage.getItem('userType').toLowerCase() == 'admin') {
                window.location.href = "/admin";
            }
            else {
                window.location.href = "/index";
            }
        }
        else {
            document.getElementById('addCreditForm').innerHTML = "~ you must log in or register to  add credit to your account ~";
        }
    }
}
//Remove credit form if not logged in
if (!sessionStorage.email)
{
    document.getElementById('addCreditForm').innerHTML = "~ you must log in or register to  add credit to your account ~";
}
const form = document.querySelector('#addCreditForm');
form.addEventListener('submit', addCredit);