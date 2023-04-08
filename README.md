# Project Title
EcoKart

## 1. Project Description
Our team, DTC13, is developing a web application to help consumers filter through products based on their preferences in order to make more environmentally-conscious decisions.

## 2. Names of Contributors
List team members and/or short bio's here... 
- Hi, my name is Maddelin! I am excited about the project.
- Hi , my name is Vivian. I am very excited to be working on this project.
- Hi my name is Jacky, I'm so excited for this project course.

## 3. Technologies and Resources Used

List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.

- HTML, CSS, JavaScript
- Bootstrap 5.0.2 (Frontend library) for JS and CSS CDN
- Bootstrap JS 4.3.1
- Popper JS 2.9.2
- Popper JS 1.14.7
- jQuery 3.5.1
- jQuery 3.3.1
- Firebase App, Firestore, Auth, Storage JS 8.10.0 (BaaS - Backend as a Service)
- Firebase JS UI 4.8.1
- Firebase CSS UI 4.8.1
- Mapbox API JS 2.7.0.
- Mapbox API CSS 2.7.0.
- Google Fonts (Quicksand)
- Google Material Icons
- Google Material Symbols

## 4. Complete setup/installion/usage

State what a user needs to do when they come to your project. How do others start using your code or application?
Here are the steps ...

- Create an account with their email, name and password
- Go to profile page and under the preferences tab, select/deselect ingredients/materials on the preference list to filter out
- Return to main page through the home button on the bottom navigation bar and click on the heart/shopping cart icons to add/remove products to/from their favorites or shopping cart
- Click "Read more" to get detailed information regarding the products
- Click "Store Direction" to get redirected to map to display nearby stores
- Click any of the bottom navigation bar to navigate to other pages
- In product information page, click "Write a Review" to write a review
- Go to profile and click on the "Edit" button to edit the user profile
- Click on the "Choose file" button to upload a profile picture
- Click on the "Save" button to save any changes
- At the bottom of the profile page, click on the "Delete Account" button to delete the user account

## 5. Known Bugs and Limitations

Here are some known bugs:

- History page is currently not active
- Users are not able to delete their own product review
- Users are not able to delete their profile picture
- Maps are not currently tied to available products

## 6. Features for Future

What we'd like to build in the future:

- QR/Barcode scanning for products
- Filtering stores by the amount of items available at each store
- Connection to real store APIs
- Adding a history page where users can click on specific dates and see what they purchased
- Alert message boxes so users can be notified of or warned for their actions, e.g. adding/removing a preference, saving their profile changes, etc.
- Community page where users can post advice, experience, or share news on certain product ingredients, packaging materials, and environmental issues
- Ensuring that users can remove their own review on a product
- Changing how users write product reviews (e.g. add interactive stars for their ratings, yes/no for “would buy again”)
- Review statistics at the top of the review list
- Separation between ingredients and packaging materials to make it more readable and clear for the users
- Better placement of certain elements
- Help page for Q&A

## 7. Contents of Folder

Content of the project folder:

```
 Top level of project folder:
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
├── login.html               # login HTML file, redirects to firebase login api
├── main.html                # main login landing HTML file, the first page that users see if they are logged in
├── .firebaserc              # file for hosting on Firebase
├── firebase.json            # file for hosting on Firebase
├── firestore.indexes.json   # file for hosting with Firestore
├── firestore.rules          # file for hosting with Firestore
├── storage.rules            # file for hosting with Firestore
├── 404.html                 # Error page, occurs when page is not found
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /store1.jpeg             # Source: https://lh3.googleusercontent.com/p/AF1QipNsTiC-LItlMF5fRdk83Lt6JMQLRtdm0NFyI88=s680-w680-h510
    /store2.jpeg             # Source: https://lh5.googleusercontent.com/p/AF1QipPhR0sJQOQNE_6_E1KBu1I7mQZVoc6Z7-N8dOws=w426-h240-k-no
    /store3.jpeg             # Source: https://lh3.googleusercontent.com/p/AF1QipNrYcF-dvGHOXo3jxT7viJYzPua6fNMFnGtwrhg=s680-w680-h510
    /logo.png                 # designed using Clip Studio Paint (former icon design)
    /logowhite.png            # designed using Clip Studio Paint (former icon design)
    /main_instruction.png     # desgined using Canva
    /welcomepage.png          # designed using Canva
    /cake.png                 # Source: https://www.pexels.com/photo/white-icing-covered-cake-in-bokeh-photography-1721932/
    /coffeebeans.jpg          # Source: https://www.pexels.com/photo/person-holding-brown-and-white-paper-bag-4829072/
    /strawberryjam.jpg        # Source: https://www.pexels.com/photo/glass-jar-with-raspberry-jam-5590958/
    /statement.png            # designed using Canva
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
└── text                     # Folder for html sub-files
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
