const mystorage = window.localStorage
let userlogin = JSON.parse(mystorage['userdetails'])


function postdata(){
    let postobject = {}
    postobject['userid'] = userlogin.userId
    postobject['text'] = document.querySelector('#posttext').value
    postobject['image_1'] = document.querySelector('.imgp1').src
    postobject['image_2'] = document.querySelector('.imgp2').src
    postobject['image_3'] = document.querySelector('.imgp3').src
    postobject['image_4'] = document.querySelector('.imgp4').src
    postobject['source_id'] = 0
    return postobject
}

function profiledetails(){
    fetch(`https://clonebackend.herokuapp.com/user/${userlogin.userId}/`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        let following
        let followers
        let profile = data.data
        mystorage.setItem('logged-in-user', JSON.stringify(profile))
        if (profile.following){
            following = profile['following'].substring(1).slice(0, -1).split(',')
            console.log(following)
            console.log('followings showing')
        }
        if (!profile.following){
            following = ''
            console.log('worked')
        }
        if (profile.followers){
            followers = profile['followers'].substring(1).slice(0, -1).split(',')
            console.log('followers showing')
        }
        if (!profile.followers){
            followers = ''
            console.log('worked')
        }
        document.querySelector('.profile-details').innerHTML = `
            <div class='profileimg'>
                <img src='${profile.profile_image}' alt='profile img'/>
            </div>
            <div class='profilename-tag'>
                <div class='profileusername'>${profile.username}</div>
                <div class='profiletag'>${profile.tag}</div>
            </div>
            <i class="far fa-minus-square minus-button"></i>
            <div class='followings'>
                <div>
                    following <span>${following.length}</span>
                </div>
                <div>
                    followers <span>${followers.length}</span>
                </div>
            </div>
        `;
        document.querySelector('.profileimg img').addEventListener('click', gotoprofile)
        document.querySelector('.minus-button').addEventListener('click', profileblock)

    })
}

let user = JSON.parse(mystorage.getItem('logged-in-user'))

profiledetails()

console.log(userlogin.following)


function showposts(){
    userid = userlogin.userId
    fetch(`https://clonebackend.herokuapp.com/post/${userid}/`, {
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        console.log(data.data.length == 0)
        if (data.data == 0){
            document.querySelector('.postsbody').innerHTML = '<span class="noposts">Nothing here yet...</span>'
        }
        else{
            document.querySelector('.postsbody').innerHTML = ''
            data.data.forEach(post => {
                let likeslist
                if (post.liked_by){
                    if (post['liked_by'].split().map(Number)[0]){
                        likeslist = post['liked_by'].split().map(Number)
                        console.log('not empty1')
                    }
                    else{
                        likeslist = post['liked_by'].toString().substring(1).slice(0, -1).split(', ')
                        console.log(likeslist)
                        console.log('not empty2')
                    }
                }
                if (!post.liked_by){
                    likeslist = ''
                    console.log('empty')
                }
                document.querySelector('.postsbody').innerHTML += `
                <div class='post' id='post${post.postId}'>
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
                            <p class='ptext'>${post.text}</p>
                            <div class='postimages'>
                                <img src='${post.image1}' class='pimage1' alt='image1'/>
                                <img src='${post.image2}' class='pimage2' alt='image1'/>
                                <img src='${post.image3}' class='pimage3' alt='image1'/>
                                <img src='${post.image4}' class='pimage4' alt='image1'/>
                            </div>
                            <div class='timecreated'>${post.datetime}</div>
                        </div>
                    </div>
                    <div class='bottomsection'>
                        <div class='likepost lp${post.postId}' id='${post.postId}'>Like <span class='postlikes'>${likeslist.length}</span></div>
                        <div class='viewpost' id='${post.postId}'>View post</div>
                    </div> 
                </div>
                `;
                console.log(likeslist)
                postclass()
                postliked(likeslist, post.postId)
            });
            document.querySelectorAll('.viewpost').forEach(button => button.addEventListener('click', viewPost))
            document.querySelectorAll('.likepost').forEach(button => button.addEventListener('click', likepost))
        }}
    )
        
}

