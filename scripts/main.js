var currentUser;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            console.log(currentUser);

            insertName();
            displayCardsDynamically();;
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
        $(".name-goes-here").text(userName); //using jquery
    })
}
function writeProducts() {
    //define a variable for the collection you want to create in Firestore to populate data
    var productRef = db.collection("products");

    productRef.add({
        code: "coffebeans",
        name: "Coffee Beans",
        store: "store1",
        price: 10.95,
        ingredients: firebase.firestore.FieldValue.arrayUnion("coffee beans", "preservatives", "sugar", "paper"),
    });
    productRef.add({
        code: "cake",
        name: "Cake",
        store: "store2", // get from database
        price: 16.97,
        ingredients: firebase.firestore.FieldValue.arrayUnion("sugar", "flour", "eggs", "butter", "vanilla", "baking powder", "salt", "cherries", "milk", "soy", "wheat", "xanthan gum", "artificial flavor", "artificial color", "polyethylene terephthalate(PET) plastic"),

    });
    productRef.add({
        code: "strawberryjam",
        name: "Strawberry jam",
        store: "store3",  // get from database
        price: 5.49,
        ingredients: firebase.firestore.FieldValue.arrayUnion("sugar", "strawberries", "concentrated lemon juice", "pectin", "glass", "paper", "nylon"),

    });
}

// writeProducts()

// function displayCardsDynamically() {
//     console.log("displayCardsDynamically clicked")
//     $("#products-go-here").empty()
//     let cardTemplate = document.getElementById("productCardTemplate");

//     db.collection("products").orderBy("name").get()   //the collection called "products"
//         .then(allproducts => {
//             allproducts.forEach(doc => { //iterate thru each doc
//                 var productCode = doc.data().code;    //get unique ID to each product to be used for fetching right image
//                 var productName = doc.data().name;       // get value of the "name" key
//                 // var productStore = doc.data().store;  // get value of the "store" key
//                 var productPrice = doc.data().price;  // get value of the "store" key
//                 // var productIngredients = doc.data().ingredients;  // get value of the "details" key
//                 var docID = doc.id;
//                 let newcard = cardTemplate.content.cloneNode(true);

//                 //update title and text and image
//                 newcard.querySelector('.card-name').innerHTML = productName;
//                 // newcard.querySelector('.card-store').innerHTML = productStore;
//                 newcard.querySelector('.card-price').innerHTML = productPrice;
//                 // newcard.querySelector('.card-text').innerHTML = productIngredients;
//                 newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`; //Example: cake.jpg
//                 newcard.querySelector('a').href = "product.html?docID=" + docID;

//                 //attach to gallery
//                 document.getElementById("products-go-here").appendChild(newcard);

//             })
//         })
// }

// displayCardsDynamically();

function displayCardsDynamically() {
    console.log("displayCardsDynamically clicked")
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");
    currentUser.get().then(userDoc => {
        var preferences = userDoc.data().preferences;
        console.log(preferences);
        if (preferences.length != 0) {
            db.collection("products").where("ingredients", "array-contains-any", preferences).get()
                .then(avoidedProducts => {
                    filterList = [];
                    avoidedProducts.forEach(doc => {
                        filterList.push(doc.data().code);
                    })
                    console.log(filterList)
                    db.collection("products").where("code", "not-in", filterList).orderBy("code").orderBy("name").get()   //the collection called "products
                        .then(allproducts => {
                            //var i = 1;  //Optional: if you want to have a unique ID for each product
                            allproducts.forEach(doc => { //iterate thru each doc
                                var productCode = doc.data().code;    //get unique ID to each product to be used for fetching right image
                                var productName = doc.data().name;       // get value of the "name" key
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

                                document.getElementById("products-go-here").appendChild(newcard);
                            })
                        })
                })
        } else {
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

                        //attach to gallery
                        document.getElementById("products-go-here").appendChild(newcard);

                    })
                })

        }
    })
}

function saveFavourite(favouriteID) {
    currentUser.set({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(favouriteID)
    }, {
        merge: true
    })
        .then(function () {
            console.log("bookmark has been saved for: " + currentUser);
            var iconID = 'save-' + favouriteID;
            //console.log(iconID);
            //this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = 'favourite';
        });
}

function sortLowHigh() {
    console.log("lowHigh clicked")
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");
    currentUser.get().then(userDoc => {
        var preferences = userDoc.data().preferences;
        console.log(preferences);
        if (preferences.length != 0) {
            db.collection("products").where("ingredients", "array-contains-any", preferences).get()
                .then(avoidedProducts => {
                    filterList = [];
                    avoidedProducts.forEach(doc => {
                        filterList.push(doc.data().code);
                    })
                    console.log(filterList)
                    db.collection("products").where("code", "not-in", filterList).orderBy("code", "desc").orderBy("price", "desc").get()   //the collection called "products
                        .then(allproducts => {
                            //var i = 1;  //Optional: if you want to have a unique ID for each product
                            allproducts.forEach(doc => { //iterate thru each doc
                                var productCode = doc.data().code;    //get unique ID to each product to be used for fetching right image
                                var productName = doc.data().name;       // get value of the "name" key
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

                                document.getElementById("products-go-here").appendChild(newcard);
                            })
                        })
                })
        } else {
            db.collection("products").orderBy("price").get()   //the collection called "products"
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

                        //attach to gallery
                        document.getElementById("products-go-here").appendChild(newcard);

                    })
                })

        }
    })
}

function sortHighLow() {
    console.log("highLow clicked")
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");
    currentUser.get().then(userDoc => {
        var preferences = userDoc.data().preferences;
        console.log(preferences);
        if (preferences.length != 0) {
            db.collection("products").where("ingredients", "array-contains-any", preferences).get()
                .then(avoidedProducts => {
                    filterList = [];
                    avoidedProducts.forEach(doc => {
                        filterList.push(doc.data().code);
                    })
                    console.log(filterList)
                    db.collection("products").where("code", "not-in", filterList).orderBy("code").orderBy("price").get()   //the collection called "products
                        .then(allproducts => {
                            //var i = 1;  //Optional: if you want to have a unique ID for each product
                            allproducts.forEach(doc => { //iterate thru each doc
                                var productCode = doc.data().code;    //get unique ID to each product to be used for fetching right image
                                var productName = doc.data().name;       // get value of the "name" key
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

                                document.getElementById("products-go-here").appendChild(newcard);
                            })
                        })
                })
        } else {
            db.collection("products").orderBy("price","desc").get()   //the collection called "products"
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

                        //attach to gallery
                        document.getElementById("products-go-here").appendChild(newcard);

                    })
                })

        }
    })
}