var express		=require('express'),
	app			=express(),
	mongoose	=require("mongoose"),
	parse		=require("body-parser"),
	usr 		=require('./models/user.js'),
	flash		=require('connect-flash'),
	passport	=require('passport'),
	LocalStrategy=require('passport-local'),
	passportLocalMongoose=require('passport-local-mongoose'),
	methodOverride= require('method-override')

var authRoutes	=	require('./routes/auth.js'),
	postRoutes	=	require('./routes/posts'),
	commentRoutes=	require('./routes/comments')

app.use(flash());
app.use(parse.urlencoded({extended:true}));
app.use(methodOverride('_method'))

//=====================Passport Config=========================
app.use(require('express-session')({
	secret:'9986',
	resave:false,
	saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(usr.authenticate()))
passport.serializeUser(usr.serializeUser())
passport.deserializeUser(usr.deserializeUser())

app.use((req,res,next)=>{
	res.locals.currentUser=req.user; 
	// this will automaticallly pass current user to all the routes thus saving
	//us the time by manually passing through each routes (EVEN THO I DID THAT ANYWAYS)
	res.locals.error=req.flash('error')
	res.locals.success=req.flash('success')
	next();
});

app.use(commentRoutes)
app.use(authRoutes)
app.use(postRoutes)

mongoose.set('useNewUrlParser',true);
mongoose.set( 'useUnifiedTopology', true );

mongoose.connect("mongodb://localhost/reddit_Clone");


//====================models import===================
var CG=require("./models/posts.js"),
	
    comment=require("./models/comments.js");

app.use(express.static(__dirname+"/public"))// GOOD PRACTICE
// seedsDB();

//================================================================


	// CG.create([{name:"Two Forks Park",url:"https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929_1280.jpg"},
	// 	 	 {name:"Mountain View",url:"https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg"},
	// 	 	 {name:"Goat Fields",url:"https://cdn.pixabay.com/photo/2017/08/06/18/33/barn-2594975_1280.jpg"},{
	// 			name:"Salmon Creek",
	// 			url:"https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_1280.jpg",
	// 			description:"A wonderful quiet little creek where you can find solace in solitude and anser your most deepest questions! Locals say that the place is surrounded by auras and magic!"
	// 		}],(err,camp)=>{
	// 	if(err)
	// 		console.log("Error: ",err)
	// 	else{
	// 		console.log(camp)
	// 	}	
	// })


//=========================================================================================================

app.listen("3000",process.env.IP,()=>{
	console.log("Reddit Clone Server Listening on PORT:3000");
})
