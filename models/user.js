const mongoose=require('mongoose')
const plm=require('passport-local-mongoose')


var UserSchema=new mongoose.Schema({
    name:String,
    username:String,
    password:String
})

UserSchema.plugin(plm)
module.exports=mongoose.model('user',UserSchema)