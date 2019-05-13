var express = require('express');
var router = express.Router();
var path = require('path');
const User = require('../modules/user');
const Article = require('../modules/article');
const Comment = require('../modules/comment');
const bodyParser = require('body-parser');
const up = require('../routes/uploadMiddleware');
var rimraf = require("rimraf");
// const passport = require('passport');
// const jwt=require('jsonwebtoken') 
// const JWTstrategy=require('passport-jwt').Strategy;
// const ExtractJWT=require('passport-jwt').ExtractJwt;
 const multer =require('multer');
// const up=multer({
//   dest:'uploads/'
// });
// router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/addarticle',  function (req, res, next) {
  
  res.render('ADD');
});

router.post('/addnewarticle', up.single('image'), function (req, res, next) {
 

  console.log("wwww");
  // console.log(req.file.originalname + " " + req.file.filename + "       " + req.file.path + "  "+req.file+""+req.files+req);
  var img;
  if (!req.file) { //agar dakhele req.file aks bashe ke mizare nabashe jash in akso mizare
    console.log("666");
    img = "placeholder-avatar.jpg";
  } else {
    img = req.file.filename
  }










  let t = req.body.Text;
  var tt = t.substring(3, (t.length - 6));

  let art = new Article({
    _userId: req.user.id,
    title: req.body.title,
    date: req.body.datep,
    image: img,
    text: tt,


  });
  art.save(function (err) {
    if (err) {
      console.log(err);

    }

  });


  res.redirect('/users')

});

router.post('/delete', function (req, res, next) {
  console.log("#####" + req.body.myid);
  Article.deleteOne({
    _id: req.body.myid
  }, function (err, obj) {
    if (err) throw err;
    console.log("worked");

  });

  res.redirect('http://localhost:3000/users/dashboard');
});

router.post('/editarticle',up.single('image'), function (req, res, next) {
  
  console.log("old"+req.body.perimg);
 


  // if(req.file.filename==req.body.perimg){

  // }

  var im;
  if (!req.file) { //agar aks avaz nashod hamoon aks qabli bemone avaz shod  bere to else
    console.log("66677" + req.body.perimg);
    im = req.body.perimg; //perimg input type hidden toye modal dash ejs ke esme aks qabli ro dare 
  } else {
    // if(req.body.perimg){
    //   rimraf("public/imageUploads/" + req.body.perimg, function () {
    //     console.log("done");
    //   });
    // }
     //mire aks qbli ro az bikh pak mikone
    im = req.file.filename //aks jadid mishavaad
  }
  console.log("we are in back ");
  console.log(req.body.Text);
  var t = req.body.Text;
  var tt = t.substring(3, (t.length - 6));
  console.log(tt);
  console.log(req.body.title);
  console.log(req.body.tarikh);
  Article.updateOne({
    // art[i]._id=
    // $("input[name=mid]").val()
    _id: req.body.mid //input type hiddenn toye hammon modal ke  mikhad id table article db ro begire ta befahme kodom record ro bayad update kone
  }, {
    $set: {
      title: req.body.title,
      date: req.body.tarikh,
      text: tt,
      image: im
    }
  }, function (err, res) {

    if (err) {
      throw err;
    }
    console.log("table updated");
  });



  //baray in intori neveshtim ke action oon dar routes users seda zade besh va kole on route anjam she na faghat ke view ro biare
  res.redirect('http://localhost:3000/users/dashboard');
});

router.get('/showarticle', function (req, res, next) {
 
  //   console.log(req.query.id);
  
  var isadmin=0;
  if(req.cookies['token']){
    isadmin=1;
  }
  Article.findOne({
    _id: req.query.id
  }, function (err, information) {
    if (err) {
      throw err;
    }


    User.findOne({
      _id: information._userId
    }, function (err, personalInformation) {
      if (err) {
        throw err;
      }
      Comment.find({
        _articleId: information._id
      }, function (err, comments) {
        if (err) {
          throw err;
        }
        console.log(" information"+ information+
         " personalInformation"+ personalInformation+
          "comments"+comments+"kk"+isadmin);

        res.render('blog', {
          information: information,
          personalInformation: personalInformation,
          comments:comments,k:isadmin
        });
      });
    });


  });





});



module.exports = router;