var selectedGroup;
var selectedCode;
var ids;
function mathcode()
{
    return Math.floor((Math.random() * 10000000) + 1);
}
function generatecode()
{
    var code=mathcode();
    document.getElementById("code").innerHTML=code;
    return code;
}

function creategroup()
{
    var name= document.getElementById("name").value;
    var code=generatecode();   
    var user = firebase.auth().currentUser;
    var ids=user.displayName;
    firebase.database().ref('groups/'+code).set({"Groupname":name,"Admin":[user.email],"Code":code, "member":[user.email]});
    firebase.database().ref('users/'+ids+"/"+"groups").update({[code]:"admin"});
    document.querySelector('#creat').style.visibility= "hidden";
    document.getElementById("createStatus").innerHTML="Group created";

}

function joingroup()
{
    var Enteredcode=document.getElementById("jointext").value;
    var data;
    
     var ref = firebase.database().ref("groups/");
ref.once("value")
  .then(function(snapshot) {
    data=snapshot.val();
    console.log(data);
    
    var i;
    var result = [];

  for(var j in data)
      result.push([j, data [j]]);

  for(i=0;i<result.length;i++)
  {
    var key = Object.keys(data)[i];
    
    
    var z=data[key].Code;
    console.log(typeof(z));
    console.log(z);
    console.log(Enteredcode);
    if(data[key].Code==Enteredcode)
      {
        var user = firebase.auth().currentUser;
        var ids=user.displayName;
        firebase.database().ref('groups/'+Enteredcode+"/"+"member").update({[user.uid]:[ids]});
        firebase.database().ref('users/'+ids+"/"+"groups").update({[Enteredcode]:"member"});
        document.getElementById("joinStatus").innerHTML="Group Joined";        
      }
  }
  
  });
}


function showgroups()
{
  document.querySelector('.loader1').style.visibility= "visible";
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
const div = document.querySelector('#mySidenav1');
removeAllChildNodes(div);


  var data;
  var user = firebase.auth().currentUser;
  ids=user.displayName;
  console.log(user.displayName);
     var ref = firebase.database().ref("users/"+ids+"/"+"groups");
ref.once("value")
  .then(function(snapshot) {
    data=snapshot.val();
    console.log(data);
    var i;
    var result = [];
    var user = firebase.auth().currentUser;
         
         console.log(user.displayName);
  for(var j in data)
      result.push([j, data [j]]);
  //console.log(result);

  for(i=0;i<result.length;i++)
  {
    var groupcode=result[i][0];
    console.log(groupcode);
    var ref1 = firebase.database().ref("groups/"+groupcode);
ref1.once("value")
  .then(function(snapshot) {
    data1=snapshot.val();
    console.log(snapshot.val().Groupname);
      var para1 = document.createElement("br");
      var element1 = document.getElementById("mySidenav1");
      element1.appendChild(para1);
      var para = document.createElement("a");
      para.style="color: white;font-size: 30px;";
      
      para.title=snapshot.val().Groupname;
      para.onclick=function(){
        selectedGroup=snapshot.val().Groupname;
        selectedCode=snapshot.val().Code;
        //alert(snapshot.val().Groupname);
        //console.log(selectedGroup);
        //selectedgrp(snapshot.val().Groupname)
        var para1 = document.createElement("h1");
        var modal1 = document.getElementById("showgroup");
        modal1.style.display = "block";
        
    
        var node1 = document.createTextNode(selectedGroup);
      para1.appendChild(node1);

      var element1 = document.getElementById("group_name");
      element1.appendChild(para1);
      var button = document.createElement('span');
      button.innerHTML = '<button id="but" class="btn btn-outline-danger" onclick="deletegroup('+selectedCode+')">Delete Group</button>';
      element1.appendChild(button);
      //var element3 = document.getElementById("messages");
      //button.appendChild(node4);
        //window.location.href = "groups.html";
        readchat(selectedCode);
      };
      var node = document.createTextNode(snapshot.val().Groupname);
      para.appendChild(node);

      var element = document.getElementById("mySidenav1");
      element.appendChild(para);
  });
  }
  document.querySelector('.loader1').style.visibility= "hidden";
  }
  );
}

