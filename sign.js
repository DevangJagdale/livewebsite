async function fireconn()
{

    var token = config.MY_API_TOKEN;
    
    var firebaseConfig = {
      apiKey: token,
      authDomain: "huddle-cfbf8.firebaseapp.com",
      databaseURL: "https://huddle-cfbf8-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "huddle-cfbf8",
      storageBucket: "huddle-cfbf8.appspot.com",
      messagingSenderId: "208052007378",
      appId: "1:208052007378:web:5fc89ea6151c201cfd180b",
      measurementId: "G-WXZL1328T1"
      };
      // Initialize Firebase
     await firebase.initializeApp(firebaseConfig);
      console.log("connection established");
}

function myFunction()
{
  document.querySelector('.loader').style.visibility= "visible";
  window.location.href = "log.html";
}

function signup()
{
  document.querySelector('.loader').style.visibility= "visible";
  //fireconn();
  
    var email= document.getElementById("ename").value;
    var password= document.getElementById("pass").value;
    var username= document.getElementById("uname").value;
    
    firebase.auth().createUserWithEmailAndPassword(email, password).then((user)=>{
      firebase.database().ref('users/'+username).set({username:username,email:email}).then(function(){
        alert('User registered successfully proceed to login');
        document.querySelector('.loader').style.visibility= "hidden";
      }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        alert('User not registered');
        document.querySelector('.loader').style.visibility= "hidden";
     });
      var users = firebase.auth().currentUser;

      users.updateProfile({
        displayName: username,
      }).then(function() {
        console.log(users);
    console.log(users.displayName);
        console.log(users.displayName);
        var user = firebase.auth().currentUser;

      // user.sendEmailVerification().then(function() {
      //   // Email sent.
      // }).catch(function(error) {
      //   // An error happened.
      // });
      }).catch(function(error) {
        console.log(error.message);
      });
      // setTimeout(myFunction, 10000)
      // window.location.href = "log.html";

    }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
        document.querySelector('.loader').style.visibility= "hidden";
     });
}

function login()
{
  document.querySelector('.loader').style.visibility= "visible";
    //fireconn();
      var email= document.getElementById("ename").value;
      var password= document.getElementById("pass").value;
      
      firebase.auth().signInWithEmailAndPassword(email, password).then((user)=>{
        window.location.href = "home.html";
      }).catch(function(error) {
          console.log(error.code);
          console.log(error.message);
          alert(error.message);
          document.querySelector('.loader').style.visibility= "hidden";
       });
    

}

function logout()
{
  //fireconn();
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  }).catch((error) => {
    console.log(error.code);
          console.log(error.message);
          alert(error.message);
  });
}

async function checklogstatus()
{
  fireconn();
  document.querySelector('.loader1').style.visibility= "visible";
  await firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("user logged in");
  document.querySelector('.loader1').style.visibility= "hidden";
    } else {
      console.log("user not preset");
      window.location.href = "log.html";
    }
  });
}