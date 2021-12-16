function fetchdata()
{
    var data;
  var user = firebase.auth().currentUser;
  ids=user.displayName;
  console.log(user.displayName);
     var ref = firebase.database().ref("users/"+ids+"/"+"groups");
ref.once("value")
  .then(function(snapshot) {
    data=snapshot.val();
    console.log(data);
  });

}