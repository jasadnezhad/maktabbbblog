var express = require('express');
var router = express.Router();
const User = require('../modules/user');
const passport = require('passport')
const bodyParser = require('body-parser');
const uuidv4 = require('uuid/v4')
const jwt=require('jsonwebtoken') 
const JWTstrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;
//------------------------verify kardan karbar bbeinim token darad ya na -----------------------\\


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzllNzA3ZDhkMzNiOTNiZjA4YjUzYWUiLCJpYXQiOjE1NTM4OTA2OTJ9.gzwPC14KXIrNf_fD8avyum4U3hFeLbKviyu76rgqgV8"


router.post('/Create', function (req, res) {
    console.log("uuuu");
    
    console.log("MAMAMAM"+req.headers+"MAMAMA")
    if(req.body.secretKey == 333 ){
        var uu = uuidv4().toString();
    let admin = new User({
        isAdmin:1,
        userName: req.body.username,
        password: req.body.password,
        image:"admin.jpg",
        firstName: "Admin",
        lastName: "Admin",
        phoneNumber: uu,
        gender: "1"

    });
    admin.save(function (err) {
        if (err) {
            console.log(err)
            res.send(404)
        }


    })
    res.json("successfull, now go to login page");
}else {
    
    res.json("You cant be admin!");
}
});
// router.post('/login',function(req,res){
//   User.findOne({userName:req.body.username},function(err,Admin){
//       if(!Admin)
//       {
//           res.json("wrong username")
//       }
//       if( Admin.password != req.body.password){
//           res.json("wrong pass");
//       }
      ////admin._id ra beriz toye variable be name _id 
      ////bayad be onvan vorodi aval behesh object bedim baraye hamin rikhtim toye payload 
    //   var payload={_id:Admin._id};
     ///token ra hash mikonad ba tabe sign()
    //   var token=jwt.sign(payload,'secret');
      ///dar hedear http  in token ro ba megdar token dar cookie ba in dastoor zakhire mikonad
        // res.cookie('token', token) ;
    //   req.login(admin,function(err){
    //       if(err)
    //         throw err;
    //   });
   
//       res.json("you loggedin Token:"+token+"cookie:"+req.cookies['token']);

      
      
    
     
//   })

// }) 
//  router.post('/adminlogoff',function(req,res){
//         console.log("poi");
//         // res.cookie('token', "") ;
//         res.clearCookie("token");
//         req.logout();
//         res.redirect("/")
        
//   });

module.exports = router;