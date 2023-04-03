function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertName();
            getBookmarks(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();
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
        // else {
        //     // No user is signed in.
        // }
    });
}
// insertName(); //run the function

function getBookmarks(user) {

    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            // Get the Array of bookmarks
            var bookmarks = userDoc.data().bookmarks;

            // Get pointer the new card template
            let newcardTemplate = document.getElementById("savedCardTemplate");

            // Iterate through the ARRAY of bookmarked hikes (document ID's)
            bookmarks.forEach(ID => {
                db.collection("products")
                    .doc(ID)
                    .get()
                    .then(doc => {
                        var productName = doc.data().name; // get value of the "name" key
                        var productCode = doc.data().code; //get unique ID to each hike to be used for fetching right image
                        var productPrice = doc.data().price; //gets the price field
                        var productIngredient = doc.data().ingredients; //gets the price field

                        // currentUser.get().then(userDoc => {
                        //     //get the user name
                        //     var bookmarks = userDoc.data().bookmarks;
                        //     if (bookmarks.includes(docID)) {
                        //         document.getElementById('save-' + docID).innerText = 'bookmark';
                        //     }
                        // })

                        //clone the new card
                        let newcard = newcardTemplate.content.cloneNode(true);

                        //update title and some pertinant information
                        newcard.querySelector('div.card').id = `product-${ID}`;
                        newcard.querySelector('.card-name').innerHTML = productName;
                        newcard.querySelector('.card-price').innerHTML = productPrice;
                        newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`; //Example: NV01.jpg
                        newcard.querySelector('.card-ingredient').innerHTML = productIngredient;
                        newcard.querySelector('a').href = "product.html?docID=" + ID;
                        newcard.querySelector('i').id = "save-" + ID;

                        //Finally, attach this new card to the gallery
                        savedProductsCardGroup.appendChild(newcard);
                        document.getElementById(`save-${ID}`).onclick = () => updateBookmark(ID);
                    })
            })

        })
}

function updateBookmark(id) {
    currentUser.get().then((userDoc) => {
        let bookmarksNow = userDoc.data().bookmarks;
        // console.log(bookmarksNow)

        // Check if bookmarksNow is defined and if this bookmark already exists in Firestore
        if (bookmarksNow && bookmarksNow.includes(id)) {
            // If it does exist, then remove it
            currentUser
                .update({
                    bookmarks: firebase.firestore.FieldValue.arrayRemove(id),
                })
                .then(function () {
                    console.log("This bookmark is removed for" + currentUser);
                    savedProductsCardGroup.removeChild(document.getElementById(`product-${id}`));
                });
        }
    });
}