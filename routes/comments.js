var express= require('express')
var router=express.Router();

var CG=require("../models/posts.js"),
    comment=require("../models/comments.js");
const { Router } = require('express');


router.get("/posts/:id/comments/new",isLoggedIn,(req,res)=>{
	CG.findById(req.params.id).populate("comments").exec((err,foundCamp)=>{ 
		if(err)
			console.log("Error:",err);
		else
			console.log(foundCamp);
			res.render("comments/new.ejs",{campVal:foundCamp,currentUser:req.user})
	})
})

router.post("/posts/:id/comments",isLoggedIn,(req,res)=>{
	CG.findById(req.params.id,(err,Camp)=>{
		if(err)
			console.log("Error: ",err)
		else
			{
				
				comment.create(req.body.comment,(err,comment)=>{
			Camp.comments.push(comment)
				Camp.save((err,Camp)=>{
					if(err)
						console.log("Error: ",error)
					else
						{
							
				comment.author.id=req.user._id
				comment.author.username=req.user.username
				comment.save();
							console.log(Camp)
							res.redirect("/posts/"+req.params.id)
						}
				}) 
			})
				
			}
	})
})

//=============Edit & Update routes=============
router.get('/posts/:id/comments/:com_id/edit',isOwner,(req,res)=>{
	comment.findById(req.params.com_id,(err,comment)=>{
		if(err)
		console.log(err)
		else{
			CG.findById(req.params.id).populate("comments").exec((err,foundCamp)=>{ 
				if(err)
					console.log("Error:",err);
				else{
					console.log(foundCamp);
					console.log(comment.text)
					console.log(req.params.com_id)
					res.render('comments/edit.ejs',{campVal:foundCamp,foundComment:comment})
				}
			})
		}	
			})	
})

router.put('/posts/:id/comments/:com_id',(req,res)=>{
	comment.findByIdAndUpdate(req.params.com_id,req.body.comment,(err,updatedComment)=>{
		if(err){
		console.log(err)
		req.flash('error',err)
		res.redirect('back')
		}

		else{
			console.log(updatedComment)
			req.flash('success',"Updated Comment Successfully")
			res.redirect('/posts/'+req.params.id)
		}
	})
})

//----------------------------------
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
	}
	req.flash('error',"Please Log in First")
    res.redirect('/login')
}

function isOwner(req,res,next){
	if(req.isAuthenticated())
	{
	console.log('Logged in')
	comment.findById(req.params.com_id,(err,comment)=>{
		if(err)
		{
			console.log('Error: ',err)
			req.flash('error',"You do not have the Permission. Contact the Owner")
			res.redirect('back')
		}
		else{
			if(comment.author.id.equals(req.user.id))
			// Have to use equals() function from mmongoose as cg.author.id is a string but req.user.id 
			//is NOT
			{
				req.flash('success',"Success!")
				next();
			}
			else{
				req.flash('error',"You do not have the Permission.")
				res.redirect('back')
			}
		}
	})
	}
	else
	res.redirect('back')

}

//====================Delete route========================
router.delete('/posts/:id/comments/:com_id',(req,res)=>{
	comment.findByIdAndRemove(req.params.com_id,(err,delComment)=>{
		if(err){
			console.log(err)
		}
		else{
			req.flash('success',"Comment Deleted")
			console.log(delComment)
			res.redirect('back')
		}
	})
})


module.exports=router;