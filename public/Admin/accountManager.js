async function banUser(event) {
    const item = event.target;
    const ban = item.parentElement;

    let ban_email = ban.childNodes[0].childNodes[2].innerText;
    ban_email = ban_email.slice(7)

    const response = await fetch('/accountMan/ban', { method: 'POST',
            headers: {
        'Content-Type': 'application/json'
            },
            body: JSON.stringify({the_ban_email:ban_email})
            }
        );
    const json = response.json();
    if(response.status=200){
        console.log("this email was removed" + json);
        ban.remove();
    }



}
async function getAllUsers(event) {
    event.preventDefault();
    const response = await fetch('/accountMan/manageAccount')
    const users = await response.json();
    users.forEach(user => {
        if (user.user_Type!="Admin"){
            const userDiv = document.createElement('div');
            userDiv.className="banContainer";
            const userDetails = document.createElement('ul');
            userDetails.className = "banForm";
            userDiv.appendChild(userDetails);
            const userID = document.createElement('li');
            userID.innerText = "User ID: " + user._id;
            userID.className = "ban_class"
            userDetails.appendChild(userID);
            const userName = document.createElement('li');
            userName.innerText = "Username: " + user.username;
            userName.className = "ban_class"
            userDetails.appendChild(userName);
            const email = document.createElement('li');
            email.innerText = "Email: " + user.email
            email.className = "ban_class"
            userDetails.appendChild(email);
            const balance = document.createElement('li');
            balance.innerText = "Current balance: " + user.wallet;
            balance.className = "ban_class"
            userDetails.appendChild(balance);
            const banButton = document.createElement('button');
            banButton.innerHTML = 'Ban';
            banButton.id="ban";
            userDiv.appendChild(banButton);
            allList.appendChild(userDiv);
        }
    })

}
const allList = document.querySelector('.all-lists');
document.addEventListener('DOMContentLoaded', getAllUsers);
allList.addEventListener('click', banUser);