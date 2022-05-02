async function loadUsers(event)
{
    const activeUsers_res = await fetch('/messages/get-users', { method: 'GET'});
    const activeUsers_json = await activeUsers_res.json();

    activeUsers_str = activeUsers_json.replace(/[\[\]'"]+/g,''); // strip all specials except comma,spaces
    const options = activeUsers_str.split(",");
    //console.log(activeUsers_str);
    console.log(activeUsers_json.status)
    if (activeUsers_res.status == 200)
    {
        options.forEach(item => addOptions(item)); // add new select option for each car park
    }
    else {
        return
        //document.getElementById('messageUserForm').innerHTML = "there are no users :( ~";
    }
    
}
function addOptions(item)
{
    console.log(item)
    var ops = document.getElementById("get_users");
    var option = document.createElement("option");
    option.text = item, ops.add(option);
}
const form = document.querySelector('#messageUserForm');
window.addEventListener('load', loadUsers);