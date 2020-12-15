const express = require('express')
const router = express.Router()
const cors = require('cors')
const {user} = require('../models')
const Sequelize = require('sequelize');
const passport      	= require('passport');
require('../config/passport')(passport);
const Op = Sequelize.Op;
const requiredParam     = require('../cores/required');

const {
		ensureAuthenticated,
		ensureRole
	  } 				= require('../helpers/auth');


router.get('/home',ensureAuthenticated, (req, res) => {
	//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
	res.render('home', {layout : 'main'});
});

router.route('/login')
  .get(async(req,res)=>{

	res.render('auth/login', {layout: 'main'});
})
.post(async function(req, res, next) {
	try{
		passport.authenticate(req.body.userType, function(err, User, info) {
			if (err) { return res.redirect('/'); }
			if (!User) return res.redirect('/');
			req.logIn(User, async function(err) {

				console.log(req.session)
			    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
			    res.cookie('email',req.body.mobile, { maxAge: 900000, httpOnly: true });
			    res.cookie('password',req.body.password, { maxAge: 900000, httpOnly: true });
				if (err) { return next(err); }

				return res.render("home", {layout:"main"});
			})
	  	})(req, res, next)
	}
	catch(err){
		console.log(err)
	}
})


router.get('/logout',async function(req,res){
	req.logout();
	res.redirect('/');
});

router.get('/register',(req,res, next)=>{
    res.render('auth/register', {layout: 'main'});
});
 

router.post('/register',async(req,res)=>{

	try{
		var userSave = new user
		userSave.name = req.body.name
		userSave.email = req.body.email
		await userSave.generateHash(req.body.password)
		userSave.userType = req.body.userType
		await userSave.save()

		res.render("index", {layout: "main"})
	}
	catch(err){
	    console.log(err);
	    req.flash('error_msg','Something went wrong!');
	    res.redirect('index');
	}
});


module.exports = router
