//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('../text/nav_after_login.html'));
            console.log($('#footerPlaceholder').load('../text/footer_after_login.html'));
            console.log($('#copyrightPlaceholder').load('../text/copyright.html'));
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('../text/nav_before_login.html'));
            console.log($('#footerPlaceholder').load('../text/footer_before_login.html'));
            console.log($('#copyrightPlaceholder').load('../text/copyright.html'));
        }
    });
}
loadSkeleton(); //invoke the function