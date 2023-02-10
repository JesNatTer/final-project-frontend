// fetch(`https://clonebackend.herokuapp.com/user/${userId}/`)

const user = JSON.parse(window.localStorage['userdetails'])

async function userdata(){
    let userId = user.userId
    console.log(userId)
    const response = await fetch(`https://clonebackend.onrender.com/user/${userId}/`)
    const data = await response.json()

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
    document.querySelector('.profile-details').innerHTML = `
            <div class='profileuser'>
                <div class='user-icon'>
                    <img src='${userdetails.profile_image}' alt='Profile Image' />
                </div>
                <div class='profileuser-name-tag'>
                    <div class='profileuser-name'>${userdetails.username}</div>
                    <div class='profileuser-tag'>@${userdetails.tag}</div>
                </div>
                <div class='follows'>
                    <div class='profileuser-followings'>Following <span>${following.length}</span></div>
                    <div class='profileuser-followers'>Followers <span>${followers.length}</span></div>
                </div>
            </div>
            <div class='editdeletebuttons'>
            <div class='editbutton'>Edit Profile</div>
            <div class='deletebutton'>Delete Profile</div>
            </div>
        `;
        document.querySelector('.editbutton').addEventListener('click', showeditmodal)
        document.querySelector('.deletebutton').addEventListener('click', showdeletemodal)

    document.querySelector('#eusername').value = userdetails.username
    document.querySelector('#etag').value = userdetails.tag
    document.querySelector('#ebio').value = userdetails.bio
    document.querySelector('#efullname').value = userdetails.full_name
    document.querySelector('#epassword').value = userdetails.password

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
        document.querySelector('.postsbody').innerHTML += `
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
            </div> 
        </div>
        `;
        postclass()
        postliked(likeslist, post.postId)
    })

    // .then(res => res.json())
    // .then(data => {
        // console.log(data)
        // let userdetails = data.data
        // let posts = data.posts
        // let following
        // let followers
        // if (userdetails.following){
        //     following = userdetails['following'].substring(1).slice(0, -1).split(',')
        //     console.log('followings showing')
        // }
        // if (!userdetails.following){
        //     following = ''
        //     console.log('worked')
        // }
        // if (userdetails.followers){
        //     followers = userdetails['followers'].substring(1).slice(0, -1).split(',')
        //     console.log('followers showing')
        // }
        // if (!userdetails.followers){
        //     followers = ''
        //     console.log('worked')
        // }
        // document.querySelector('.profile-details').innerHTML = `
        //      <div class='profileuser'>
        //          <div class='user-icon'>
        //              <img src='${userdetails.profile_image}' alt='Profile Image' />
        //          </div>
        //          <div class='profileuser-name-tag'>
        //              <div class='profileuser-name'>${userdetails.username}</div>
        //              <div class='profileuser-tag'>@${userdetails.tag}</div>
        //          </div>
        //          <div class='follows'>
        //              <div class='profileuser-followings'>Following <span>${following.length}</span></div>
        //              <div class='profileuser-followers'>Followers <span>${followers.length}</span></div>
        //          </div>
        //      </div>
        //      <div class='editdeletebuttons'>
        //         <div class='editbutton'>Edit Profile</div>
        //         <div class='deletebutton'>Delete Profile</div>
        //      </div>
        //  `;
        //  document.querySelector('.editbutton').addEventListener('click', showeditmodal)
        //  document.querySelector('.deletebutton').addEventListener('click', showdeletemodal)

        // document.querySelector('#eusername').value = userdetails.username
        // document.querySelector('#etag').value = userdetails.tag
        // document.querySelector('#ebio').value = userdetails.bio
        // document.querySelector('#efullname').value = userdetails.full_name
        // document.querySelector('#epassword').value = userdetails.password

        // posts.forEach(post => {
        //     let likeslist
        //         if (post.liked_by){
        //             if (post['liked_by'].split().map(Number)[0]){
        //                 likeslist = post['liked_by'].split().map(Number)
        //                 console.log('not empty1')
        //             }
        //             else{
        //                 likeslist = post['liked_by'].toString().substring(1).slice(0, -1).split(', ')
        //                 console.log(likeslist)
        //                 console.log('not empty2')
        //             }
        //         }
        //         if (!post.liked_by){
        //             likeslist = ''
        //             console.log('empty')
        //         }
        //     document.querySelector('.postsbody').innerHTML += `
        //     <div class='post' id='post${post.postId}'>
        //         <div class='postleftsection'>
        //             <img src='${userdetails.profile_image}' alt='profile image'>
        //         </div>
        //         <div class='postrightsection'>
        //             <div class='postuserdetails'>
        //                 <div class='postusername'>
        //                     ${userdetails.username}
        //                 </div> 
        //                 <div class='posttag'>
        //                     @${userdetails.tag}
        //                 </div>
        //             </div>
        //             <div class='textandimage'>
        //                 <p class='ptext'>${post.text}</p>
        //                 <div class='postimages'>
        //                     <img src='${post.image1}' class='pimage1' alt='image1'/>
        //                     <img src='${post.image2}' class='pimage2' alt='image1'/>
        //                     <img src='${post.image3}' class='pimage3' alt='image1'/>
        //                     <img src='${post.image4}' class='pimage4' alt='image1'/>
        //                 </div>
        //                 <div class='timecreated'>${post.datetime}</div>
        //             </div>
        //         </div>
        //         <div class='bottomsection'>
        //             <div class='likepost lp${post.postId}' id='${post.postId}'>Like <span class='postlikes'>${likeslist.length}</span></div>
        //         </div> 
        //     </div>
        //     `;
        //     postclass()
        //     postliked(likeslist, post.postId)
        // })
    // })
