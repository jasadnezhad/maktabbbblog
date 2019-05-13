var express = require('express');
var router = express.Router();
var path = require('path');
const User = require('../modules/user');
const Article = require('../modules/article');
const Upload = require('./uploadMiddleware');
const Comment = require('../modules/comment');
const passport = require('passport')
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy
const up = require('../routes/uploadMiddleware');
var rimraf = require("rimraf");

router.get('/AdminDash', function (req, res) {
  
    console.log(res.header("cookie"))
    // res.json("headars:"+req.header("cookie"))
    User.find({}, function (err, userInfo) {
        res.render('AdminDashboard', {
            info: userInfo
        });
    })

})
router.post('/deleteuser', function (req, res) {
    User.deleteOne({
        _id: req.body.personid
    }, function (err, user) {
        if (err) throw err;
        res.redirect('http://localhost:3000/Admin/AdminDash')
    });
})
router.post('/recoverypass', function (req, res) {
    console.log("xiiin" + req.body.id);
    var phone;
    User.findOne({_id: req.body.id},function(err,per){
    phone=per.phoneNumber; 
   
   
    console.log("xiiinn" + phone);
    User.updateOne({
        _id: req.body.id
    }, {
        $set: {
         password:phone
        }
    }, function (err, user) {

        if (err) throw err;
       

        res.redirect('http://localhost:3000/Admin/AdminDash')
    });
 });
})
router.get('/AdminArticle', function(req,res){
   
  var id = req.query.id;
   console.log("areee dada"+req.query.id)
    Article.find({_userId:id},function(err,userArticle){
        res.render('AdminDashboardArt',{
            userArticle:userArticle
        });
    })
    

})
router.post('/deleteArticle',function(req,res){
    console.log(req.query.id+"wkekwe")
    Article.deleteOne({
   _id:req.body.Articleid
    },function(err,article){
        if(err)throw err;
         Comment.deleteMany({_articleId:req.body.Articleid},function(err,deleteallcomment){
            res.redirect('http://localhost:3000/Admin/AdminArticle?id='+req.body.queryid)
    
         })
       });
})
router.post('/deleteComment',function(req,res){
    // var different;
  Comment.deleteOne({_id:req.body.commentid},function(err,comment){
      
      var cmid=req.body.commentid;
      console.log("tet"+comment.parentId);
        //tips:darkhate avak commnet pak shod alan be comment.parentid digar dastresi ndarim
               Comment.deleteMany({parentId:cmid},function(err,commentchild){
                if(err)throw err
            
               })
               
            //    if(req.body.idarticlechild)
            //    {
            //        different=req.body.idarticlechild;
            //        console.log("child"+different)
            //    }
            //    elseif(req.body.idarticlefather)
            //    {different=req.body.idarticlefather;

            //     console.log("father"+different)

            //    }
           res.redirect('http://localhost:3000/articles/showarticle?id='+req.body.idarticle);
  });

})

module.exports = router;