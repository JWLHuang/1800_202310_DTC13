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
            var productStore = doc.data().store;  // get value of the "store" key
            var productPrice = doc.data().price;  // get value of the "store" key
            var productIngredients = doc.data().ingredients;  // get value of the "details" key
            var productPackaging = doc.data().packaging;  // get value of the "details" key
            var docID = doc.id;
            var docID = doc.id;

            // populate information
            document.getElementById("productName").innerHTML = productName;
            document.querySelector('.card-store').innerHTML = productStore;
            document.querySelector('.card-price').innerHTML = productPrice;
            document.querySelector('.card-ingredients').innerHTML = productIngredients;
            document.querySelector('.card-packaging').innerHTML = productPackaging;
            let imgEvent = document.querySelector(".product-img");
            imgEvent.src = "./images/" + productCode + ".jpg";

            document.querySelector("i").id = "save-" + docID
            document.querySelector("i").onclick = () => updateBookmark(docID)

            currentUser.get().then(userDoc => {
                //get the user name
                var bookmarks = userDoc.data().bookmarks;
                if (bookmarks.includes(docID)) {
                    document.getElementById('save-' + docID).innerText = 'bookmark';
                }
            })
        });
}
displayproductInfo();

function updateBookmark(id) {
    currentUser.get().then((userDoc) => {
        let bookmarksNow = userDoc.data().bookmarks;
        // console.log(bookmarksNow)

        // Check if bookmarksNow is defined and if this bookmark already exists in Firestore
        if (bookmarksNow && bookmarksNow.includes(id)) {
            console.log(id);
            // If it does exist, then remove it
            currentUser
                .update({
                    bookmarks: firebase.firestore.FieldValue.arrayRemove(id),
                })
                .then(function () {
                    console.log("This bookmark is removed for" + currentUser);
                    var iconID = "save-" + id;
                    console.log(iconID);
                    document.getElementById(iconID).innerText = "bookmark_border";
                });
        } else {
            // If it does not exist, then add it
            currentUser
                .set(
                    {
                        bookmarks: firebase.firestore.FieldValue.arrayUnion(id),
                    },
                    {
                        merge: true,
                    }
                )
                .then(function () {
                    console.log("This bookmark is for" + currentUser);
                    var iconID = "save-" + id;
                    console.log(iconID);
                    document.getElementById(iconID).innerText = "bookmark";
                });
        }
    });
}
// function saveBookmark(storeID) {
//     currentUser.get().then(userDoc => {
//         //get the user name
//         var bookmarks = userDoc.data().bookmarks;
//         if (bookmarks.includes(storeID)) {
//             removeBookmark(storeID);
//             document.getElementById('save-' + storeID).innerText = 'bookmark_border';
//         } else {
//             currentUser.set({
//                 bookmarks: firebase.firestore.FieldValue.arrayUnion(storeID)
//             }, {
//                 merge: true
//             })
//                 .then(function () {
//                     console.log("bookmark has been saved for: " + currentUser);
//                     var iconID = 'save-' + storeID;
//                     //console.log(iconID);
//                     //this is to change the icon of the hike that was saved to "filled"
//                     document.getElementById(iconID).innerText = 'bookmark';
//                 });
//         }
//     })
// }

// function removeBookmark(storeID) {
//     console.log("REMOVE bookmark function reached")
//     currentUser.set({
//         bookmarks: firebase.firestore.FieldValue.arrayRemove(storeID)
//     }, {
//         merge: true
//     })
//         .then(function () {
//             console.log("bookmark has been removed for: " + currentUser);
//             //console.log(iconID);
//             //this is to change the icon of the hike that was saved to "filled"
//             document.getElementById('save-' + storeID).innerText = 'bookmark_border';
//         });
// }

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
                db.collection("users").doc(userID).get()
                    .then(userDoc => {

                        console.log(userDoc.data().name)
                        var userName = userDoc.data().name;
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
        })
}
populateReviews();