//Aditya Prasad CodeYounge Node.js Internship Assignment
//Setting up basic requirement of the server.
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Translation = require('./models/translation');
// I have used translate-google npm package for this assignment
const googleTranslate = require('translate-google');

//concting to the local mongoDB server
mongoose.connect('mongodb://localhost:27017/language-translations');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Data Base Connected to App JS Language-Translations !!!');
});

//setting up the express app
const app = express();
//setting view engine to ejs
app.set('view engine', 'ejs');
// to get data from the forms.
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//initializing preCache and other required feilds
let preCache = {};
let orignalText, fromLanguage, toLanguage;

//function to fill precache
const fillPreCache = async (orignal, fromLang) => {
    const langs = ['en', 'fr', 'ko', 'hi', 'kn', 'ta'];
    console.log('Fill precache entered');
    for(let lang of langs) {
        await googleTranslate(orignal, {from: fromLang, to : lang}).then(res => {
            preCache[lang] = res;
            console.log(lang+ " precahed");
        }).catch(err => {
            console.log(err);
        })
    }
    console.log('pre chache filled !!!', preCache);
}

//Render homepage on '/' request
app.get('/', (req, res) => {
    //setting the value of prechache and other required feilds to precache
    preCache = {};
    orignalText = '';
    fromLanguage = '';
    toLanguage = '';
    res.render('homepage');
});

//Render translate page
app.get('/translate', (req, res) => {
    res.render('translate');
}); 

//post text from the form is received here
app.post('/postText', async (req, res) => {
    //form data stored in postReq
    const postReq = req.body.postReq;
    //searching the database
    const transDB = await Translation.findOne({orignal: postReq.orignal, fromLang: postReq.fromLang, toLang: postReq.toLang});
    //filling precache
    fillPreCache(postReq.orignal, postReq.fromLang);
    //setting up required feilds
    orignalText = postReq.orignal;
    fromLanguage = postReq.fromLang;
    toLanguage = postReq.toLang;
    //if found in data base then simply render it 
    if(transDB !== null) {
        console.log('translation found in DataBase');
        res.redirect(`/${transDB._id}/printTranslate`);
    } else {
        //else store the value in data base and then render the page
        let transText;
        await googleTranslate(postReq.orignal, {from: postReq.fromLang, to: postReq.toLang}).then(res => {
            transText = res;
        }).catch(err => {
            console.log(err);
        });
        console.log(transText);
        const newTranslate = new Translation({orignal: postReq.orignal, fromLang: postReq.fromLang, toLang:postReq.toLang, transText: transText});
        await newTranslate.save();
        console.log('DB updated !!');
        res.redirect(`/${newTranslate._id}/printTranslate`);
    }
});

//if the user requests the same text to be translated again then we find it in the precache that was filled before
app.post('/preCacheTranslate', async (req, res) => {
    let toLang = req.body.toLang;
    const transCache = preCache[toLang];
    const transDB = await Translation.findOne({orignal: orignalText, fromLang: fromLanguage, toLang: toLanguage, transText: transCache});
    if(transDB !== null) {
        console.log('precache translation found in DB');
        res.redirect(`/${transDB._id}/printTranslate`);
    } else {
        //we store the precache value only if the request was made
        const newTranslate = new Translation({orignal: orignalText, fromLang: fromLanguage, toLang: toLanguage, transText: transCache});
        await newTranslate.save();
        console.log('DB updated !!');
        res.redirect(`/${newTranslate._id}/printTranslate`);
    }
})

//Renders the translations
app.get('/:id/printTranslate', async (req, res, next) => {
    const id = req.params.id;
    const transDB = await Translation.findById(id);
    res.render('printTranslate', {transDB});
});

//setting up the local server
app.listen(3000, () => {
    console.log("Listening at port 3000");
});