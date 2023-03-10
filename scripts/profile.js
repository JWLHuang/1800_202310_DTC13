//call the function to run it 
populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    console.log("inside save UserInfo")

    var userName = document.getElementById("nameInput").value;
    var userEmail = document.getElementById("userEmail").value;

    console.log(userName, userEmail);


    currentUser.update({
        name: userName,
        email: userEmail
    })
        .then(() => {
            console.log("Document successfully updated!");
        })


    document.getElementById('personalInfoFields').disabled = true;

}