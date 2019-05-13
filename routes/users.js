var express = require('express');
var router = express.Router();

const User = require('../modules/user');
const Article = require('../modules/article');
// const Upload = require('./uploadMiddleware');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const up = require('../routes/uploadMiddleware');

const jwt = require('jsonwebtoken')


const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


var cookieExtractor = function (req) {
    var token = null;
    //req darkhasti ke omadeh va toye req.header, header oon basteh garar migirad va dar body  html va forn ha hast 
    //ba body parser req.body kar mikonad
    if (req && req.cookies) token = req.cookies['token'];
    console.log("ext" + token)
    return token;
};

// const jwt=require('jsonwebtoken') 
// const JWTstrategy=require('passport-jwt').Strategy;
// const ExtractJWT=require('passport-jwt').ExtractJwt;
//baray verify kardan token bkar miravad va dar halat middleware kar mikonim bahash 
var opt = {}

//hamishe bayad token bere tosh oonam hash shodeh
opt.jwtFromRequest = cookieExtractor;


opt.secretOrKey = "secret";

passport.use(new JWTstrategy(opt, function (jwt_payload, done) {


   
    console.log(jwt_payload._id);
    console.log("1122");
    User.findOne({
        _id: jwt_payload._id
    }, function (err, user) {
        if (user) {
           
            return done(null, user);
        } else {
            
            return done(null, false);
        }
    });
}))

var flag;



passport.use('user-logins', new LocalStrategy({ //baray authenticate kardan dar local strategy bayad input ha nameshan  username , password bashad agar nabood baray taghir deafault bayad  azz in ravesh estefade kard  
        usernameField: 'userName',
        passwordField: 'password'
    },
    function (userName, password, done) {
        console.log("jgf");

        User.findOne({
            userName: userName
        }, function (err, user) { // be mahz peyda kardan user ba in moshakhasat kole oon satr ro mirize dakhele user va bad ba user.password,... behesh dast resi dare
            if (err) {
                console.log('>>>>>>>>>>>>>>>>>>>>>>err');
                return done(err);
            }

            if (!user) {
                console.log('>>>>>>>>>>>>>>>>>>>>>>!user');
                flag=1;
                return done(null, false, {
                    message: "userName is incorrect"
                })

            }

            if (user.password !== password) {
                console.log('>>>>>>>>>>>>>>>>>>>>>>pass');
                flag=2;
                return done(null, false, {
                    message: "password is incorrect"
                })
              
            }

            console.log('+++++++++++++++++++++user');
            console.log("po"+user);

            // res.set('authorization', 'Bearer'+token)

            return done(null, user)

        })
    }))
//////////////////////middleware isAuthenticated//////////////////////////
function isLoggedIn(req, res, next) {

    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    } else {
        // return next();
        res.redirect('/');
    }
}


passport.serializeUser(function (user, done) {
   
    done(null, user.id);
});
//  User.findOne({_id:id},function(err,user))
passport.deserializeUser(function (id, done) {
   
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/signup', up.single('image'), function (req, res, next) { //up.single('x'): x bayad hamname name input type filr oonvar ke akse maslan bashe

    var img;
    if (!req.file) {
        console.log("666");
        img = "placeholder-avatar.jpg";
    } else {
        img = req.file.filename
    }


    let user = new User({
        isAdmin:0,
        image: img,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        // email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        gender:req.body.gender


    });
    user.save(function (err) {
        if (err) {
            console.log(err)
            res.send(404)
        }


    })
    //   req.flash('success', 'Registration successfully');

    //   req.flash('successRegister',' You Have Been Registered Successfully');
    res.render('login', {
        success: "you have been registerd successfully",
        passerror:""
    });
});

router.get('/',isLoggedIn,function (req, res) {
var flag=1;

    if(!req.cookies['token']){
        flag=0;
        console.log("toye if")
    }

    Article.find({}).sort({ date: -1 }).exec(function (err, docs) {
   
        res.render('index', { art: docs ,isadmin:flag})
    });


  });

router.get('/dashboard',isLoggedIn, function (req, res) {
  

    //    console.log("lll"+req.user.id);
    // console.log(mm+req.headers['x-access-token'])
    // if (req.headers || req.headers.authorization) {
    //     var authorization = headers.authorization
    //     console.log("qq"+authorization)
    // }req.header('x-auth');
    // req.header('x-auth');

    // console.log("tt"+req.user);
  
    console.log(req.headers);
    
    Article.find({_userId:req.user.id}, function (err, docs) {


        res.render('Dashboard', {
            art: docs
        });
    });


});

router.get('/fail',function(req,res){
    console.log("hekkko")
    if(flag==1){
        res.render("login",{passerror:"UserName dosent Exist",
        success: ""
    })
    }
    if(flag==2){
        res.render("login",{passerror:"password is incorrect",
        success: ""
    })
    }
})
router.post('/login', passport.authenticate('user-logins',{ failureRedirect: '/users/fail'}), function (req, res) {
   //req.user ra ma  dar  user-logins
    if(req.user.isAdmin==1){
        var jwt_payload = {
            _id: req.user.id,
            admin:1
        };
        var token = jwt.sign(jwt_payload, 'secret');//encode
        
        res.cookie('token', token);
        // ,{expire : new Date() + 15000}
    }
   
    // 
    // res.set('authorization', 'Bearer'+token)
    // res.clearCookie("token");


    
    // res.redirect({ successRedirect: 'http://localhost:3000/users',
    // failureRedirect: '/badlogin',
    // failureFlash: true });


    res.redirect('http://localhost:3000/users');

    // ----------------------------checked for login----------------------------
    //     var _password =req.body.password;
    //     var _username = req.body.userName;
    //     User.findOne({userName:_username},function(err,user){
    // if(user.password ==_password){
    //     
    // }
    // else{
    //     res.render('login');
    // }
    //     });

    // ----------------------------checked for login----------------------------

});
// router.post('/badlogin',function(req,res){
//     res.render('login')
// })
router.get('/logoff', function (req, res) {
    res.clearCookie('token');
   
    res.clearCookie('ty');
    req.logout();
    // req.session.destroy(function (err) {
    //     res.clearCookie('connect.sid');
    //     res.render('login', {
    //         success: ""
    //     });
    //   });
    res.render('login', {
                success: "",
                passerror:""
            });
       
   
})
// router.get('/blog',function(req,res){
//     res.render('blog')
// });
module.exports = router;




