function displayproductInfo() {
    //retrieve the document id from the url
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("products")
        .doc(ID)
        .get()
        .then(doc => {
            productCode = doc.data().code;
            productName = doc.data().name;

            // only populate title, and image
            document.getElementById("productName").innerHTML = productName;
            let imgEvent = document.querySelector(".product-img");
            imgEvent.src = "./images/" + productCode + ".jpg";
        });
}
displayproductInfo();

// function saveProductDocumentIDAndRedirect() {
//     let params = new URL(window.location.href) //get the url from the search bar
//     let ID = params.searchParams.get("docID");
//     localStorage.setItem('productDocID', ID);
//     window.location.href = 'review.html';
// }

// function populateReviews() {
//     let productCardTemplate = document.getElementById("reviewCardTemplate");
//     let productCardGroup = document.getElementById("reviewCardGroup");

//     //let params = new URL(window.location.href) //get the url from the searbar
//     //let productID = params.searchParams.get("docID");
//     var productID = localStorage.getItem("productDocID");

//     // doublecheck: is your collection called "Reviews" or "reviews"?
//     db.collection("reviews").where("productDocID", "==", productID).get()
//         .then(allReviews => {
//             reviews = allReviews.docs;
//             console.log(reviews);
//             reviews.forEach(doc => {
//                 var title = doc.data().title; //gets the name field
//                 var level = doc.data().level; //gets the unique ID field
//                 var season = doc.data().season;
//                 var description = doc.data().description; //gets the length field
//                 var flooded = doc.data().flooded;
//                 var scrambled = doc.data().scrambled;
//                 var time = doc.data().timestamp.toDate();
//                 console.log(time)

//                 let reviewCard = productCardTemplate.content.cloneNode(true);
//                 reviewCard.querySelector('.title').innerHTML = title;     //equiv getElementByClassName
//                 reviewCard.querySelector('.time').innerHTML = new Date(time).toLocaleString();    //equiv getElementByClassName
//                 reviewCard.querySelector('.level').innerHTML = `level: ${level}`;
//                 reviewCard.querySelector('.season').innerHTML = `season: ${season}`;
//                 reviewCard.querySelector('.scrambled').innerHTML = `scrambled: ${scrambled}`;  //equiv getElementByClassName
//                 reviewCard.querySelector('.flooded').innerHTML = `flooded: ${flooded}`;  //equiv getElementByClassName
//                 reviewCard.querySelector('.description').innerHTML = `Description: ${description}`;
//                 productCardGroup.appendChild(reviewCard);
//             })
//         })
// }
// populateReviews();