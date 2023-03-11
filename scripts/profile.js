var currentUser;

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
                    var userSchool = userDoc.data().email;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("emailInput").value = userEmail;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//call the function to run it 
populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    console.log("inside save UserInfo")

    var userName = document.getElementById("nameInput").value;
    // var userEmail = document.getElementById("emailInput").value;

    // console.log(userName, userEmail);
    console.log(userName);


    currentUser.update({
        name: userName,
        // email: userEmail,
    })
        .then(() => {
            console.log("Document successfully updated!");
        })


    document.getElementById('personalInfoFields').disabled = true;
}