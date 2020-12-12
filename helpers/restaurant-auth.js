const models   = require('../models');

module.exports = {
	ensureAuthenticated:async function(req,res,next){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.isAuthenticated())	
			return next();
		else{
			var data = {
			    logged_out: 1,
			    logged_out_time: new Date(),
			    is_active: 0
			}
			await models.logon_master.update(
			    data,
			    {
			        where: {
			            is_active: 1,
			            session_id: req.sessionID
			        }
			    }
			)
		}

		req.flash('error_msg','Not Authorized');
		req.session.redirectTo = req.originalUrl;		
		res.redirect('/restaurant/login');
	},
	ensureRole:async function(req,res,next){


			//Lest secure admin routes from restaurant
			if(req.user.user_type == 1)
				return res.redirect('/admin');
				
			if(req.user.user_type == 3)
				return next();

			let route = req.originalUrl;

			let route_array = route.split('/');
			let query = '/'+route_array[2]+'/';

			if(query.includes('?')){
				query = query.split('?')[0] + '/';
			}
				
		    if(route_array[3] != '' && route_array[3] != undefined)
		    	query = query +route_array[3].split('?')[0];
			
			function inArray(target, array){
		        for(var i = 0; i < array.length; i++) 
		        {
		          if(array[i] == target)
		          {
		            return true;
		          }
		        }

		        return false; 
		    }

		    role_ids = await models.role_master.findById(req.user.role_id);


			auth_id  = await models.auth_item.findOne({where:{is_deleted:0,description:query}});


		    roles =  role_ids.auth_item.split(',');

		    if(await inArray(auth_id.id, roles) === true){
		      return next();
		    }

		    req.flash('error_msg','Not Authorized');
			res.redirect('/admin/dashboard/');
	},
	ensureVerification:async function(req,res,next){
				
			if(!req.user.is_verified){
				req.flash('error_msg','Your profile is not verified yet!');
				return res.redirect('/restaurant/dashboard/');
			}
	 	    next();
	},
    ensureOtpVerification:async function(req,res,next){

    	if(!req.user.mobile_verified){
				res.cookie('restaurant_user_id',req.user.id, { maxAge: 900000, httpOnly: true });
				console.log('cookie created successfully');
				req.flash('error_msg','Please verify mobile number');
    			req.logout();
				return res.redirect('/restaurant/otp');
			}
	 	next();
	}
}