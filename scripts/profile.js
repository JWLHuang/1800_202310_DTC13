function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) { // Will verify who is logged in
            // Do something for the currently logged-in user here: 
            currentUser = db.collection("users").doc(user.uid); // will to to the firestore and go to the document of the user
            currentUser.get().then(userDoc => {
                //get the user name
                var userName = userDoc.data().name;
                console.log(userName);

                $(".name-goes-here").text(userName); //using jquery
            })
        }
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


function defaultImage() { //get the user picture from the firestore
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

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() { //save the user info to the firestore
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
        var userName = document.getElementById("nameInput").value;
        var userBirthday = document.getElementById("birthdayInput").value;
        var userAddress = document.getElementById("addressInput").value;
        var userPhone = document.getElementById("phoneInput").value;

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
        var result = confirm("WARNING " + ": Are you sure you want to DELETE your account!!");

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

$('.featureBtn').click(function () {
    // if the embed window is not the same as the button clicked, then change the embed window to the button clicked
    if (document.getElementById("embedWindow").getAttribute("src") == "preference.html") {
        $(".featureBtn").removeClass("border-bottom border-dark active_btn");
        // add class for active button css
        $("#preference").addClass("border-bottom border-dark active_btn");
    } else if (document.getElementById("embedWindow").getAttribute("src") == "favorite.html") {
        $(".featureBtn").removeClass("border-bottom border-dark active_btn");
        // add class for active button css
        $("#favorite").addClass("border-bottom border-dark active_btn");
    } else {
        $(".featureBtn").removeClass("border-bottom border-dark active_btn");
        // add class for active button css
        $("#history").addClass("border-bottom border-dark active_btn");
    }
})