function postclass(){
    if (document.querySelector('.postsbody .post')){
        document.querySelectorAll('.postsbody .post').forEach( post => {
            console.log(post)
            if (post.querySelector('.ptext').innerHTML == 'https://comms-sns.netlify.app/null'){
                post.querySelector('.ptext').classList.add('notext')
                console.log('hmmm')
            }
            if (post.querySelector('.pimage4').src != 'https://comms-sns.netlify.app/null'){
                post.querySelector('.postimages').classList.add('imgs4')
            }
            if (post.querySelector('.pimage1').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage2').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage3').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage4').src == 'https://comms-sns.netlify.app/null'){
                post.querySelector('.postimages').classList.add('imgs3')
                post.querySelector('.pimage4').classList.add('noimg')
                console.log('image 4 missing')
            }
            if (post.querySelector('.pimage1').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage2').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage3').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage4').src == 'https://comms-sns.netlify.app/null'){
                post.querySelector('.postimages').classList.add('imgs2')
                post.querySelector('.pimage4').classList.add('noimg')
                post.querySelector('.pimage3').classList.add('noimg')
            }
            if (post.querySelector('.pimage1').src != 'https://comms-sns.netlify.app/https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage2').src == 'https://comms-sns.netlify.app/https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage3').src == 'https://comms-sns.netlify.app/https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage4').src == 'https://comms-sns.netlify.app/https://comms-sns.netlify.app/null'){
                post.querySelector('.postimages').classList.add('imgs1')
                post.querySelector('.pimage4').classList.add('noimg')
                post.querySelector('.pimage3').classList.add('noimg')
                post.querySelector('.pimage2').classList.add('noimg')
            }
            if (post.querySelector('.pimage1').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage2').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage3').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage4').src == 'https://comms-sns.netlify.app/null'){
                post.querySelector('.postimages').classList.add('noimg')
            }
            console.log('happened')
        })
    }else{
        console.log("didn't")
    }
    if (document.querySelector('.modalusercontainer .post')){
        document.querySelectorAll('.modalusercontainer .post').forEach( post => {
            console.log(post)
            if (post.querySelector('.ptext').innerHTML == 'https://comms-sns.netlify.app/null'){
                post.querySelector('.ptext').classList.add('notext')
                console.log('hmmm')
            }
            if (post.querySelector('.pimage4').src != 'https://comms-sns.netlify.app/null'){
                post.querySelector('.postimages').classList.add('imgs4')
                
            }
            if (post.querySelector('.pimage1').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage2').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage3').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage4').src == null){
                post.querySelector('.postimages').classList.add('imgs3')
                post.querySelector('.pimage4').classList.add('noimg')
                console.log('image 4 missing')
            }
            if (post.querySelector('.pimage1').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage2').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage3').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage4').src == 'https://comms-sns.netlify.app/null'){
                post.querySelector('.postimages').classList.add('imgs2')
                post.querySelector('.pimage4').classList.add('noimg')
                post.querySelector('.pimage3').classList.add('noimg')
            }
            if (post.querySelector('.pimage1').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage2').src == null &&
                post.querySelector('.pimage3').src == null &&
                post.querySelector('.pimage4').src == null){
                post.querySelector('.postimages').classList.add('imgs1')
                post.querySelector('.pimage4').classList.add('noimg')
                post.querySelector('.pimage3').classList.add('noimg')
                post.querySelector('.pimage2').classList.add('noimg')
            }
            if (post.querySelector('.pimage1').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage2').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage3').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage4').src == 'https://comms-sns.netlify.app/null'){
                post.querySelector('.postimages').classList.add('noimg')
            }
            console.log('happened')
        })
    }else{
        console.log("didn't")
    }
}

function likepost(e){
    let userid = user.userId
    let postid = e.target.id
    if (e.target.classList[2]){
        fetch(`https://clonebackend.herokuapp.com/post/unlike/${postid}`, {
            method:'PATCH',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                'userId': userid
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert('unlike successful')
            showposts()
        })
    }else{
        fetch(`https://clonebackend.herokuapp.com/post/like/${postid}`, {
            method:'PATCH',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                'userId': userid
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert('like successful')
            showposts()
        })
    }
}

