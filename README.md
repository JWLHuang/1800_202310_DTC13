# Project Title

## 1. Project Description

State your app in a nutshell, or one-sentence pitch. Give some elaboration on what the core features are.  
This browser based web application to ...

## 2. Names of Contributors
List team members and/or short bio's here... 
- Hi, my name is Maddelin! I am excited about the project.
- hey I m vivian
- Hi my name is Jacky, I'm so excited for this project course.

## 3. Technologies and Resources Used

List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.

- HTML, CSS, JavaScript
- Bootstrap 5.0 (Frontend library)
- Bootstrap 4.3.1
- Firebase 8.0 (BAAS - Backend as a Service)
- Mapbox API
- Google Material Icons

## 4. Complete setup/installion/usage

State what a user needs to do when they come to your project. How do others start using your code or application?
Here are the steps ...

- Create an account with their email, name and password
- Go to profile and add preferences to filter out
- Return to main page to add things into their favorites or cart
- Click "Read more" to get detailed information regarding the products
- Click "Store Direction" to get redirected to map to display nearby stores

## 5. Known Bugs and Limitations

Here are some known bugs:

- History page is currently not active
- Shopping cart icon in product.html page not fully integrated
- ...

## 6. Features for Future

What we'd like to build in the future:

- QR/Barcode scanning for products
- Filtering stores by the amount of items available at each store
- Connection to real store APIs

## 7. Contents of Folder

Content of the project folder:

```
 Top level of project folder:
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
├── login.html               # login HTML file, redirects to firebase login api
├── main.html                # main login landing HTML file, the first page that users see if they are logged in
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /blah.jpg                # Acknowledge source
    /store1.jpeg             # https://lh3.googleusercontent.com/p/AF1QipNsTiC-LItlMF5fRdk83Lt6JMQLRtdm0NFyI88=s680-w680-h510
    /store2.jpeg             # https://lh5.googleusercontent.com/p/AF1QipPhR0sJQOQNE_6_E1KBu1I7mQZVoc6Z7-N8dOws=w426-h240-k-no
    /store3.jpeg             # https://lh3.googleusercontent.com/p/AF1QipNrYcF-dvGHOXo3jxT7viJYzPua6fNMFnGtwrhg=s680-w680-h510
├── scripts                  # Folder for scripts
    /authentication.js       # Initialize the FirebaseUI Widget using Firebase
    /favorite.js             # loads product cards associated with logged-in users favorites
    /firebase.js             # contains firebase API keys
    /history.js              # loads history of previous purchases (to be finished)
    /main.js                 # loads main landing page functions after login
    /map.js                  # loads function to display live location map, shows location of stores close to the user
    /preference.js           # loads function list of preferences for user to filter out
    /product.js              # loads function to display detailed product page of item selected by user
    /profile.js              # loads functions for personal profile page, can change personal information and picture; access preference, favorites, history
    /review.js               # creates entry form for reviews
    /script.js               # initiates logout function
    /shopping_cart.js        # loads product cards associated with items added by the logged-in users shopping cart
    /skeleton.js             # loads the footer, navbar, and copyright in context-specific pages

├── styles                   # Folder for styles
    /style.css               # contains all the CSS styling consistent throughout the app

├── text                     # Folder for html sub-files
    /copyright.html          # display copyright for our project
    /favorite.html           # display base page for favorites page
    /footer_after_login.html # display the after-login version of footer
    /footer_before_login.html# display the before-login version of footer
    /history.html            # display history page
    /map.html                # display map page
    /nav_after_login.html    # display the after-login nav bar
    /nav_before_login.html   # display the before-login nav bar
    /preference.html         # display the preference page
    /product.html            # display the product page
    /profile.html            # display the profile page
    /review.html             # display the review page
    /shopping_cart.html      # display the shopping cart

