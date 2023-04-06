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
                $(".name-goes-here").text(userName); //using jquery
            })
        }
    });
}
insertName(); //run the function

var productID = localStorage.getItem("productDocID");    //visible to all functions on this page
console.log(productID);

function getProductName(id) {
    db.collection("products")
        .doc(id)
        .get()
        .then(doc => {
            var productName = doc.data().name;
            document.getElementById("productName").innerHTML = productName; // points to the <h1> element
        });
}

getProductName(productID);

function showSliderValue() {
    var slider = document.getElementById("rebuyRatingSlider");
    var output = document.getElementById("rebuyRatingValue");
    output.innerHTML = slider.value; // Display the default slider value
    
    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        output.innerHTML = this.value;
    }
}

showSliderValue();

function writeReview() {
    console.log("inside write review")
    let Title = document.getElementById("title").value;
    let ProductRating = document.getElementById("productRating").value;
    let EnvironmentRating = document.getElementById("environmentRating").value;
    let HealthRating = document.getElementById("healthRating").value;
    let Description = document.getElementById("description").value;
    let RebuyRating = document.getElementById("rebuyRatingSlider").value;
    console.log(Title, ProductRating, EnvironmentRating, HealthRating, Description, RebuyRating);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    // var userEmail = userDoc.data().email;
                    db.collection("reviews").add({
                        productID: productID,
                        userID: userID,
                        title: Title,
                        productRating: ProductRating,
                        environmentRating: EnvironmentRating,
                        healthRating: HealthRating,
                        description: Description,
                        rebuyRating: RebuyRating,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }).then(() => {
                        window.location.href = "product.html?docID=" + productID;
                    })
                })
        } else {
            console.log("No user is signed in");
            window.location.href = 'index.html'; // redirect to login page
        }
    });
}