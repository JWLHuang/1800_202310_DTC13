var currentUser;

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            console.log(currentUser);

            insertName();
            displayPreferences("preferencelist");
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
    })
}
// insertName(); //run the function


function writePreferences() {
    var preferenceList = db.collection("preferencelist");
    preferenceList.doc("sugar").set({});
    preferenceList.doc("flour").set({});
    preferenceList.doc("eggs").set({});
    preferenceList.doc("butter").set({});
    preferenceList.doc("vanilla").set({});
    preferenceList.doc("baking powder").set({});
    preferenceList.doc("salt").set({});
    preferenceList.doc("cherries").set({});
    preferenceList.doc("milk").set({});
    preferenceList.doc("soy").set({});
    preferenceList.doc("wheat").set({});
    preferenceList.doc("xanthan gum").set({});
    preferenceList.doc("artificial flavor").set({});
    preferenceList.doc("artificial color").set({});
    preferenceList.doc("coffee beans").set({});
    preferenceList.doc("preservatives").set({});
    preferenceList.doc("strawberries").set({});
    preferenceList.doc("pectin").set({});
    preferenceList.doc("paper").set({});
    preferenceList.doc("polyethylene terephthalate(PET) plastic").set({});
    preferenceList.doc("glass").set({});
    preferenceList.doc("nylon").set({});
}

// writePreferences();

function displayPreferences(collection) {
    let cardTemplate = document.getElementById("preferenceCardTemplate")
    db.collection(collection).get()
        .then(allPreferences => {
            allPreferences.forEach(doc => {
                var preference = doc.id;
                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector(".card-title").innerHTML = preference;

                newcard.querySelector('i').id = 'update-' + preference;
                newcard.querySelector('i').onclick = () => updatePreferences(preference);

                currentUser.get().then(userDoc => {
                    var preferences = userDoc.data().preferences;
                    if (preferences && preferences.includes(preference)) {
                        document.getElementById('update-' + preference).innerText = 'cancel';
                    }
                })

                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })
}

function updatePreferences(preference) {
    currentUser.get().then(userDoc => {
        var preferences = userDoc.data().preferences;
        if (preferences && preferences.includes(preference)) {
            currentUser.update({
                preferences: firebase.firestore.FieldValue.arrayRemove(preference)
            }, {
                merge: true
            })
                .then(function () {
                    console.log("preference has been removed for: " + currentUser);
                    var iconID = 'update-' + preference;
                    document.getElementById(iconID).innerText = 'check_circle_outline';
                });
        } else {
            currentUser.set({
                preferences: firebase.firestore.FieldValue.arrayUnion(preference)
            }, {
                merge: true
            })
                .then(function () {
                    console.log("preference has been saved for: " + currentUser);
                    var iconID = 'update-' + preference;
                    document.getElementById(iconID).innerText = 'cancel';
                });
        }
    })
}