const mystorage = window.localStorage

async function login(){
    const response = await fetch(`https://clonebackend.herokuapp.com/user/`, {
        method:'PATCH',
        body: JSON.stringify({
            "email": document.querySelector('#semail').value,
            "password": document.querySelector('#spassword').value
        }),
        headers: {
            'Content-type': 'application/json',
        }
    })

    const data = await response.json()
    if(data.data == null){
        alert('user doesnt exist')
    }else{
        alert('Login successful!')
        mystorage.setItem('userdetails', JSON.stringify(data.data))
        window.location.href = './home.html'
    }



    // .then(res => res.json())
    // .then(data => {
    //     console.log(data);
    //     // if data return is null if statement later
        // if(data.data == null){
        //     alert('user doesnt exist')
        // }else{
        //     alert('Login successful!')
        //     mystorage.setItem('userdetails', JSON.stringify(data.data))
        //     window.location.href = './home.html'
        // }
    // })
}

async function register(){
    const response = await fetch(`https://clonebackend.herokuapp.com/user/`, {
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

    const data = await response.json()
    console.log(data);
    alert('Register successful!')

    // .then(res => res.json())
    // .then(data => {
    //     console.log(data);
    //     alert('Register successful!')
    // })
}