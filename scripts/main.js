var currentUser;
var currentBookmarks = [];
var currentShopCart = [];
var currentPreferences = [];

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            insertName();
            displayCardsDynamically();
        } else {
            console.log("No user is signed in.")
            window.location.href = "login.html";
        }
    });
}

doAll();

function insertName() {
    currentUser.get().then(userDoc => {
        var userName = userDoc.data().name;
        console.log(userName);
        $(".name-goes-here").text(userName);
        currentBookmarks = userDoc.data().bookmarks;
        currentShopCart = userDoc.data().shopCart;
        currentPreferences = userDoc.data().preferences;
    })
}

function writeProducts() {
    //define a variable for the collection you want to create in Firestore to populate data
    var productRef = db.collection("products");

    productRef.add({
        code: "coffebeans",
        name: "Coffee Beans",
        store: "Whole Foods Market",
        price: 10.95,
        ingredients: firebase.firestore.FieldValue.arrayUnion("coffee beans", "preservatives", "sugar", "paper"),
    });
    productRef.add({
        code: "cake",
        name: "Cake",
        store: "Walmart",
        price: 16.97,
        ingredients: firebase.firestore.FieldValue.arrayUnion("sugar", "flour", "eggs", "butter", "vanilla", "baking powder", "salt", "cherries", "milk", "soy", "wheat", "xanthan gum", "artificial flavor", "artificial color", "polyethylene terephthalate(PET) plastic"),

    });
    productRef.add({
        code: "strawberryjam",
        name: "Strawberry jam",
        store: "Real Canadian Superstore",
        price: 5.49,
        ingredients: firebase.firestore.FieldValue.arrayUnion("sugar", "strawberries", "concentrated lemon juice", "pectin", "glass", "paper", "nylon"),

    });
}

// writeProducts()


