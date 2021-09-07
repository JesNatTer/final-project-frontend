const mystorage = window.localStorage
let user = JSON.parse(mystorage['userdetails'])

function postdata(){
    let postobject = {}
    postobject['userid'] = user.userId
    postobject['text'] = document.querySelector('#posttext').value
    postobject['image_1'] = document.querySelector('.imgp1').src
    postobject['image_2'] = document.querySelector('.imgp2').src
    postobject['image_3'] = document.querySelector('.imgp3').src
    postobject['image_4'] = document.querySelector('.imgp4').src
    postobject['source_id'] = 0
    return postobject
}

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

// document.querySelectorAll('.postimageinputs').forEach(input => input.addEventListener('change', imgpreviewname))

function uploadimage(option) {
    const image = document.querySelector(`.imgp${option}`);
    const file = document.querySelector(`#image${option}`).files[0];
    const reader = new FileReader();
    image.classList.toggle('active')
    document.querySelector(`.removeicon${option}`).classList.toggle('active')
  
    reader.addEventListener("load", function () {
      image.src = reader.result;
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
      if (option != 4){
          document.querySelector(`#image${option + 1}`).removeAttribute('disabled')
      }
    }
  }

function removeimg(option) {
    if (option == 1){
        const image = document.querySelector(`.imgp${option}`);
        image.src = ''
        let blank = ''
        if (document.querySelector(`.imgp4`).src[0] =='d'&& document.querySelector(`.imgp3`).src[0] == 'd' && document.querySelector(`.imgp2`).src[0] == 'd'){
            document.querySelector(`.imgp1`).src = document.querySelector(`.imgp2`).src
            document.querySelector(`.imgp2`).src = document.querySelector(`.imgp3`).src
            document.querySelector(`.imgp3`).src = document.querySelector(`.imgp4`).src
            document.querySelector(`.imgp4`).src = blank
            document.querySelector(`#image4`).setAttribute('disabled', '')
            document.querySelector(`.imgp4`).classList.toggle('active')
            document.querySelector(`.removeicon4`).classList.toggle('active')
            return
        }
        if (document.querySelector(`.imgp3`).src[0] == 'd' && document.querySelector(`.imgp2`).src[0] == 'd'){
            document.querySelector(`.imgp1`).src = document.querySelector(`.imgp2`).src
            document.querySelector(`.imgp2`).src = document.querySelector(`.imgp3`).src
            document.querySelector(`.imgp3`).src = blank
            document.querySelector(`#image4`).setAttribute('disabled', '')
            document.querySelector(`#image3`).setAttribute('disabled', '')
            document.querySelector(`.imgp3`).classList.toggle('active')
            document.querySelector(`.removeicon3`).classList.toggle('active')
            return
        }
        if (document.querySelector(`.imgp2`).src[0] =='d'){
            document.querySelector(`.imgp1`).src = document.querySelector(`.imgp2`).src
            document.querySelector(`.imgp2`).src = blank
            document.querySelector(`#image3`).setAttribute('disabled', '')
            document.querySelector(`#image2`).setAttribute('disabled', '')
            document.querySelector(`.imgp2`).classList.toggle('active')
            document.querySelector(`.removeicon2`).classList.toggle('active')
            return
        }
        if (document.querySelector(`.imgp2`).src[0] =='h'){
            document.querySelector(`#image2`).setAttribute('disabled', '')
            image.classList.toggle('active')
            document.querySelector(`.removeicon${option}`).classList.toggle('active')
        }
    }
    if (option == 2){
        const image = document.querySelector(`.imgp${option}`);
        image.src = ''
        let blank = ''
        if (document.querySelector(`.imgp4`).src[0] =='d'&& document.querySelector(`.imgp3`).src[0] == 'd'){
            document.querySelector(`.imgp2`).src = document.querySelector(`.imgp3`).src
            document.querySelector(`.imgp3`).src = document.querySelector(`.imgp4`).src
            document.querySelector(`.imgp4`).src = blank
            document.querySelector(`#image4`).setAttribute('disabled', '')
            document.querySelector(`.imgp4`).classList.toggle('active')
            document.querySelector(`.removeicon4`).classList.toggle('active')
            return
        }
        if (document.querySelector(`.imgp3`).src[0] == 'd'){
            document.querySelector(`.imgp2`).src = document.querySelector(`.imgp3`).src
            document.querySelector(`.imgp3`).src = blank
            document.querySelector(`#image4`).setAttribute('disabled', '')
            document.querySelector(`#image3`).setAttribute('disabled', '')
            document.querySelector(`.imgp3`).classList.toggle('active')
            document.querySelector(`.removeicon3`).classList.toggle('active')
            return
        }
        if (document.querySelector(`.imgp3`).src[0] =='h'){
            document.querySelector(`#image3`).setAttribute('disabled', '')
            image.classList.toggle('active')
            document.querySelector(`.removeicon${option}`).classList.toggle('active')
        }
    }
    if (option == 3){
        const image = document.querySelector(`.imgp${option}`);
        image.src = ''
        let blank = ''
        if (document.querySelector(`.imgp4`).src[0] =='d'){
            document.querySelector(`.imgp3`).src = document.querySelector(`.imgp4`).src
            document.querySelector(`.imgp4`).src = blank
            document.querySelector(`#image4`).setAttribute('disabled', '')
            document.querySelector(`.imgp4`).classList.toggle('active')
            document.querySelector(`.removeicon4`).classList.toggle('active')
            return
        }
        if (document.querySelector(`.imgp4`).src[0] =='h'){
            document.querySelector(`#image4`).setAttribute('disabled', '')
            image.classList.toggle('active')
            document.querySelector(`.removeicon${option}`).classList.toggle('active')
        }
    }
    if (option == 4){
        const image = document.querySelector(`.imgp${option}`);
        document.querySelector(`.removeicon${option}`).classList.toggle('active')
        image.src = ''
        image.classList.toggle('active')
    }
}

function createpost(){
    let post = postdata()
    let postobject = {}
    if (post.text){
        if (post.image_4[0] == 'd' && post.image_3[0] == 'd' && post.image_2[0] == 'd' && post.image_1[0] == 'd'){
             postobject = {
                 'sourceId' : 0,
                 'posttext' : post.text,
                 'image_1' : post.image_1,
                 'image_2' : post.image_2,
                 'image_3' : post.image_3,
                 'image_4' : post.image_4,
                 "created_time": new Date().getDate() + new Date().getTime(),
                 "datetime": new Date().getDate() + new Date().getTime()
            }
        }
        if (post.image_4[0] == 'h' && post.image_3[0] == 'd' && post.image_2[0] == 'd' && post.image_1[0] == 'd'){
            postobject = {
                'sourceId' : 0,
                'posttext' : post.text,
                'image_1' : post.image_1,
                'image_2' : post.image_2,
                'image_3' : post.image_3,
                "created_time": new Date().getDate() + new Date().getTime(),
                "datetime": new Date().getDate() + new Date().getTime()
            }
        }
        if (post.image_4[0] == 'h' && post.image_3[0] == 'h' && post.image_2[0] == 'd' && post.image_1[0] == 'd'){
            postobject = {
                'sourceId' : 0,
                'posttext' : post.text,
                'image_1' : post.image_1,
                'image_2' : post.image_2,
                "created_time": new Date().getDate() + new Date().getTime(),
                "datetime": new Date().getDate() + new Date().getTime()
            }
        }
        if (post.image_4[0] == 'h' && post.image_3[0] == 'h' && post.image_2[0] == 'h' && post.image_1[0] == 'd'){
            postobject = {
                'sourceId' : 0,
                'posttext' : post.text,
                'image_1' : post.image_1,
                "created_time": new Date().getDate() + new Date().getTime(),
                "datetime": new Date().getDate() + new Date().getTime()
            }
        }
        if (post.image_1[0] == 'h'){
            postobject = {
                'sourceId' : 0,
                'posttext' : post.text,
                "created_time": new Date().getDate() + new Date().getTime(),
           "datetime": new Date().getDate() + new Date().getTime()
            }
            console.log(123)
            console.log(postobject)
        }
    }
    if (post.image_4 == 'd' && post.image_3 == 'd' && post.image_2 == 'd' && post.image1 == 'd'){
        postobject = {
            'sourceId' : 0,
            'image_1' : post.image_1,
            'image_2' : post.image_2,
            'image_3' : post.image_3,
            'image_4' : post.image_4,
            "created_time": new Date().getDate() + new Date().getTime(),
           "datetime": new Date().getDate() + new Date().getTime()
       }
   }
   if (post.image_4[0] == 'h' && post.image_3[0] == 'd' && post.image_2[0] == 'd' && post.image_1[0] == 'd'){
       postobject = {
           'sourceId' : 0,
           'image_1' : post.image_1,
           'image_2' : post.image_2,
           'image_3' : post.image_3,
           "created_time": new Date().getDate() + new Date().getTime(),
           "datetime": new Date().getDate() + new Date().getTime()
       }
   }
   if (post.image_4[0] == 'h' && post.image_3[0] == 'h' && post.image_2[0] == 'd' && post.image_1[0] == 'd'){
       postobject = {
           'sourceId' : 0,
           'image_1' : post.image_1,
           'image_2' : post.image_2,
           "created_time": new Date().getDate() + new Date().getTime(),
           "datetime": new Date().getDate() + new Date().getTime()
       }
   }
   if (post.image_4[0] == 'h' && post.image_3[0] == 'h' && post.image_2[0] == 'h' && post.image_1[0] == 'd'){
       console.log(post.image_1, post.image_2)
       postobject = {
           'sourceId' : 0,
           'image_1' : post.image_1,
           "created_time": new Date().getDate() + new Date().getTime(),
           "datetime": new Date().getDate() + new Date().getTime()
       }
   }
   if (!post.text && post.image_1[0] == 'h'){
       alert('Post must at least include text or an image')
       return
   }
    fetch(`https://clonebackend.herokuapp.com/post/${post.userid}/`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            postobject
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        alert('Post Made successfully')
        showposts()
    }
    )
    ;
}