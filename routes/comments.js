var express = require('express');
var router = express.Router();
var path = require('path');
const Comment=require('../modules/comment');
const User = require('../modules/user');
const Article = require('../modules/article');
const bodyParser = require('body-parser');


router.post('/newcomment',function(req,res){
   
    let date = new Date(Date.now());
    // var diff;
    // if(req.body.idarticlechild)
    // {
    //     diff=req.body.idarticlechild;
    //     console.log("child"+diff)
    // }
    // elseif(req.body.idarticlefather)
    // {
    //     diff=req.body.idarticlefather;

    //  console.log("father"+diff)

    // }
User.findOne({_id:req.user.id},function(err,person){

 var Comments=new Comment({
    _articleId:req.body.idarticle,
    _userid:req.user.id,
        creatDate:date.toString(),
        commentsText:req.body.text,
        parentId:req.body.parentid,
        commentName:person.firstName,
        image:person.image

    });
    Comments.save(function (err) {
        if (err) {
          console.log(err);
    
        }
    
      });
    
})


   
    res.redirect('http://localhost:3000/articles/showarticle?id='+req.body.idarticle);
});






module.exports = router;