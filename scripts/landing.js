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
    .then(data => {
        console.log(data);
        alert('Login successful!')
        // if data return is null if statement later
        if(data.data == null){
            alert('user doesnt exist')
        }else{
            mystorage.setItem('userdetails', JSON.stringify(data.data))
            window.location.href = './home.html'
        }
    })
}

function register(){
    fetch(`https://clonebackend.herokuapp.com/user/`, {
        method:'POST',
        body: JSON.stringify({
            "email": document.querySelector('#remail').value,
            "full_name": document.querySelector('#rname').value,
            "username": document.querySelector('#rusername').value,
            "password": document.querySelector('#rpassword').value,
            "tag": document.querySelector('#rtag').value,
        }),
        headers: {
            'Content-type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alert('Register successful!')
    })
}