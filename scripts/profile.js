//call the function to run it 
populateUserInfo();

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    console.log("inside save UserInfo")

    var userName = document.getElementById("nameInput").value;
    var userSchool = document.getElementById("schoolInput").value;
    var userCity = document.getElementById("cityInput").value;

    console.log(userName, userSchool, userCity);


    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity
    })
        .then(() => {
            console.log("Document successfully updated!");
        })


    document.getElementById('personalInfoFields').disabled = true;