//     // document.querySelector('.usermodalcontainer').innerHTML = document.querySelector(`#post${postid}`).innerHTML

}

userdata()


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

function postclass(){
    if (document.querySelector('.postsbody .post')){
        document.querySelectorAll('.postsbody .post').forEach( post => {
            console.log(post)
            if (post.querySelector('.ptext').innerHTML == 'null'){
                post.querySelector('.ptext').classList.add('notext')
                console.log('hmmm')
            }
            if (post.querySelector('.pimage4').src != 'http://127.0.0.1:5500/null'){
                post.querySelector('.postimages').classList.add('imgs4')
            }
            if (post.querySelector('.pimage1').src != 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage2').src != 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage3').src != 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage4').src == 'http://127.0.0.1:5500/null'){
                post.querySelector('.postimages').classList.add('imgs3')
                post.querySelector('.pimage4').classList.add('noimg')
                console.log('image 4 missing')
            }
            if (post.querySelector('.pimage1').src != 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage2').src != 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage3').src == 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage4').src == 'http://127.0.0.1:5500/null'){
                post.querySelector('.postimages').classList.add('imgs2')
                post.querySelector('.pimage4').classList.add('noimg')
                post.querySelector('.pimage3').classList.add('noimg')
            }
            if (post.querySelector('.pimage1').src != 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage2').src == 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage3').src == 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage4').src == 'http://127.0.0.1:5500/null'){
                post.querySelector('.postimages').classList.add('imgs1')
                post.querySelector('.pimage4').classList.add('noimg')
                post.querySelector('.pimage3').classList.add('noimg')
                post.querySelector('.pimage2').classList.add('noimg')
            }
            if (post.querySelector('.pimage1').src == 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage2').src == 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage3').src == 'http://127.0.0.1:5500/null' &&
                post.querySelector('.pimage4').src == 'http://127.0.0.1:5500/null'){
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
            if (post.querySelector('.ptext').innerHTML == 'null'){
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
            if (post.querySelector('.pimage1').src != 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage2').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage3').src == 'https://comms-sns.netlify.app/null' &&
                post.querySelector('.pimage4').src == 'https://comms-sns.netlify.app/null'){
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

function showeditmodal(){
    document.querySelector('.editmodal').classList.toggle('active')
}

function showdeletemodal(){
    document.querySelector('.deletemodal').classList.toggle('active')
}

function uploadimage() {
    const image = document.querySelector(`.convertedimage`);
    const file = document.querySelector(`#eproimage`).files[0];
    const reader = new FileReader();
      
    reader.addEventListener("load", function () {
      image.src = reader.result;
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
}

async function edituser(){
    const response = await fetch(`https://clonebackend.onrender.com/user/${user.userId}/`, {
        method:'PUT',
        body: JSON.stringify({
            "full_name": document.querySelector('#efullname').value,
            "username": document.querySelector('#eusername').value,
            "bio": document.querySelector('#ebio').value,
            "tag": document.querySelector('#etag').value,
            "password": document.querySelector('#epassword').value,
            "profile_image": document.querySelector('.convertedimage').src
        }),
        headers: {
            'Content-type': 'application/json',
        }
    })

    const data = await response.json()
    console.log(data);
    alert('Edit successful!')
    window.location.reload()


    // .then(res => res.json())
    // .then(data => {
    //     console.log(data);
    //     alert('Edit successful!')
    //     window.location.reload()
    // })
}

async function deleteuser(){
    const response = await fetch(`https://clonebackend.onrender.com/user/delete/${user.userId}/`)
    const data = await response.json()
    console.log(data);
    alert('Delete successful!')
    window.location.href = './index.html'
    
    // .then(res => res.json())
    // .then(data => {
    //     console.log(data);
    //     alert('Delete successful!')
    //     window.location.href = './index.html'
    // })

}
