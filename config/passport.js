const localStrategy = require('passport-local').Strategy;
const md5           = require('md5');
const models        = require('../models');
const {user} = require('../models')

module.exports = passport=>{

	passport.use('entr',new localStrategy({usernameField:'email'},(email,password,done)=>{
		console.log(123123)
		//For Admin 
		user.findOne({where:{email:email,userType:'entr'}})
		.then(User=>{
			// console.log('user',user);
				if(User && User.id != undefined){

					if (!User.password){
						return done(null,false,{message:'Email or Password is incorrect!'}); 
					}
					console.log(User.validatePassword(password))
					//Lets check the password the salt
					User.validatePassword(password).then(function(result){
						console.log(result)
						if(result)
							return done(null,User);
						else 
							return done(null,false,{message:'Email or Password is incorrect!'});
					})
				}
				else{
					return done(null,false,{message:'Email or Password is incorrect!'});
				}
		})
		.catch(err=>{
			console.log('Error : ',err);
		})
	}));

	//For restaurant
	passport.use('investor',new localStrategy({usernameField:'email'},(email,password,done)=>{
        // console.log("Came here")
		//Now Restaurant
		user.findOne({
			where:{email:email,userType:'investor'}
		})
		.then(User=>{
			// console.log('User',User);
				if(User && User.id != undefined){				     
					
					//Lets check the password the salt
					if(User.validatePassword(password))
						return done(null,User);
					else 
						return done(null,false,{message:'Email or Password is incorrect!'});
				}
				else{
					return done(null,false,{message:'Mobile or Password is incorrect!'});
				}
		})
		.catch(err=>{
			console.log('Error : ',err);
		})
	}));

	passport.serializeUser(function(User, done) {
	  done(null, User.id);
	});

	passport.deserializeUser(function(id, done) {
	  user.findByPk(id)
	  .then((User=>done(null,User)))
	});



}
