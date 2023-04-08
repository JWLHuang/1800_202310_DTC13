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
                $(".name-goes-here").text(userName);
            })
        }
    });
}
insertName(); //run the function

function displayproductInfo() {
    //retrieve the document id from the url
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"

    db.collection("products")
        .doc(ID)
        .get()
        .then(doc => {
            var productCode = doc.data().code;
            var productName = doc.data().name;
            var productStore = doc.data().store;
            var productPrice = doc.data().price;
            var productIngredients = doc.data().ingredients;
            var docID = doc.id;
            var docID = doc.id;

            // populate information
            document.getElementById("productName").innerHTML = productName;
            document.querySelector('.card-store').innerHTML = productStore;
            document.querySelector('.card-price').innerHTML = productPrice;
            document.querySelector('.card-ingredients').innerHTML = productIngredients;
            let imgEvent = document.querySelector(".product-img");
            imgEvent.src = "../images/" + productCode + ".jpg";

            document.getElementById("bookmark").onclick = () => updateBookmark(docID)
            document.getElementById("shopCart").onclick = () => updateShopCart(docID)

            currentUser.get().then(userDoc => {
                //get the user name
                var bookmarks = userDoc.data().bookmarks;
                if (bookmarks.includes(docID)) {
                    document.getElementById('bookmark').innerText = 'favorite';
                }
                var shopCart = userDoc.data().shopCart;
                if (shopCart.includes(docID)) {
                    document.getElementById('shopCart').innerText = 'remove_shopping_cart';
                }
            })
        });
}
displayproductInfo();

function updateBookmark(id) {
    currentUser.get().then((userDoc) => {
        let bookmarksNow = userDoc.data().bookmarks;

        // Check if bookmarksNow is defined and if this bookmark already exists in Firestore
        if (bookmarksNow && bookmarksNow.includes(id)) {
            // If it does exist, then remove it
            currentUser
                .update({
                    bookmarks: firebase.firestore.FieldValue.arrayRemove(id),
                })
                .then(function () {
                    document.getElementById("bookmark").innerText = "favorite_border";
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
                    document.getElementById("bookmark").innerText = "favorite";
                });
        }
    });
}

function updateShopCart(id) {
    currentUser.get().then((userDoc) => {
        let shopCartNow = userDoc.data().shopCart;
        // Check if shopCartNow is defined and if this bookmark already exists in Firestore
        if (shopCartNow && shopCartNow.includes(id)) {
            // If it does exist, then remove it
            currentUser
                .update({
                    shopCart: firebase.firestore.FieldValue.arrayRemove(id),
                })
                .then(function () {
                    document.getElementById("shopCart").innerText = "add_shopping_cart";
                });
        } else {
            // If it does not exist, then add it
            currentUser
                .set(
                    {
                        shopCart: firebase.firestore.FieldValue.arrayUnion(id),
                    },
                    {
                        merge: true,
                    }
                )
                .then(function () {
                    document.getElementById("shopCart").innerText = "remove_shopping_cart";
                });
        }
    });
}

function saveProductDocumentIDAndRedirect() {
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('productDocID', ID);
    window.location.href = 'review.html';
}

function populateReviews() {
    let productCardTemplate = document.getElementById("reviewCardTemplate");
    let productCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href) //get the url from the searbar
    let productID = params.searchParams.get("docID");
    db.collection("reviews").where("productID", "==", productID).get()
        .then(allReviews => {
            reviews = allReviews.docs;
            reviews.forEach(doc => {
                var userID = doc.data().userID;
                db.collection("users").doc(userID).get()
                    .then(userDoc => {
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
                        reviewCard.querySelector('.userName').innerHTML = userName;
                        reviewCard.querySelector('.title').innerHTML = title;
                        reviewCard.querySelector('.time').innerHTML = new Date(time).toLocaleString();
                        reviewCard.querySelector('.productRating').innerHTML = `Overall Rating: ${productRating}`;
                        reviewCard.querySelector('.environmentRating').innerHTML = `Eco-Friendliness: ${environmentRating}`;
                        reviewCard.querySelector('.healthRating').innerHTML = `Healthiness: ${healthRating}`;
                        reviewCard.querySelector('.description').innerHTML = `Description: ${description}`;
                        reviewCard.querySelector('.rebuyRating').innerHTML = `Will Buy Again: ${rebuyRating}`;
                        productCardGroup.appendChild(reviewCard);
                    })

            })
        })
}
populateReviews();