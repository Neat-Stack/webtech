var express= require('express')
var router=express.Router();
var passport=require('passport')
var usr=require('../models/user')

router.get('/register',(req,res)=>{
	res.render('register.ejs',{currentUser:req.user})
})

router.post('/register',(req,res)=>{
	usr.register({name:req.body.name,username:req.body.username},req.body.password,(err,user)=>{
		if(err)
		{
			console.log('Error:',err)
			res.redirect('/login')
		}
		else{
			console.log(user)
			res.redirect('back')
		}

	})
})

router.get('/login',(req,res)=>{
	res.render('login.ejs')
})

router.post('/login',passport.authenticate('local',{
	successRedirect:'/posts',
	failureRedirect:'/login'
}),(req,res)=>{
})

router.get('/logout',(req,res)=>{
	req.logout()
	req.flash('success',"Logged Out Successfully")
	res.redirect('back')
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
	}
	req.flash('error',"Please Log In first")
    res.redirect('/login')
}

module.exports=router;