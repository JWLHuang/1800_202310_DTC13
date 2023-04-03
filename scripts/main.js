var currentBookmarks = [];
var currentShopCart = [];

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
                var userData = userDoc.data();
                var userName = userData.name;
                console.log(userName);
                //$("#name-goes-here").text(userName); //jquery
                // document.getElementById("name-goes-here").innerText = userName;
                //method #1:  insert with html only
                //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
                //method #2:  insert using jquery
                $(".name-goes-here").text(userName); //using jquery
                currentBookmarks = userData.bookmarks;
                currentShopCart = userData.shopCart;
            })
        }
        // else {
        //     // No user is signed in.
        // }
    });
}
insertName(); //run the function

function writeProducts() {
    //define a variable for the collection you want to create in Firestore to populate data
    var productRef = db.collection("products");

    productRef.add({
        code: "coffebeans",
        name: "Coffee Beans",
        store: "store1",
        price: 10.95,
        ingredients: firebase.firestore.FieldValue.arrayUnion("coffee beans", "preservatives", "sugar"),
        packaging: firebase.firestore.FieldValue.arrayUnion("paper"),
    });
    productRef.add({
        code: "cake",
        name: "Cake",
        store: "store2", // get from database
        price: 16.97,
        ingredients: firebase.firestore.FieldValue.arrayUnion("sugar", "flour", "eggs", "butter", "vanilla", "baking powder", "salt", "cherries", "milk", "soy", "wheat", "xanthan gum", "artificial flavor", "artificial color"),
        packaging: firebase.firestore.FieldValue.arrayUnion("polyethylene terephthalate(PET) plastic", "colored"),

    });
    productRef.add({
        code: "strawberryjam",
        name: "Strawberry jam",
        store: "store3",  // get from database
        price: 5.49,
        ingredients: firebase.firestore.FieldValue.arrayUnion("sugar", "strawberries", "concentrated lemon juice", "pectin"),
        packaging: firebase.firestore.FieldValue.arrayUnion("glass", "paper", "nylon"),

    });
}

// writeProducts();

// function updateProducts() {
//     //define a variable for the collection you want to create in Firestore to populate data
//     db.collection("products").where("code", "==", "coffebeans").get()
//     .then(productDoc => {
//         productField = productDoc.docs;
//         productField.set({
//             name: "Coffee Beans",
//             // store: "store1",
//             price: 10.95,
//             ingredientss: firebase.firestore.FieldValue.arrayUnion("coffee beans", "preservatives", "sugar"),
//             // packaging: firebase.firestore.FieldValue.arrayUnion("plastic"),
//         }, {
//             merge: true
//         });
//     });
// }

// updateProducts();

function displayCardsDynamically() {
    console.log("displayCardsDynamically clicked")
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");

    db.collection("products").orderBy("name").get()   //the collection called "products"
        .then(allproducts => {
            allproducts.forEach(doc => { //iterate thru each doc
                var productCode = doc.data().code;    //get unique ID to each product to be used for fetching right image
                var productName = doc.data().name;       // get value of the "name" key
                // var productStore = doc.data().store;  // get value of the "store" key
                var productPrice = doc.data().price;  // get value of the "store" key
                // var productIngredients = doc.data().ingredients;  // get value of the "details" key
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-name').innerHTML = productName;
                // newcard.querySelector('.card-store').innerHTML = productStore;
                newcard.querySelector('.card-price').innerHTML = productPrice;
                // newcard.querySelector('.card-text').innerHTML = productIngredients;
                newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`; //Example: cake.jpg
                newcard.querySelector('a').href = "product.html?docID=" + docID;
                // sets icon in the product
                newcard.querySelector('i.cart').id = "save-" + docID;
                newcard.querySelector('i.favorite').id = "fav-" + docID;
                //attach to gallery
                document.getElementById("products-go-here").appendChild(newcard);
                // attach updateShoppingCart function to the shopping cart button
                document.getElementById(`save-${docID}`).onclick = () => updateShoppingCart(docID);
                // attach updateFavorite function to the favorite button
                document.getElementById(`fav-${docID}`).onclick = () => updateFavorite(docID);
                // check if the product is in the user's shopping cart
                if (currentShopCart && currentShopCart.includes(docID)) {
                    document.getElementById(`save-${docID}`).innerText = 'remove_shopping_cart';
                } else {
                    document.getElementById(`save-${docID}`).innerText = 'add_shopping_cart';
                }
                // check if the product is in the user's bookmarks
                if (currentBookmarks && currentBookmarks.includes(docID)) {
                    document.getElementById(`fav-${docID}`).innerText = 'favorite';
                } else {
                    document.getElementById(`fav-${docID}`).innerText = 'favorite_border';
                }
            })
        })
}
displayCardsDynamically();

function sortLowHigh() {
    console.log("sortLowHigh clicked")
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");

    db.collection("products").orderBy("price").get()   //the collection called "products"
        .then(allproducts => {
            //var i = 1;  //Optional: if you want to have a unique ID for each product
            allproducts.forEach(doc => { //iterate thru each doc
                var productCode = doc.data().code;    //get unique ID to each product to be used for fetching right image
                var productName = doc.data().name;       // get value of the "name" key
                var productStore = doc.data().store;  // get value of the "store" key
                var productPrice = doc.data().price;  // get value of the "store" key
                var productIngredients = doc.data().ingredients;  // get value of the "details" key
                var productTime = doc.data().last_updated;    //get time
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-name').innerHTML = productName;
                // newcard.querySelector('.card-store').innerHTML = productStore;
                newcard.querySelector('.card-price').innerHTML = productPrice;
                // newcard.querySelector('.card-text').innerHTML = productIngredients;
                newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`; //Example: cake.jpg
                newcard.querySelector('a').href = "product.html?docID=" + docID;
                // sets icon in the product
                newcard.querySelector('i.cart').id = "save-" + docID;
                newcard.querySelector('i.favorite').id = "fav-" + docID;
                //attach to gallery
                document.getElementById("products-go-here").appendChild(newcard);
                // attach updateShoppingCart function to the shopping cart button
                document.getElementById(`save-${docID}`).onclick = () => updateShoppingCart(docID);
                // attach updateFavorite function to the favorite button
                document.getElementById(`fav-${docID}`).onclick = () => updateFavorite(docID);
                // check if the product is in the user's shopping cart
                if (currentShopCart && currentShopCart.includes(docID)) {
                    document.getElementById(`save-${docID}`).innerText = 'remove_shopping_cart';
                } else {
                    document.getElementById(`save-${docID}`).innerText = 'add_shopping_cart';
                }
                // check if the product is in the user's bookmarks
                if (currentBookmarks && currentBookmarks.includes(docID)) {
                    document.getElementById(`fav-${docID}`).innerText = 'favorite';
                } else {
                    document.getElementById(`fav-${docID}`).innerText = 'favorite_border';
                }

            })
        })
}