function readchat(groupcode)
{
  console.log("reading");
  var user = firebase.auth().currentUser;
  firebase.database().ref("groups/"+groupcode+"/"+"chats").on("child_added", function (snapshot) {
    //console.log(snapshot.val().content);
    if(snapshot.val().uid==user.displayName)
    {
          var para2 = document.createElement("h6");
          var node2 = document.createTextNode(snapshot.val().uid);
          para2.style="position:relative; top:20px; color:blue";
          para2.appendChild(node2);

        var element2 = document.getElementById("messages");
        element2.appendChild(para2);

        var para3 = document.createElement("h4");
          var node3 = document.createTextNode(snapshot.val().content);
          para3.style="position:relative; top:20px; bottom:30px";
          para3.appendChild(node3);
        
       
        var breakline=document.createElement("br");

        element2.appendChild(para3);
        element2.appendChild(breakline);
    }
    else
    {
      var para2 = document.createElement("h6");
      var node2 = document.createTextNode(snapshot.val().uid);
      para2.style="position:relative; left:500px; top:20px; color: green;";
      para2.appendChild(node2);

    var element2 = document.getElementById("messages");
    element2.appendChild(para2);

    var para3 = document.createElement("h4");
      var node3 = document.createTextNode(snapshot.val().content);
      para3.style="position:relative; left:500px; top:20px; bottom:30px";
      para3.appendChild(node3);

    var element3 = document.getElementById("messages");
    element3.appendChild(para3);
    }
});
}


function sendchat()
{
  console.log(selectedCode);
      console.log(selectedGroup);
      var user = firebase.auth().currentUser;
  var ids=user.displayName;
      var Enteredmessage=document.getElementById("message").value;
  firebase.database().ref('groups/'+selectedCode+"/"+"chats").push({"content":[Enteredmessage],"uid":[user.displayName]});
  console.log("sent");
  document.getElementById("message").value="";
}


function deletegroup(selectedCode)
{
  console.log("delete");
  console.log(selectedCode);
  var ref = firebase.database().ref('groups/');
  ref.child(+selectedCode+"/").remove();
  var user = firebase.auth().currentUser;
  var ids=user.displayName;
  var ref = firebase.database().ref('users/'+ids+'/'+'groups');
  ref.child(+selectedCode+"/").remove();
}



function fetchdata()
{
    var data;
  var user = firebase.auth().currentUser;
  ids=user.displayName;
  console.log(user.displayName);
     var ref = firebase.database().ref("users/"+ids);
ref.once("value")
  .then(function(snapshot) {
    data=snapshot.val().username;
    console.log(data);
    var para3 = document.createElement("h4");
      var node3 = document.createTextNode(snapshot.val().username);
      para3.appendChild(node3);

    element3 = document.getElementById("view");
    element3.appendChild(para3);

    var para1 = document.createElement("h4");
      var node1 = document.createTextNode(snapshot.val().email);
      para1.appendChild(node1);

    var element1 = document.getElementById("view");
    element1.appendChild(para1);
  });

}

function success()
{
  console.log("done");
  var gender = document.getElementsByName("gender");
  var mobile = document.getElementById("mobile").value;
  var city = document.getElementById("city");
  var dob = document.getElementById("dob").value;
  var address = document.getElementById("address").value;
  const groups = document.querySelectorAll('#group option:checked');

  var user = firebase.auth().currentUser;
  ids=user.displayName;
console.log(city);
  firebase.database().ref("users/"+ids).push({"mobile":mobile});
  

}

function deleteaccount()
{
  console.log("delete");
  var txt;
  if (confirm("Are you sure you want to delete account!")) {
    
    var user = firebase.auth().currentUser;
  ids=user.displayName;
  firebase.database().ref("users/"+ids).remove();
  var user = firebase.auth().currentUser;

  user.delete().then(function() {
    // User deleted.
  }).catch(function(error) {
    // An error happened.
  });
  }
  
}