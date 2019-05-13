var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan')
//var logger = require('morgan');
const passport = require('passport');
const session = require('express-session')
 var bodyParser = require('body-parser')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articleRouter=require('./routes/articles');
var profileRouter=require('./routes/profile');
var commentsRouter =require('./routes/comments');
var AdminRouter =require('./routes/Admin');
var ApiRouter=require('./routes/API');
var mongoose = require('mongoose');


mongoose.set("useFindAndModify",false);
mongoose.set("useCreateIndex",true);

mongoose.connect('mongodb://localhost:27017/projectMaktab',{useNewUrlParser:true});
// mongoose.set("useFindAndModify",false)
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/users", express.static(path.join(__dirname, 'public')));
app.use("/articles", express.static(path.join(__dirname, 'public')));
app.use("/profile", express.static(path.join(__dirname, 'public')));
app.use("/comments",express.static(path.join(__dirname, 'public')));
app.use("/Admin",express.static(path.join(__dirname, 'public')));
//baraye gereftan poshe public to in url bayad injoori  esme routes ro begim
// app.use(express.static(__dirname+'imageUploads'));
app.use(session({
  key:"ty",
  secret: 'asdkhfjgadskjfh',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 6000000,
   }
}));

app.use(passport.initialize());
app.use(passport.session());

// <-----------------------jwt and token---------------------------------------->
// var opt={}
// opt.jwtFromRequest = ExtractJWT.fromUrlQueryParameter("secret");
// opt.secretOrKey = "secret";

// passport.use(new JWTstrategy(opt,function(jwt_payload,done){
//    console.log("kirkhar");
//    console.log(jwt_payload);
//     User.findOne({_id:jwt_payload.id},function(err,user){
//       if(user){
//           done(null,user)
//       }else{
//           done(null,false);
//       }
//     });
// }))

var sessionChecker = (req, res, next) => {
 
  if (req.isAuthenticated()) {
      return next();
  } else {
      // return next();
     res.redirect('/');
  }
};

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles',sessionChecker,articleRouter);
app.use('/profile',sessionChecker,profileRouter);
app.use('/comments',sessionChecker,commentsRouter);
app.use('/Admin',passport.authenticate('jwt',{session:false}),AdminRouter);
app.use('/API',ApiRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;