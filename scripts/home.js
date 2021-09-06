const mystorage = window.localStorage
let user = JSON.parse(mystorage['userdetails'])

function profiledetails(){
    fetch(`https://clonebackend.herokuapp.com/user/${user.userId}/`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        let profile = data.data
        let following = profile['following'].substring(1).slice(0, -1).split(',')
        console.log(following)
        document.querySelector('.profile-details').innerHTML = `
            <div class='profileimg'>
                <img src='${profile.profile_image}' alt='profile img'/>
            </div>
            <div class='profilename-tag'>
                <div class='profileusername'>${profile.username}</div>
                <div class='profiletag'>${profile.tag}</div>
            </div>
            <div class='followings'>
                <div>
                    following <span>${following.length}</span>
                </div>
                <div>
                    followers <span>0</span>
                </div>
            </div>
        `
    })
}

profiledetails()

console.log(user.following)


function showposts(){
    userid = user.userId
    if (user.following == ''){
        document.querySelector('.postsbody').innerHTML = 'Nothing here for now. Follow some users.'
    }else{
        fetch(`https://clonebackend.herokuapp.com/post/${userid}/`, {
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            data.data.forEach(post => {
                document.querySelector('.postsbody').innerHTML += `
                <div class='post'>
                    <div class='postleftsection'>
                        <img src='${post.profile_image}' alt='profile image'>
                    </div>
                    <div class='postrightsection'>
                        <div class='postuserdetails'>
                            <div class='postusername'>
                                ${post.username}
                            </div> 
                            <div class='posttag'>
                                @${post.tag}
                            </div>
                        </div>
                        <div class='textandimage'>
                            <p>${post.text}</p>
                            <div class='postimage1'>
                                <img src='${post.image1}' alt='image1'/>
                            </div>
                            <div class='timecreated'>${post.datetime}</div>
                        </div>
                    </div> 
                </div>
                `
            })
        })
    }
}

showposts()

function showusers(){
    fetch(`https://clonebackend.herokuapp.com/user/`, {
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        data.data.forEach(user => {
            document.querySelector('.users').innerHTML += `
                <div class='user'>
                    <img src='${user.profile_image}' alt='profile image'>
                    <div class='user-data'>
                        <span class='user-username'>${user.username}</span>
                        <span class='user-tag'>${user.tag}</span>
                        <span class='user-bio'>${user.bio}</span>
                    </div>
                    <div class='followbutton' id='${user.userId}'>follow</div>
                </div>
            `
        });
        document.querySelectorAll('.followbutton').forEach(button => button.addEventListener('click', followuser))
    })
}

showusers()

function followuser(e){
    let followingid = e.target.id
    let userid = user.userId
    fetch(`https://clonebackend.herokuapp.com/user/follow/${followingid}/${userid}/`, {
        method:'PATCH',
        headers: {
            'Content-type': 'application/json',
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        alert('follow successful')
        e.target.innerHTML = 'followed'
    })
}