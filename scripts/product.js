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

function displayproductInfo() {
    //retrieve the document id from the url
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    db.collection("products")
        .doc(ID)
        .get()
        .then(doc => {
            var productCode = doc.data().code;
            var productName = doc.data().name;

            // only populate title, and image
            document.getElementById("productName").innerHTML = productName;
            let imgEvent = document.querySelector(".product-img");
            imgEvent.src = "./images/" + productCode + ".jpg";
        });
}
displayproductInfo();

function saveProductDocumentIDAndRedirect() {
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('productDocID', ID);
    window.location.href = 'review.html';
}

function populateReviews() {
    let productCardTemplate = document.getElementById("reviewCardTemplate");
    let productCardGroup = document.getElementById("reviewCardGroup");
    console.log("inside populate reviews")

    let params = new URL(window.location.href) //get the url from the searbar
    let productID = params.searchParams.get("docID");
    // var productID = localStorage.getItem("productDocID");
    console.log(productID)
    db.collection("reviews").where("productID", "==", productID).get()
        .then(allReviews => {
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach(doc => {
                var userID = doc.data().userID;
                console.log(userID)
                var reviewer = db.collection("users").doc(userID).get().then(
                    userDoc => {
                        var userName = userDoc.data().name;
                        return userName
                    });
                console.log(reviewer)
                var userName = reviewer;
                var title = doc.data().title;
                var productRating = doc.data().productRating;
                var environmentRating = doc.data().environmentRating;
                var healthRating = doc.data().healthRating;
                var description = doc.data().description;
                var rebuyRating = doc.data().rebuyRating;
                var time = doc.data().timestamp.toDate();
                console.log(time)

                let reviewCard = productCardTemplate.content.cloneNode(true);
                reviewCard.querySelector('.userName').innerHTML = userName;     //equiv getElementByClassName
                reviewCard.querySelector('.title').innerHTML = title;     //equiv getElementByClassName
                reviewCard.querySelector('.time').innerHTML = new Date(time).toLocaleString();    //equiv getElementByClassName
                reviewCard.querySelector('.productRating').innerHTML = `Overall Rating: ${productRating}`;
                reviewCard.querySelector('.environmentRating').innerHTML = `Eco-Friendliness: ${environmentRating}`;
                reviewCard.querySelector('.healthRating').innerHTML = `Healthiness: ${healthRating}`;  //equiv getElementByClassName
                reviewCard.querySelector('.description').innerHTML = `Description: ${description}`;
                reviewCard.querySelector('.rebuyRating').innerHTML = `Will Buy Again: ${rebuyRating}`;  //equiv getElementByClassName
                productCardGroup.appendChild(reviewCard);
            })
        })
}
populateReviews();