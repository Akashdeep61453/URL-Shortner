const express = require('express');
const { connectToMongoDB } = require('./connect');
const { restrictToLoggedinUserOnly, checkAuth } = require('./middleware/auth');

const path = require('path');//builtin module
const URL = require('./models/url');
const cookieParser = require('cookie-parser');

const urlRoute = require('./routes/url');
const staticRoute = require("./routes/staticRouter");
const userRoute = require('./routes/user');

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url').// connection to MongoDB NO SPACE
then(()=> console.log('Mongo DB connected')
);

app.set("view engine","ejs");  // for server side rendering using ejs engine
app.set('views', path.resolve("./views")); // Views, ejs files is in ./views

app.use(express.json());    //middlware JSON
app.use(express.urlencoded({ extended: false }));   // FORM middleware
app.use(cookieParser());
// app.get('/test', async (req,res)=>{
//     const allUrls = await URL.find({});
//     return res.render('home',{
//         urls: allUrls,
//     });
// });

app.use('/url',restrictToLoggedinUserOnly,urlRoute);
app.use('/user',userRoute);
app.use("/",checkAuth,staticRoute);

app.get('/url/:shortId', async (req,res) => {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );

    if (!entry) {
        return res.status(404).send('Short URL not found');
    }

    res.redirect(entry.redirectURL);
});
app.listen(PORT,()=> console.log(`Server started at Port : ${PORT}`));


// EJS
//install EJS
// tell application that view engine is EJS and views is in which
// directory
// And use res.render can also pass extra data, for each loops, if else