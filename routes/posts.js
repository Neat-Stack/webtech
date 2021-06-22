var express= require('express')
var router=express.Router();

var CG=require("../models/posts.js"),
    comment=require("../models/comments.js");

router.get("/",(req,res)=>{
	res.render("landing.ejs");
})

router.get("/posts",(req,res)=>{
	CG.find({}, (err,cg)=>{
		if(err)
			console.log("Error:",err);
		else
			res.render("posts/index.ejs",{campVal:cg,currentUser:req.user})
	})
	
})

router.post("/posts",isLoggedIn,(req,res)=>{
	CG.create({name:req.body.name,url:req.body.url,description:req.body.description,price:req.body.price},(err,cg)=>{
		if(err){
			console.log("Error:",err)
		}
		else
			cg.author.id=req.user._id
			cg.author.username=req.user.username
			cg.save()
			console.log(cg)
	})
	res.redirect("/posts");
})

router.get("/posts/new",isLoggedIn,(req,res)=>{
	res.render("posts/new.ejs",{currentUser:req.user})
})

router.get("/posts/:id",(req,res)=>{
	CG.findById(req.params.id).populate("comments").exec((err,foundCamp)=>{ 
		if(err)
			console.log("Error:",err);
		else
			console.log(foundCamp);
			res.render("posts/show.ejs",{campVal:foundCamp,currentUser:req.user})
	})
		
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
		req.flash('success',"Success!")
        return next()
	}
	req.flash('error',"Please Log In first")
    res.redirect('/login')
}

//=============Edit & Update Routes===============
router.get('/posts/:id/edit',isOwner,(req,res)=>{

	CG.findById(req.params.id,(err,cg)=>{
		if(err){
		req.flash('err',"Camp Not found.")
		console.log('Error: ',err)
		req.flash('error',"You do not have the Permission. Contact the Owner")
		res.redirect('back')
		}
		else{
			
			res.render('./posts/edit.ejs',{campVal:cg})
			}
		})
	})


router.put('/posts/:id/',isOwner,(req,res)=>{
	
	CG.findByIdAndUpdate(req.params.id,req.body.camp,(err,updatedCamp)=>{
		if(err)
		{
			console.log('Error: ',err)
			res.redirect('/posts/'+req.params.id)
		}
		else{
			console.log(updatedCamp)
			res.redirect('/posts/'+req.params.id)
			

		}
		
	})

})

//----------------------------------------

//===========Delete Route================
router.delete('/posts/:id',isOwner,(req,res)=>{
	CG.findByIdAndDelete(req.params.id,(err,del)=>{
		if(err){
		console.log("Error: ",err)
		res.redirect('/posts')
		}
		else
		{
			console.log(del)
			res.redirect('/posts')
		}
		
	}
)})

function isOwner(req,res,next){
	if(req.isAuthenticated())
	{
	console.log('Logged in')
	CG.findById(req.params.id,(err,cg)=>{
		if(err)
		{
			console.log('Error: ',err)
			res.redirect('back')
		}
		else{
			if(cg.author.id.equals(req.user.id))
			// Have to use equals() function from mmongoose as cg.author.id is a string but req.user.id 
			//is NOT
			{
				req.flash('success',"Success!")
				next();
			}
			else{
				req.flash('error',"You do not have the Permission. Contact the Owner")
				res.redirect('/campgprunds')
			}
		}
	})
	}
	else
	res.redirect('back')

}
//-------------------------------
module.exports=router