function displayCardsDynamically() {
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");
    currentUser.get().then(userDoc => {
        var preferences = userDoc.data().preferences;
        console.log(preferences);
        // check if the preference array is not empty
        if (preferences && preferences.length != 0) {
            // if the product contains any of the avoided ingredients, add it to a list of avoided products
            db.collection("products").where("ingredients", "array-contains-any", preferences).get()
                .then(avoidedProducts => {
                    filterList = [];
                    avoidedProducts.forEach(doc => {
                        filterList.push(doc.data().code);
                    })
                    console.log(filterList)
                    // get all products that are not in the list of avoided products and sort them by name ascending
                    db.collection("products").where("code", "not-in", filterList).orderBy("code").orderBy("name").get()
                        .then(allproducts => {

                            allproducts.forEach(doc => {
                                var productCode = doc.data().code;
                                var productName = doc.data().name;
                                var productPrice = doc.data().price;

                                var docID = doc.id;
                                let newcard = cardTemplate.content.cloneNode(true);

                                newcard.querySelector('.card-name').innerHTML = productName;
                                newcard.querySelector('.card-price').innerHTML = productPrice;
                                newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`;
                                newcard.querySelector('a').href = "./text/product.html?docID=" + docID;

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
                })
        } else {
            // if the user has no preferences, display all products then sort them by name ascending
            db.collection("products").orderBy("name").get()
                .then(allproducts => {
                    allproducts.forEach(doc => {
                        var productCode = doc.data().code;
                        var productName = doc.data().name;
                        var productPrice = doc.data().price;
                        var docID = doc.id;
                        let newcard = cardTemplate.content.cloneNode(true);

                        //update title and text and image
                        newcard.querySelector('.card-name').innerHTML = productName;
                        newcard.querySelector('.card-price').innerHTML = productPrice;
                        newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`;
                        newcard.querySelector('a').href = "./text/product.html?docID=" + docID;

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
    })
}


function sortLowHigh() {
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");
    currentUser.get().then(userDoc => {
        var preferences = userDoc.data().preferences;
        console.log(preferences);
        // check if the preference array is not empty
        if (preferences && preferences.length != 0) {
            // if the product contains any of the avoided ingredients, add it to a list of avoided products
            db.collection("products").where("ingredients", "array-contains-any", preferences).get()
                .then(avoidedProducts => {
                    filterList = [];
                    avoidedProducts.forEach(doc => {
                        filterList.push(doc.data().code);
                    })
                    console.log(filterList)
                    // get all products that are not in the list of avoided products then order by price descending
                    db.collection("products").where("code", "not-in", filterList).orderBy("code", "desc").orderBy("price", "desc").get()
                        .then(allproducts => {
                            allproducts.forEach(doc => {
                                var productCode = doc.data().code;
                                var productName = doc.data().name;
                                var productPrice = doc.data().price;
                                var docID = doc.id;
                                let newcard = cardTemplate.content.cloneNode(true);

                                //update title and text and image
                                newcard.querySelector('.card-name').innerHTML = productName;
                                newcard.querySelector('.card-price').innerHTML = productPrice;
                                newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`;
                                newcard.querySelector('a').href = "./text/product.html?docID=" + docID;

                                // sets icon in the product
                                newcard.querySelector('i.cart').id = "save-" + docID;
                                newcard.querySelector('i.favorite').id = "fav-" + docID;

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
                })
        } else {
            // if the user has no preferences, display all products then order by price ascending
            db.collection("products").orderBy("price").get()
                .then(allproducts => {
                    allproducts.forEach(doc => {
                        var productCode = doc.data().code;
                        var productName = doc.data().name;
                        var productPrice = doc.data().price;
                        var docID = doc.id;
                        let newcard = cardTemplate.content.cloneNode(true);

                        //update title and text and image
                        newcard.querySelector('.card-name').innerHTML = productName;
                        newcard.querySelector('.card-price').innerHTML = productPrice;
                        newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`;
                        newcard.querySelector('a').href = "./text/product.html?docID=" + docID;

                        // sets icon in the product
                        newcard.querySelector('i.cart').id = "save-" + docID;
                        newcard.querySelector('i.favorite').id = "fav-" + docID;

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
    })
}

function sortHighLow() {
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");
    currentUser.get().then(userDoc => {
        var preferences = userDoc.data().preferences;
        console.log(preferences);
        // check if the preference array is not empty
        if (preferences && preferences.length != 0) {
            // if the product contains any of the avoided ingredients, add it to a list of avoided products
            db.collection("products").where("ingredients", "array-contains-any", preferences).get()
                .then(avoidedProducts => {
                    filterList = [];
                    avoidedProducts.forEach(doc => {
                        filterList.push(doc.data().code);
                    })
                    console.log(filterList)
                    // get all products that are not in the list of avoided products then order by price descending
                    db.collection("products").where("code", "not-in", filterList).orderBy("code").orderBy("price").get()
                        .then(allproducts => {

                            allproducts.forEach(doc => {
                                var productCode = doc.data().code;
                                var productName = doc.data().name;
                                var productPrice = doc.data().price;
                                var docID = doc.id;
                                let newcard = cardTemplate.content.cloneNode(true);

                                //update title and text and image
                                newcard.querySelector('.card-name').innerHTML = productName;
                                newcard.querySelector('.card-price').innerHTML = productPrice;
                                newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`;
                                newcard.querySelector('a').href = "./text/product.html?docID=" + docID;

                                // sets icon in the product
                                newcard.querySelector('i.cart').id = "save-" + docID;
                                newcard.querySelector('i.favorite').id = "fav-" + docID;

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
                })
        } else {
            // if the user has no preferences, display all products then order by price descending
            db.collection("products").orderBy("price", "desc").get()
                .then(allproducts => {
                    allproducts.forEach(doc => {
                        var productCode = doc.data().code;
                        var productName = doc.data().name;
                        var productPrice = doc.data().price;
                        var docID = doc.id;
                        let newcard = cardTemplate.content.cloneNode(true);

                        //update title and text and image
                        newcard.querySelector('.card-name').innerHTML = productName;
                        newcard.querySelector('.card-price').innerHTML = productPrice;
                        newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`;
                        newcard.querySelector('a').href = "./text/product.html?docID=" + docID;

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
    })
}

function updateShoppingCart(id) {
    console.log("updateShoppingCart clicked with id", id)
    currentUser.get().then((userDoc) => {
        let cartNow = userDoc.data().shopCart;
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