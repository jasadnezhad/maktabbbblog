
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const comment = new Schema({


    _articleId:[{type:Schema.Types.ObjectId,ref:'article'}],
    creatDate:{type:String,required:true},
    commentsText: { type: String,  required: true },
    parentId:{type:String},
    image:{type:String},
    commentName:{type:String ,required:true},
    _userid:[{type:Schema.Types.ObjectId,ref:'user'}]
});
module.exports = mongoose.model('comment', comment);
