const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const article = new Schema({
    // faTitle: { type: String, unique: true, required: true, dropDups: true },
    // enTitle: { type: String, unique: true, required: true, dropDups: true },
    // faDescription: String,
    // enDescription: String,
    // order: { type: Number, required: true },
    // image:{type:String,required:true},
    title:{type:String ,required:true},
    text: { type: String,  required: true },
    image: { type: String},
    date:{type:String,required:true},
   
   
    _userId : [{type:Schema.Types.ObjectId,ref:'user'}]//kelid khareji
    // updateDate: Date
});


module.exports = mongoose.model('article', article);


