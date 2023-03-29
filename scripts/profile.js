function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) { // Will verify who is logged in
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            // console.log(user.displayName);  //print the user name in the browser console
            currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
            currentUser.get().then(userDoc => {
                //get the user name
                var userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); //jquery
                // document.getElementById("name-goes-here").innerText = userName;
                //method #1:  insert with html only
                //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
                //method #2:  insert using jquery
                $(".name-goes-here").text(userName); //using jquery
            })
        }
        // else {
        //     // No user is signed in.
        // }
    });
}
insertName(); //run the function


var currentUser;
var ImageFile;

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {// method to check who is the user in firebase
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userBirthday = userDoc.data().birthday;
                    var userAddress = userDoc.data().address;
                    var userPhone = userDoc.data().phone;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        // document.getElementById("nameInput").setAttribute("placeholder", userName);
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userBirthday != null) {
                        document.getElementById("birthdayInput").value = userBirthday;
                    }
                    if (userAddress != null) {
                        document.getElementById("addressInput").value = userAddress;
                    }
                    if (userPhone != null) {
                        document.getElementById("phoneInput").value = userPhone;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}
populateUserInfo();

function userImage() {
    ImageFile = event.target.files[0];
    console.log(ImageFile);
}


function defaultImage() {
    firebase.auth().onAuthStateChanged(user => {// method to check who is the user in firebase
        // Check if user is signed in:
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var Image = userDoc.data().profilePic;
                    console.log(Image);

                    //if the data fields are not empty, then write them in to the form.
                    if (Image != null) {
                        document.getElementById("mypic-goes-here").setAttribute("src", Image);
                    }
                });
        }
    })
}


defaultImage();
//call the function to run it 
// populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    firebase.auth().onAuthStateChanged(function (user) {
        var storageRef = firebase.storage().ref("images/" + user.uid + ".jpg");
        storageRef.put(ImageFile)
            .then(function () {
                console.log('Uploaded to Cloud Storage.');
                setTimeout(function () {
                    storageRef.getDownloadURL().then(function (url) {
                        console.log(url);
                        currentUser.update({
                            profilePic: url,
                        })
                    }, 3000)

                })
            })
        console.log("inside save UserInfo")
        var userName = document.getElementById("nameInput").value;
        var userBirthday = document.getElementById("birthdayInput").value;
        var userAddress = document.getElementById("addressInput").value;
        var userPhone = document.getElementById("phoneInput").value;


        // console.log(userName, userEmail);
        console.log(userName, userBirthday, userAddress, userPhone);
        currentUser.update({
            name: userName,
            birthday: userBirthday,
            address: userAddress,
            phone: userPhone,
             
        })
            .then(() => {
                console.log("Document successfully updated!");
            })


        document.getElementById('personalInfoFields').disabled = true;

    }
    )
};


//-------------------------------------------------
// This function asks user to confirm deletion:
// 1. remove document from users collection in firestore
// 2. THEN, remove auth() user from Firebase auth
//-------------------------------------------------
function deleteUser() {
    firebase.auth().onAuthStateChanged(user => {

        // Double check! Usability Heuristics #5
        var result = confirm("WARNING " + user.displayName +
            ": Deleting your User Account!!");

        // If confirmed, then go ahead
        if (result) {
            // First, delete from Firestore users collection 
            db.collection("users").doc(user.uid).delete()
                .then(() => {
                    console.log("Deleted from Firestore Collection");

                    // Next, delete from Firebase Auth
                    user.delete().then(() => {
                        console.log("Deleted from Firebase Auth.");
                        alert("user has been deleted");
                        window.location.href = "index.html";
                    }).catch((error) => {
                        console.log("Error deleting from Firebase Auth " + error);
                    });
                }).catch((error) => {
                    console.error("Error deleting user: ", error);
                });
        }
    })
}

//global variable to store the File Object reference

// function chooseFileListener() {
//     const fileInput = document.getElementById("mypic-input");   // pointer #1
//     const image = document.getElementById("mypic-goes-here");   // pointer #2

//     //attach listener to input file
//     //when this file changes, do something
//     fileInput.addEventListener('change', function (e) {

//         //the change event returns a file "e.target.files[0]"
//         ImageFile = e.target.files[0];
//         var blob = URL.createObjectURL(ImageFile);

//         //change the DOM img element source to point to this file
//         image.src = blob;    //assign the "src" property of the "img" tag
//     })
// }
// chooseFileListener();