async function banUser(event) {
    const item = event.target;
    const ban = item.parentElement;

    let ban_email = ban.childNodes[0].childNodes[2].innerText;
    ban_email = ban_email.slice(7)

    await fetch('/accountMan/ban', { method: 'POST',
            headers: {
        'Content-Type': 'application/json'
            },
            body: JSON.stringify({the_ban_email:ban_email})
            }
        );
    ban.remove();


}
async function getAllUsers(event) {
    event.preventDefault();
    const response = await fetch('/accountMan/manageAccount')
    const users = await response.json();
    users.forEach(user => {
        const userDiv = document.createElement('div');
        const userDetails = document.createElement('ul');
        userDiv.appendChild(userDetails);
        const userID = document.createElement('li');
        userID.innerText = "User ID: " + user._id;
        userDetails.appendChild(userID);
        const userName = document.createElement('li');
        userName.innerText = "Username: " + user.username;
        userDetails.appendChild(userName);
        const email = document.createElement('li');
        email.innerText = "Email: " + user.email
        userDetails.appendChild(email);
        const balance = document.createElement('li');
        balance.innerText = "Current balance: " + user.wallet;
        userDetails.appendChild(balance);
        const banButton = document.createElement('button');
        banButton.innerHTML = 'Ban';
        userDiv.appendChild(banButton);
        allList.appendChild(userDiv);
    })

}
const allList = document.querySelector('.all-lists');
document.addEventListener('DOMContentLoaded', getAllUsers);
allList.addEventListener('click', banUser);