var mongoose=require("mongoose")
var cgSchema=new mongoose.Schema({
	name:String,
	url:String,
	price:String,	
	description:String,
	comments:[
		{
	type:mongoose.Schema.Types.ObjectId,
	ref:"comment"}
	],
	author:{
		id: {
			type:mongoose.Schema.Types.ObjectId,
			ref:'user'
		},
		username:String
	},

})

module.exports=mongoose.model("Camp",cgSchema);