function sortHighLow() {
    console.log("sortHighLow clicked")
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");
    let productCardGroup = document.getElementById("productCardGroup");

    db.collection("products").orderBy("price", "desc").get()   //the collection called "products"
        .then(allproducts => {
            //var i = 1;  //Optional: if you want to have a unique ID for each product
            allproducts.forEach(doc => { //iterate thru each doc
                var productCode = doc.data().code;    //get unique ID to each product to be used for fetching right image
                var productName = doc.data().name;       // get value of the "name" key
                var productStore = doc.data().store;  // get value of the "store" key
                var productPrice = doc.data().price;  // get value of the "store" key
                var productIngredients = doc.data().ingredients;  // get value of the "details" key
                var productTime = doc.data().last_updated;    //get time
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.card-name').innerHTML = productName;
                // newcard.querySelector('.card-store').innerHTML = productStore;
                newcard.querySelector('.card-price').innerHTML = productPrice;
                // newcard.querySelector('.card-text').innerHTML = productIngredients;
                newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`; //Example: cake.jpg
                newcard.querySelector('a').href = "product.html?docID=" + docID;
                // sets icon in the product
                newcard.querySelector('i.cart').id = "save-" + docID;
                newcard.querySelector('i.favorite').id = "fav-" + docID;
                //attach to gallery
                document.getElementById("products-go-here").appendChild(newcard);
                // attach updateShoppingCart function to the shopping cart button
                document.getElementById(`save-${docID}`).onclick = () => updateShoppingCart(docID);
                // attach updateFavorite function to the favorite button
                document.getElementById(`fav-${docID}`).onclick = () => updateFavorite(docID);
                // check if the product is in the user's shopping cart
                if (currentShopCart && currentShopCart.includes(docID)) {
                    document.getElementById(`save-${docID}`).innerText = 'remove_shopping_cart';
                } else {
                    document.getElementById(`save-${docID}`).innerText = 'add_shopping_cart';
                }
                // check if the product is in the user's bookmarks
                if (currentBookmarks && currentBookmarks.includes(docID)) {
                    document.getElementById(`fav-${docID}`).innerText = 'favorite';
                } else {
                    document.getElementById(`fav-${docID}`).innerText = 'favorite_border';
                }
            })
        })
}

function updateShoppingCart(id) {
    console.log("updateShoppingCart clicked with id", id)
    currentUser.get().then((userDoc) => {
        let cartNow = userDoc.data().shopCart;
        // console.log(cartNow)

        // Check if bookmarksNow is defined and if this bookmark already exists in Firestore
        if (cartNow && cartNow.includes(id)) {
            console.log("Removing from cart:", id);
            // If it does exist, then remove it
            currentUser
                .update({
                    shopCart: firebase.firestore.FieldValue.arrayRemove(id),
                })
                .then(function () {
                    currentShopCart.filter(id => id !== id);
                    document.getElementById(`save-${id}`).innerText = "add_shopping_cart";
                });
        } else {
            console.log("Adding to cart:", id);
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
                    currentShopCart.push(id);
                    document.getElementById(`save-${id}`).innerText = "remove_shopping_cart";
                });
        }
    });
}

function updateFavorite(id) {
    console.log("updateFavorite clicked with id", id)
    currentUser.get().then((userDoc) => {
        let bookmarksNow = userDoc.data().bookmarks;
        // console.log(bookmarksNow)

        // Check if bookmarksNow is defined and if this bookmark already exists in Firestore
        if (bookmarksNow && bookmarksNow.includes(id)) {
            console.log("Removing from bookmarks:", id);
            // If it does exist, then remove it
            currentUser
                .update({
                    bookmarks: firebase.firestore.FieldValue.arrayRemove(id),
                })
                .then(function () {
                    currentBookmarks.filter(id => id !== id);
                    document.getElementById(`fav-${id}`).innerText = "favorite_border";
                });
        } else {
            console.log("Adding to bookmarks:", id);
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
                    currentBookmarks.push(id);
                    document.getElementById(`fav-${id}`).innerText = "favorite";
                });
        }
    });
}