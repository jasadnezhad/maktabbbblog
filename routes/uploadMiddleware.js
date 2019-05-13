// uploadMiddleware.js

const multer = require('multer');
const uuidv4 = require('uuid/v4')

const storage =multer.diskStorage({
 destination:'public/imageUploads',
 filename:function(req,file,callback){
  
  var uu = uuidv4().toString();
  console.log("##"+uu);
     callback(null,uu+".jpg");
 }
});
var upload=multer({
  storage:storage
});
// const upload = multer({
//   limits: {
//     fileSize: 4 * 1024 * 1024,
//   }
// });

module.exports = upload