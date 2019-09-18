function hide() {
   document.getElementById("table").style.visibility="hidden";

   firebase.auth().signOut().then(function() {

}).catch(function(error) {
  // An error happened.
});

}

function logInClick()
{
  firebase.auth().signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value).then(function() {
// Sign-in successful.
              var user = firebase.auth().currentUser;

              if (user) {

              document.getElementById("table").style.visibility="visible";

              var elem = document.getElementById("table2");
               return elem.parentNode.removeChild(elem);
              user = "";
              }
              }).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorMessage);
                  alert(errorMessage);
                  // ...

                });


}
  function sendData() {
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    var price = document.getElementById("price").value;
    var quantity = document.getElementById("quantity").value;
    var favorite = document.getElementById("favorite").value;




    if (name == "" || description == "" || price == "" || quantity == "" || favorite == "" )
    {
      alert("Fields are not valid");
    }
    else {

  var t = "Men";
    if (document.getElementById("male").checked)
    {
      t = 'Men';
    }
    else if (document.getElementById("female").checked){
      t = 'Women';
    }
    else if (document.getElementById("kids").checked){
      t = 'Kids';
    }

    var names = "";

    var db = firebase.firestore();
    var file = document.getElementById("images");
    file.onchange = function(event) {
      var fileList = file.files;


      var metadata = {
        contentType: 'image/jpeg'
      };
      var storageRef = firebase.storage().ref();

      switch (t) {
        case "Men":
          names = "MensShirtsImages/";
          break;
        case "Women":
          names = "WomensShirtsImages/";
          break;
        case "Kids":
          names = "KidsShirtsImages/";
          break;
      }




      var uploadTask = storageRef.child(names + fileList[0].name).put(fileList[0], metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        },
        function(error) {



        },
        function() {
          // Upload completed successfully, now we can get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            let shirtsRef = db.collection('JsosShirts').doc(t).collection("AllShirts");

            shirtsRef.add({
              favorite: false,
              description: description,
              image: downloadURL,
              name: name,
              price: Number(price),
              quantity: Number(quantity),
              ID: shirtsRef.id
            }).then(function(docRef) {
    db.collection('JsosShirts').doc(t).collection("AllShirts").doc(docRef.id).update({ID: docRef.id});
});


          });
        });
    }
  }
  }