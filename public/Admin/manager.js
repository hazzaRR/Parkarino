async function newPark(event) {
    event.preventDefault();
    const getForm = document.querySelector('#parkForm');


    let newPark = {
        _id: 0,
        location: getForm.elements.namedItem('name').value,
        num_spaces: getForm.elements.namedItem('spaces').value,
        freespaces: getForm.elements.namedItem('spaces').value,
        space:0
    };

    let test = [];
    for(let i = 0; i < newPark.freespaces; i++) {
        let temp = {ID:i,available:true,occupier:null,location:newPark.location};
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
        console.log("Email got saved");
    }
    else {
        console.log("Something happened");
    }
}
const form = document.querySelector('#parkForm');
form.addEventListener('submit', newPark);