function postliked(likes, postid){
    console.log(parseInt(likes))
    console.log(likes)
    console.log(postid)
    console.log(user.userId)
    console.log(likes.indexOf(user.userId))
    console.log(parseInt(likes) == user.userId)
    if (document.querySelector('.postsbody .post')){
        if (likes.length < 2){
            console.log('whoa')
            if (likes[0] == user.userId){
                document.querySelector(`.likepost.lp${postid}`).classList.add('liked')
                document.querySelector(`.likepost.lp${postid}`).innerHTML = `Liked <span class='postlikes'>${1}</span>`
                console.log(likes.length)
                console.log('post is liked')
            }
            else{
                document.querySelector(`.likepost.lp${postid}`).innerHTML = `Like <span class='postlikes'>${likes.length}</span>`

            }
        }
        if (likes.length > 1){
            console.log('here?')
            console.log(likes.includes(user.userId.toString()) == true)
            if (likes.includes(user.userId.toString()) == true){
                document.querySelector(`.likepost.lp${postid}`).classList.add('liked')
                document.querySelector(`.likepost.lp${postid}`).innerHTML = `Liked <span class='postlikes'>${likes.length}</span>`
            
                console.log(likes.length)
                console.log('post is liked')
            }
        }else{
            console.log('not liked')
        }
    }else{
        console.log("no posts")
    }
}

function userunfollow(){}

function postunlike(){}

showposts()

function showusers(){
    fetch(`https://clonebackend.herokuapp.com/user/`, {
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.querySelector('.users').innerHTML = ``
        data.data.forEach(user => {
            console.log(`followers => ${user.followers}`)
            let followers
            if (user.followers){
                if (user['followers'].split().map(Number)[0]){
                    followers = user['followers'].split().map(Number)
                    console.log(followers)
                    console.log('not empty 1')
                }
                else{
                    followers = user['followers'].substring().slice(0, -1).split(', ')
                    console.log(followers)
                    console.log("not empty more")
                }
            }
            if (!user.followers){
                followers = ''
                console.log('empty')
            }
            document.querySelector('.users').innerHTML += `
                <div class='user'>
                    <img src='${user.profile_image}' id='${user.userId}' alt='profile image'>
                    <div class='user-data'>
                        <span class='user-username'>${user.username}</span>
                        <span class='user-tag'>${user.tag}</span>
                    </div>
                    <div class='followbutton fl${user.userId}' id='${user.userId}'>follow</div>
                </div>
            `;
            userfollowed(followers, user.userId)
        });
        document.querySelectorAll('.followbutton').forEach(button => button.addEventListener('click', followuser))
        document.querySelectorAll('.user img').forEach(button => button.addEventListener('click', openusermodal))
    })
}

showusers()

function followuser(e){
    let followingid = e.target.id
    let userid = userlogin.userId
    if (e.target.classList[2]){
        fetch(`https://clonebackend.herokuapp.com/user/unfollow/${followingid}/${userid}/`, {
            method:'PATCH',
            headers: {
                'Content-type': 'application/json',
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert('unfollow successful')
            showusers()
        })
    }
    else{
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
        showusers()
    })
    }
}

