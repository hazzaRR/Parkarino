async function banUser(event) {
    const item = event.target;
    const ban = item.parentElement;

    let ban_email = ban.childNodes[0].childNodes[2].innerText;
    ban_email = ban_email.slice(7)
    console.log("HERE");

    let new_email = {the_ban_email:ban_email}

    await fetch('/accountMan/ban', { method: 'PATCH',
            headers: {
        'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_email)
            }
        )
    ban_email = await response.json();
    console.log("Hello");
    ban.remove();


}
async function getAllUsers(event) {
    event.preventDefault();
    const response = await fetch('/accountMan/manageAccount')
    const users = await response.json();

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('User');
        const userDetails = document.createElement('ul');
        userDiv.appendChild(userDetails);
        const userID = document.createElement('li');
        userID.innerText = "User ID: " + user._id;
        userID.classList.add('new-item');
        userDetails.appendChild(userID);
        const userName = document.createElement('li');
        userName.innerText = "Username: " + user.username;
        userName.classList.add('new-item');
        userDetails.appendChild(userName);
        const email = document.createElement('li');
        email.innerText = "Email: " + user.email
        email.classList.add('new-item');
        userDetails.appendChild(email);
        const balance = document.createElement('li');
        balance.innerText = "Current balance: " + user.wallet;
        balance.classList.add('new-item');
        userDetails.appendChild(balance);
        const banButton = document.createElement('button');
        banButton.innerHTML = 'Ban';
        banButton.classList.add("ban-button")
        userDiv.appendChild(banButton);
        allList.appendChild(userDiv);

    })

}
const allList = document.querySelector('.all-lists');
document.addEventListener('DOMContentLoaded', getAllUsers);
allList.addEventListener('click', banUser);