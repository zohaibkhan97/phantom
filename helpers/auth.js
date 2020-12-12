const models   = require('../models');

module.exports = {
	ensureAuthenticated: async function(req,res,next){
        // console.log(req.session.views)
  //       console.log(req.sessionStore )
  //       console.log(req.session)
		// console.log(req.session.returnId)
  //       console.log(req.headers)
          // console.log(JSON.stringify(req.headers) + ' headers in auth' )

		// res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.isAuthenticated())	
			return next();
		// else{
		// 	// console.log('came to logged out')
		// 	// console.log(req.sessionID)
		// 	// console.log(req.session.returnId)
		// 	var data = {
		// 	    logged_out: 1,
		// 	    logged_out_time: new Date(),
		// 	    is_active: 0
		// 	}
		// 	await models.logon_master.update(
		// 	    data,
		// 	    {
		// 	        where: {
		// 	            is_active: 1,
		// 	            session_id: req.session.returnId
		// 	        }
		// 	    }
		// 	)
		// }

		// req.flash('error_msg','Not Authorized');
			
		// res.redirect(req.baseUrl);
		// req.session.redirectTo = req.originalUrl;
		res.render('index',{layout:"main"});
		// res.redirect('/admin');
	},
	ensureRole:async function(req,res,next){

			//Lest secure admin routes from restaurant
			if(req.user.user_type == 3)
				return res.redirect('/restaurant');

			if(req.user.user_type == 1)
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
		    console.log(models.role_master)
		    role_ids = await models.role_master.findById(req.user.role_id);


			auth_id  = await models.auth_item.findOne({where:{is_deleted:0,description:query}});


		    roles =  role_ids.auth_item.split(',');

		    if(await inArray(auth_id.id, roles) === true){
		      return next();
		    }

		    req.flash('error_msg','Not Authorized');
			res.redirect('/admin/dashboard/');
	}
}