function userfollowed(followers, userid){
    console.log(followers)
    if (document.querySelector('.users .user')){
        console.log('work')
        if (followers.length < 2){
            console.log('route1')
            if (followers[0] == user.userId){
                console.log(followers)
                document.querySelector(`.followbutton.fl${userid}`).classList.add('followed')
                document.querySelector(`.followbutton.fl${userid}`).innerHTML = 'Following'
            }else{
                document.querySelector(`.followbutton.fl${userid}`).innerHTML = 'Follow'
            }
        }
        if (followers.length > 1){
            console.log('route2')
            if (followers.includes(user.userId.toString())){
                document.querySelector(`.followbutton.fl${userid}`).classList.add('followed')
                document.querySelector(`.followbutton.fl${userid}`).innerHTML = 'Following'
            }
        }
        if (followers.length == 0){
            if (document.querySelector(`.followbutton.fl${userid}.followed`)){
                console.log('spotted')
                document.querySelector(`.followbutton.fl${userid}`).classList.remove('followed')
            }
            document.querySelector(`.followbutton.fl${userid}`).innerHTML = 'Follow'
        }
        else{
            console.log('not following anyone')
        }
    }else{
        console.log('users not loaded')
    }
}

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
    console.log(postdata())
    let postobject = {}
    if (post.text != ''){
        console.log('checking')
        if (post.image_4[0] == 'd' && post.image_3[0] == 'd' && post.image_2[0] == 'd' && post.image_1[0] == 'd'){
             postobject = {
                 'sourceId' : 0,
                 'posttext' : post.text,
                 'image1' : post.image_1,
                 'image2' : post.image_2,
                 'image3' : post.image_3,
                 'image4' : post.image_4
            }
        }
        if (post.image_4[0] == 'h' && post.image_3[0] == 'd' && post.image_2[0] == 'd' && post.image_1[0] == 'd'){
            postobject = {
                'sourceId' : 0,
                'posttext' : post.text,
                'image1' : post.image_1,
                'image2' : post.image_2,
                'image3' : post.image_3
            }
        }
        if (post.image_4[0] == 'h' && post.image_3[0] == 'h' && post.image_2[0] == 'd' && post.image_1[0] == 'd'){
            postobject = {
                'sourceId' : 0,
                'posttext' : post.text,
                'image1' : post.image_1,
                'image2' : post.image_2
            }
        }
        if (post.image_4[0] == 'h' && post.image_3[0] == 'h' && post.image_2[0] == 'h' && post.image_1[0] == 'd' && post.text != ''){
            postobject = {
                'sourceId' : 0,
                'posttext' : post.text,
                'image1' : post.image_1
            }
            console.log('worked')
        }
        if (post.image_1[0] == 'h'){
            postobject = {
                'sourceId' : 0,
                'posttext' : post.text
            }
        }
    }
    if (post.image_4[0] == 'd' && post.image_3[0] == 'd' && post.image_2[0] == 'd' && post.image_1[0] == 'd' && post.text == ''){
        postobject = {
            'sourceId' : 0,
            'image1' : post.image_1,
            'image2' : post.image_2,
            'image3' : post.image_3,
            'image4' : post.image_4
       }
       console.log('monkey')
   }
   if (post.image_4[0] == 'h' && post.image_3[0] == 'd' && post.image_2[0] == 'd' && post.image_1[0] == 'd' && post.text == ''){
       postobject = {
           'sourceId' : 0,
           'image1' : post.image_1,
           'image2' : post.image_2,
           'image3' : post.image_3
       }
   }
   if (post.image_4[0] == 'h' && post.image_3[0] == 'h' && post.image_2[0] == 'd' && post.image_1[0] == 'd' && post.text == ''){
       postobject = {
           'sourceId' : 0,
           'image1' : post.image_1,
           'image2' : post.image_2
       }
   }
   if (post.image_4[0] == 'h' && post.image_3[0] == 'h' && post.image_2[0] == 'h' && post.image_1[0] == 'd' && post.text == ''){
       console.log(post.image_1, post.image_2)
       postobject = {
           'sourceId' : 0,
           'image1' : post.image_1
       }
       console.log('here for some reason')
   }
   if (!post.text && post.image_1[0] == 'h'){
       alert('Post must at least include text or an image')
       return
   }
    fetch(`https://clonebackend.herokuapp.com/post/${post.userid}/`,{
        method:'POST',
        body: JSON.stringify(postobject),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        console.log(`here is post object`)
        console.log(postobject)
        console.log(post.text)
        alert('Post Made successfully')
        showposts()
    }
    )
    ;
}

function viewPost(e){
    let postid = e.target.id
    console.log(postid)
    document.querySelector('.postmodal').classList.toggle('active')
    document.querySelector('.postmodal .post').innerHTML = document.querySelector(`#post${postid}`).innerHTML
    document.querySelector('.postmodal .post').id = postid
    viewcomments()
}

function closepostmodal(){
    document.querySelector('.postmodal').classList.toggle('active')
}

function viewcomments(){
    let postid = document.querySelector('.postmodal .post').id
    fetch(`https://clonebackend.herokuapp.com/post/reply/${postid}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        console.log('monkey?')
        if (data.data){
            document.querySelector('.postcommentsbody').innerHTML = ''
            data.data.forEach(comment => {
                document.querySelector('.postcommentsbody').innerHTML += `
                    <div class='postcomment'>
                        <div class='com-usericon'>
                            <img src='${comment.profile_image}' alt='Profile image'/>
                        </div>
                        <div class='com-username-tag'>
                            <div class='com-username'>${comment.username}</div>
                            <div class='com-tag'>@${comment.tag}</div>
                        </div>
                        <div class='com-text'>
                            <p>${comment.text}</p>
                        </div>
                    </div>
                `    
            })
        }
        if(data.data.length == 0){
            document.querySelector('.postcommentsbody').innerHTML = '<div class="nocomments">Nothing here yet.</div>'
        }
    })
}

function addcomment(){
    let commenttext = document.querySelector('.addcommenttext').value
    if (commenttext == ''){
        alert('Comment must include text.')
        return
    }else{
        fetch(`https://clonebackend.herokuapp.com/post/reply/`,{
        method:'POST',
        body: JSON.stringify({
            'postId': document.querySelector('.postmodal .post').id,
            'userId':user.userId,
            'text': commenttext
        }),
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            viewcomments()
        })
    }
}

