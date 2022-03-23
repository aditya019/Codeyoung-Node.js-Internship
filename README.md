# Codeyoung-Node.js-Internship
Develop a web server that exposes an API to translate a text.

## Design and Decisions
I have used Node.js Express framework along with MongoDB and Mongoose for Back-End of the web server.
Instead of using an API directly I have used translate-google NPM package in my assignment. Google Translate API was asking for creating a billing account and I wasn't comfortable with that. I have used translate-google as it was free I did not have to create an account to use it.
I have used Ejs as my view engine.
Note : precache takes some time to fill, depending upon the internet speed so wait for a few seconds before using the precache feature.

### Homepage
When the user first enters the url a homepage appears that briefly describes the webpage.
In the homwpage there is a link Translate Text that lead the users to the form page which they can fill to translate the text.

### Translate Page
On clicking the Translate Text button in Homepage the users are taken to this page.
This page has a form with three feilds Text, from language and to language.
This form send a post request to /postText

### /postTxt
This part of the code handles the post request sebt from the translate page.
It first tries to find the text in the data base if found then is simply renders  the translated text.
It also calls the fillPreCache functions which qorks indepandently and fills the precache. Precache is not stored in the data base yet.
If the text is not found in the data base then it adds the text in the database and renders the text.

### Print Translate page
This page simply shoes the translated text to the users and also asks them if they want to see the translations of the same text.
If they want to translate the same text in some other language then /preCacheTranslate route is hit.

### /preCacheTranslate 
In this we simply retrieve the value to the translated text in precache and chech if it is present in the data base.
If present then we simly render it otherwise we store it in the data base and the render it.

## Set Up and Run 
To run it your sstem must have Node.js and MongoDB installed and also make sure you have installed all the NPM packages from package.jsom file.
Open command prompt and go to directory where the assignment is stored.
Then type node app.js to start the server.
You should see :
  Listening at port 3000
  Data Base Connected to App JS Language-Translations !!!
After a few seconds
Open the browser and go to ' http://localhost:3000/ '
Hopefully you will see the webpage and then go ahead and test it.

## Data Base cache schema.
const translationSchema = new Schema({
    fromLang: String,
    toLang : String,
    orignal : String,
    transText : String
});

## Result and Area of Improvement.
I have basically implemanted everything I was asked to implement.
There are some areas of improvement though.
* I think the user experience would be beter if the page did not reload every time a request was made.
* The data base chache schema could be imporved and optamized so that it can contain more data and also avoid duplication of data.
* eg => const translationSchema = new Schema({
          fromLang: String,
          toLang : String,
          orignal : String,
          transText : [String]
      });
      This schema will reduce dplication. I was not able to implement it due to lack of time.
* Ihave used translate-google NPM package that I suspect is reletively slower. So maybe I can change it.

