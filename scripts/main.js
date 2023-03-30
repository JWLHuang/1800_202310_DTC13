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

function writeProducts() {
    //define a variable for the collection you want to create in Firestore to populate data
    var productRef = db.collection("products");

    productRef.add({
        code: "coffebeans",
        name: "coffee beans",
        store: "store1",  // get from database
        price: "price1", // get from database
        ingredients: "ingredients1",

        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    productRef.add({
        code: "cake",
        name: "cake",
        store: "store2", // get from database
        price: "price2", // get from database
        ingredients: "ingredients2",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2023"))
    });
    productRef.add({
        code: "strawberryjam",
        name: "strawberry jam",
        store: "store3",  // get from database
        price: "price3",  // get from database
        ingredients: "ingredients3",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2023"))
    });
}

// writeProducts();

function displayCardsDynamically() {
    console.log("displayCardsDynamically clicked")
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");

    db.collection("products").orderBy("name").get()   //the collection called "products"
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
                newcard.querySelector('.card-store').innerHTML = productStore;
                newcard.querySelector('.card-price').innerHTML = productPrice;
                newcard.querySelector('.card-text').innerHTML = productIngredients;
                newcard.querySelector('.card-time').innerHTML = productTime;
                newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`; //Example: cake.jpg
                newcard.querySelector('a').href = "product.html?docID=" + docID;

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery
                document.getElementById("products-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically();

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
    console.log("sortLowHigh clicked")
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");

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
                newcard.querySelector('.card-store').innerHTML = productStore;
                newcard.querySelector('.card-price').innerHTML = productPrice;
                newcard.querySelector('.card-text').innerHTML = productIngredients;
                newcard.querySelector('.card-time').innerHTML = productTime;
                newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`; //Example: cake.jpg
                newcard.querySelector('a').href = "product.html?docID=" + docID;

                //attach to gallery
                document.getElementById("products-go-here").appendChild(newcard);

            })
        })
}

function sortHighLow() {
    console.log("sortHighLow clicked")
    $("#products-go-here").empty()
    let cardTemplate = document.getElementById("productCardTemplate");
    let productCardGroup = document.getElementById("productCardGroup");

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
                newcard.querySelector('.card-store').innerHTML = productStore;
                newcard.querySelector('.card-price').innerHTML = productPrice;
                newcard.querySelector('.card-text').innerHTML = productIngredients;
                newcard.querySelector('.card-time').innerHTML = productTime;
                newcard.querySelector('.card-image').src = `./images/${productCode}.jpg`; //Example: cake.jpg
                newcard.querySelector('a').href = "product.html?docID=" + docID;
                // productCardGroup.appendchild(newcard);
                //attach to gallery
                document.getElementById("products-go-here").appendChild(newcard);

            })
        })
}