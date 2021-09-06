const mystorage = window.localStorage

function login(){
    fetch(`https://clonebackend.herokuapp.com/user/`, {
        method:'PATCH',
        body: JSON.stringify({
            "email": document.querySelector('#semail').value,
            "password": document.querySelector('#spassword').value
        }),
        headers: {
            'Content-type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => console.log(data))
}