function openusermodal(e){
    let userId = e.target.id
    console.log(userId)
    document.querySelector('.usermodal').classList.toggle('active')
    fetch(`https://clonebackend.herokuapp.com/user/${userId}/`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        let userdetails = data.data
        let posts = data.posts
        let following
        let followers
        if (userdetails.following){
            following = userdetails['following'].substring(1).slice(0, -1).split(',')
            console.log('followings showing')
        }
        if (!userdetails.following){
            following = ''
            console.log('worked')
        }
        if (userdetails.followers){
            followers = userdetails['followers'].substring(1).slice(0, -1).split(',')
            console.log('followers showing')
        }
        if (!userdetails.followers){
            followers = ''
            console.log('worked')
        }
        document.querySelector('.modalusercontainer').innerHTML = `
            <div class='modaluser'>
                <div class='modaluser-icon'>
                    <img src='${userdetails.profile_image}' alt='Profile Image' />
                </div>
                <div class='modaluser-name-tag'>
                    <div class='modaluser-name'>${userdetails.username}</div>
                    <div class='modaluser-tag'>@${userdetails.tag}</div>
                </div>
                ${userdetails.bio ? `<div class='modaluser-bio'>${userdetails.bio}</div>` : ''}
                <div class='follows'>
                    <div class='modaluser-followings'>Following <span>${following.length}</span></div>
                    <div class='modaluser-followers'>Followers <span>${followers.length}</span></div>
                </div>
            </div>
        `;
        posts.forEach(post => {
            let likeslist
                if (post.liked_by){
                    if (post['liked_by'].split().map(Number)[0]){
                        likeslist = post['liked_by'].split().map(Number)
                        console.log('not empty1')
                    }
                    else{
                        likeslist = post['liked_by'].toString().substring(1).slice(0, -1).split(', ')
                        console.log(likeslist)
                        console.log('not empty2')
                    }
                }
                if (!post.liked_by){
                    likeslist = ''
                    console.log('empty')
                }
            document.querySelector('.modalusercontainer').innerHTML += `
            <div class='post' id='post${post.postId}'>
                <div class='postleftsection'>
                    <img src='${userdetails.profile_image}' alt='profile image'>
                </div>
                <div class='postrightsection'>
                    <div class='postuserdetails'>
                        <div class='postusername'>
                            ${userdetails.username}
                        </div> 
                        <div class='posttag'>
                            @${userdetails.tag}
                        </div>
                    </div>
                    <div class='textandimage'>
                        <p class='ptext'>${post.text}</p>
                        <div class='postimages'>
                            <img src='${post.image1}' class='pimage1' alt='image1'/>
                            <img src='${post.image2}' class='pimage2' alt='image1'/>
                            <img src='${post.image3}' class='pimage3' alt='image1'/>
                            <img src='${post.image4}' class='pimage4' alt='image1'/>
                        </div>
                        <div class='timecreated'>${post.datetime}</div>
                    </div>
                </div>
                <div class='bottomsection'>
                    <div class='likepost lp${post.postId}' id='${post.postId}'>Like <span class='postlikes'>${likeslist.length}</span></div>
                    <div class='viewpost' id='${post.postId}'>View post</div>
                </div> 
            </div>
            `;
            postclass()
        })
    })
    // document.querySelector('.usermodalcontainer').innerHTML = document.querySelector(`#post${postid}`).innerHTML

}

function closeusermodal(){
    document.querySelector('.usermodal').classList.remove('active')
}


function gotoprofile(){
    window.location.href = './myprofile.html'
}

function profileblock(){
    document.querySelector('.profile-post-block').classList.toggle('active')
}

function usersblock(){
    document.querySelector('.userscontainer').classList.toggle('active')
}