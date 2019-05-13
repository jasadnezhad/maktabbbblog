const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//var pattern = [/^(?=.*?[a-z])(?=.*?[0-9]).{4,}$/, "{VALUE} NOT STRONG!"];


const users = new Schema({
    // faTitle: { type: String, unique: true, required: true, dropDups: true },
    // enTitle: { type: String, unique: true, required: true, dropDups: true },
    // faDescription: String,
    // enDescription: String,
    // order: { type: Number, required: true },
    isAdmin:{type:Number,required:true},
     image:{type:String},
    firstName:{type:String ,required:true},
    lastName: { type: String,  required: true },
    userName: { type: String, unique: true, required: true},
    phoneNumber:{type:String,unique:true,required:true},
    password: {type: String, required: true},
    gender:{type:String,required:true}
    // updateDate: Date
});


module.exports = mongoose.model('users', users);

//630 khat back