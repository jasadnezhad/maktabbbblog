var express = require('express');
var router = express.Router();
var path = require('path');
const User = require('../modules/user');
const Article = require('../modules/article');
const Upload = require('./uploadMiddleware');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const up = require('../routes/uploadMiddleware');
var rimraf = require("rimraf");


router.get('/', function (req, res) {
    User.findOne({
        _id: req.user.id
    }, function (err, user) {
        console.log("imim" + user.image);
        res.render('Profile', {
            profile: user
        })
    });
    //dar in router etelate ro az db khondim va be view ferestadim 
    //inja nabayad new konim bayad bar asas id db oon user ro peyda konim va moshakasatessh ro ke toye "user" 
    // beferstime baray view

})


router.post('/editprofile', up.single('image'), function (req, res) {
   
    // var img;
    // if (!req.file) {
    //     console.log("666");
    //     if (req.body.perimg == "placeholder-avatar.jpg")
    //         img = "placeholder-avatar.jpg";
    //     else
    //         img = req.body.perimg;

    // } else {
    //     console.log("777");
    //     if(req.body.perimg !=  "placeholder-avatar.jpg"){
    //     rimraf("public/imageUploads/" + req.body.perimg, function () {
    //         console.log("done");
    //     });
    // }
    //     img = req.file.filename;
    // }
    var im;
    if(!req.file){//agar aks avaz nashod hamoon aks qabli bemone avaz shod  bere to else
    //   console.log("saaadat"+req.body.perimg);
     im=req.body.perimg;//perimg input type hidden toye modal dash ejs ke esme aks qabli ro dare 
    }
    else{
    //   rimraf("public/imageUploads/"+req.body.perimg, function () { console.log("done"); });//mire aks qbli ro az bikh pak mikone
      im=req.file.filename //aks jadid mishavaad
    }
    console.log("")
    User.updateOne({
        _id: req.user.id
    }, {
        $set: {
            
            image: im,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            gender:req.body.gender
        }
    }, function (err, res) {

        if (err) {
            throw err;
        }
        console.log("table updated");
    });
    console.log("ooooooooooosssssssssssss" + req.user.userName)

    res.redirect('http://localhost:3000/users/dashboard');
});
module.exports = router;