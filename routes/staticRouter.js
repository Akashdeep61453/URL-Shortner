const express = require("express");
const URL = require("../models/url"); //imp
const router = express.Router();


router.get("/", async (req, res) => {
    if(!req.user) return res.redirec('/login')
    const allurls = await URL.find({ createdBy: req.user._id })
    return res.render("home",{
        urls: allurls,  //only those url's came that are generted by me
    });
});

router.get('/signup', (req, res) => {
    return res.render("signup");
});

router.get('/login',(req,res) => {
    return res.render("Login");
});

module.exports = router;