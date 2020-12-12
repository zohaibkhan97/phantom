'use strict';
const models          = require('../../../models');
const authService     = require('../../../services/auth.service');
const { to, ReE, ReS }= require('../../../services/util.service');
const { sendBy,
       userResponse,
       Token,
       generateOtp,
       generateEmailToken,
       OrderStatusCode,
       OrderStatus,
       ongoingOrder,
       ongoingOrderNew,
       notifyAdmin,
       issueJWT
                       }  = require('../../../services/functions.service');
const CONFIG          = require('../../../config/config');
const jwt             = require('jsonwebtoken');
const md5             = require('md5');
const Sequelize       = require('sequelize');
const Op              = Sequelize.Op;
const messages        = require('../../../cores/messages').messages;
const {
    emailTemplates,
    // sendSms,
    sendEmail}= require('../../../services/emailTemplates');
const {sendSms} =  require('../../../services/sms.service');

/*============================================
=            Login                           =
==============================================*/
const login = async function(req, res){
    try{

        let body,err,User,message;
        body = req.body;
        let language = req.language != undefined ? req.language : 'en';

        if(req.checkParams != 'undefined' && !req.checkParams)
            return ReE(res,message=messages['bad_request']);

        [err, User] = await to(models.user.findOne({
            where:{email: body.email, userType: 3},
            include: models.admin
        }));
        if(err){
            return ReE(res, err);
        }
        console.log(1)

        if(!User){
            return ReE(res,message=messages['invalid_login_1']);
        }
        console.log(2)

        //Lets check the password
        if(!(await User.validatePassword(body.password))){
            return ReE(res,message=messages['invalid_login_1']);
        }
        console.log(3)
        //Lets check the password
        if(!User.admin){
            return ReE(res,message=messages['invalid_login_1']);
        }
         //add the token in body;
        // body.access_token = req.headers.authorization.split(' ')[1];
        //Now Generate the new token for logged user
        // const token = await Token(User,body);

        // var token = jwt.encode(User, CONFIG.authentication.jwtSecret)
        var userinfo = await userResponse(User)
        
        const tokenObject = await issueJWT(userinfo);

        // console.log(body.access_token)
        // await models.logon_master.create({user_id: User.id, session_id: body.access_token})
        console.log(tokenObject)
        return ReS(res, { 
            token: tokenObject.token, 
            user: userinfo,
            expiresIn: tokenObject.expires,
            message: messages['successfully_logged_in'],
            }
        );
    }
    catch(e){
        console.log(e)
        var message//
        return ReE(res,message=messages['invalid_login_2']);
    }
}
module.exports.login = login;//
/*=====  End of Login  ======*/


/*============================================
=            Reset Password                  =
==============================================*/

const resetpassword = async function(req, res){
     
    let body,err,User,message;
    body = req.body;

    // console.log('\x1b[36m%s\x1b[0m','**************checkParams***********');
    // console.log(req.checkParams);
    // console.log('\x1b[36m%s\x1b[0m','*************checkParams************');

    // if(req.checkParams != 'undefined' && !req.checkParams)
    //     return ReE(res,message=messages['bad_request']);

    [err, User] = await to(models.user_master.findOne({where:{is_deleted:0,dial_code:body.dial_code,mobile:body.phone_no,user_type:5}}));
    if(err){
        return ReE(res, err);
    }

    if(!User){
        return ReE(res,message=messages['error_user_not_found']);
    }

	//Change and save the new password
	// User.password = md5(body.new_password);	
    User.generateHash(body.new_password);

    User.save()
    .then((user)=>console.log('password got changed:',user))
    .catch((err)=>console.log('password didnt changed'));
   
    const content='Welcome to '+messages['appName']+', Your new password is :'+body.password;            
    if(User.dial_code != 'undefined' && User.mobile != null){
        sendSms(User.dial_code+User.mobile,content);
    }

    if(User.email != 'undefined' && User.email != null){
       sendEmail(User,emailTemplates.resetPassword,body.new_password);
    }

    return ReS(res, {data:{message:messages['success_password_changed']}});
}
module.exports.resetpassword = resetpassword;
/*=====  End of resetpassword  ======*/


/*============================================
=            change Password                  =
==============================================*/

const changepassword = async function(req, res){
     
    let body,err,message;

    //Now check is this logged user or not
    if(req.user == undefined){
         return ReE(res,message=messages['login_required_for_all']);
    }

    body = req.body;
    let userId = req.user.id;
	let userType = req.user.user_type;
	let User = req.user;

    // console.log('\x1b[36m%s\x1b[0m','**************checkParams***********');
    // console.log(req.checkParams);
    // console.log('\x1b[36m%s\x1b[0m','*************checkParams************');

    // if(req.checkParams != 'undefined' && !req.checkParams)
    //     return ReE(res,message=messages['bad_request']);
    
    if(process.env.NODE_ENV == 'development'){
        console.log('\x1b[36m%s\x1b[0m','**********old_password***************');
        console.log(body.old_password,User.password,md5(body.old_password));
        console.log('\x1b[36m%s\x1b[0m','***********old_password**************');
    }
    
    if(!User.validedPassword(body.old_password)){
	       return ReE(res,message=messages['incorrect_old_password']);
    }
    if(User.validedPassword(body.new_password)){
	       return ReE(res,message=messages['same_old_password']);
    }

	//Change and save the new password
	User.generateHash(body.new_password);
    User.save().then(()=>console.log("Password Changed")).catch((err)=>console.log("Not Change:"+err));

    return ReS(res, {data:{message:messages['success_password_changed']}});
}
module.exports.changepassword = changepassword;
/*=====  End of change password  ======*/



/*============================================
=            Verify OTP                      =
==============================================*/

const verifyotp = async function(req, res){
     
    let body,err,message;

    body = req.body;
    let VerifyOtpUser;

 //    console.log('\x1b[36m%s\x1b[0m','**************checkParams***********');
 //    console.log(req.checkParams);
 //    console.log('\x1b[36m%s\x1b[0m','*************checkParams************');

	// if(req.checkParams != 'undefined' && !req.checkParams)
	// 	return ReE(res,message=messages['bad_request']);

    
	[err, VerifyOtpUser] = await to(models.user_master.findOne({where:{is_deleted:0,dial_code:body.dial_code,mobile:body.phone_no,user_type:5}}));
	
    if(err){
        return ReE(res, err);
	}
    

    if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev'){
        console.log('\x1b[36m%s\x1b[0m','**********VerifyOtpUser***************');
        console.log(VerifyOtpUser);
        console.log('\x1b[36m%s\x1b[0m','***********VerifyOtpUser**************');
    }

    if(!VerifyOtpUser){
        return ReE(res,message=messages['error_user_not_found']);
    }

    if(VerifyOtpUser.otp != body.otp)
        return ReE(res,message=messages['mobile_verification_mismatch']);


    VerifyOtpUser.mobile_verified = 1;
    VerifyOtpUser.otp = null;
    
    VerifyOtpUser.save().then(()=>console.log("OTP verified")).catch((err)=>console.log("Not verified:"+err));

    return ReS(res, {data:{message:messages['otp_verified']}});
}
module.exports.verifyotp = verifyotp;
/*=====  End of verifyotp  ======*/


/*============================================
=            Verify OTP                      =
==============================================*/

const verifyemail = async function(req, res){
    
    try{

        let body,err,message,user;

        var query = req.query;

     //    console.log('\x1b[36m%s\x1b[0m','**************checkParams***********');
     //    console.log(req.checkParams);
     //    console.log('\x1b[36m%s\x1b[0m','*************checkParams************');

        // if(req.checkParams != 'undefined' && !req.checkParams)
        //  return ReE(res,message=messages['bad_request']);

        var decoded = jwt.verify(query.token, CONFIG.authentication.jwtSecret);
        console.log(decoded)
        // res.send(decoded)
        // console.log(decoded.userId)




        // var a = await models.user.findAll()
        // console.log(a)
        user = await models.user.findOne({where: {id: decoded.userId}});
        

        if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev'){
            console.log('\x1b[36m%s\x1b[0m','**********user***************');
            console.log(user);
            console.log('\x1b[36m%s\x1b[0m','***********user**************');
        }

        if(!user){
            return res.render("verificationFailed") 
        }

        user.verified = true;
        
        user.save()

        return res.render("everified")

    }
    catch(e){
        console.log(e)
        return res.render("verificationFailed")   
    }
}
module.exports.verifyemail = verifyemail;
/*=====  End of verifyotp  ======*/
/*============================================
=            Resend OTP                      =
==============================================*/

const resendotp = async function(req, res){
     
    let body,err,message;
    body = req.body;

    let ResendOtpUser;

    // console.log('\x1b[36m%s\x1b[0m','**************checkParams***********');
    // console.log(req.checkParams);
    // console.log('\x1b[36m%s\x1b[0m','*************checkParams************');

    // if(req.checkParams != 'undefined' && !req.checkParams)
    //     return ReE(res,message=messages['bad_request']);
    
    [err, ResendOtpUser] = await to(models.user_master.findOne({where:{is_deleted:0,dial_code:body.dial_code,mobile:body.contact_number}}));
	    if(err){
        return ReE(res, err);
	    }


    if(!ResendOtpUser){
        return ReE(res,message=messages['error_user_not_found']);
    }

    const otp = generateOtp();  

    const content='Welcome to '+messages['appName']+', Your new OTP is :'+otp;
                
    if(ResendOtpUser.dial_code != 'undefined' && ResendOtpUser.mobile != null){
        sendSms(ResendOtpUser.dial_code+ResendOtpUser.mobile,content);
    }

    if(ResendOtpUser.email != 'undefined' && ResendOtpUser.email != null){
        sendEmail(ResendOtpUser,emailTemplates.resendOtp,otp);
    }
                  
	ResendOtpUser.otp = otp;
    ResendOtpUser.save().then(()=>console.log("OTP send")).catch((err)=>console.log("Not send:"+err));

    return ReS(res, {data:{message:messages['otp_sms_resent']}});
}
module.exports.resendotp = resendotp;
/*=====  End of Resend OTP  ======*/

/*============================================
=            New Resend OTP                  =
==============================================*/

const resendotpnew = async function(req, res){
     
    let body,err,message;
    body = req.body;

    let ResendOtpUser;

    // console.log('\x1b[36m%s\x1b[0m','**************checkParams***********');
    // console.log(req.checkParams);
    // console.log('\x1b[36m%s\x1b[0m','*************checkParams************');

    // if(req.checkParams != 'undefined' && !req.checkParams)
    //     return ReE(res,message=messages['bad_request']);
    
    [err, ResendOtpUser] = await to(models.user_master.findOne({where:{is_deleted:0,dial_code:body.dial_code,contact_number:body.contact_number}}));
        if(err){
        return ReE(res, err);
        }

    if(ResendOtpUser){
        return ReE(res,message=messages['user_mobile_number_exists']);
    }

    if(req.user != undefined && req.user.id){
        ResendOtpUser = req.user;
    }

    const otp = generateOtp();  

    const content='Welcome to '+messages['appName']+', Your new OTP is :'+otp;
                
    if(ResendOtpUser.country_code != 'undefined' && ResendOtpUser.phone != null){
        sendSms(ResendOtpUser.dial_code+ResendOtpUser.mobile,content);
    }

    if(ResendOtpUser.email != 'undefined' && ResendOtpUser.email != null){
        sendEmail(ResendOtpUser,emailTemplates.resendOtp,otp);
    }
                  
    ResendOtpUser.otp = otp;
    ResendOtpUser.save().then(()=>console.log("OTP send")).catch((err)=>console.log("Not send:"+err));

    return ReS(res, {data:{message:messages['otp_sms_resent']}});
}
module.exports.resendotpnew = resendotpnew;
/*=====  End of New Resend OTP  ======*/



/*============================================
=            forgotPassword                 =
==============================================*/

const forgotPassword = async function(req, res){
     
    let body,err,message;

    let ResendOtpUser;
    
    body = req.body;

    // console.log('\x1b[36m%s\x1b[0m','**************checkParams***********');
    // console.log(req.checkParams);
    // console.log('\x1b[36m%s\x1b[0m','*************checkParams************');

    // if(req.checkParams != 'undefined' && !req.checkParams)
    //     return ReE(res,message=messages['bad_request']);

    [err, ResendOtpUser] = await to(models.user_master.findOne({where:{is_deleted:0,dial_code:req.body.dial_code,mobile:req.body.phone_no,user_type:5}}));
    
    if(err){
        return ReE(res, err);
    }
    

    if(!ResendOtpUser){
        return ReE(res,message=messages['error_user_not_found']);
    }

    if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev'){
        console.log('\x1b[36m%s\x1b[0m','***********ResendOtpUser ID**************');
        console.log(ResendOtpUser);
        console.log('\x1b[36m%s\x1b[0m','************ResendOtpUser ID*************');
    }

    const otp = generateOtp();  

    const content='Welcome to '+messages['appName']+', Your OTP is :'+otp;
                
    if(ResendOtpUser.dial_code != 'undefined' && ResendOtpUser.mobile != null){
        sendSms(ResendOtpUser.dial_code+ResendOtpUser.mobile,content);
    }

    if(ResendOtpUser.email != 'undefined' && ResendOtpUser.email != null){
        sendEmail(ResendOtpUser,emailTemplates.otp,content);
    }
                  
    ResendOtpUser.otp = otp;
    ResendOtpUser.save().then(()=>console.log("OTP send")).catch((err)=>console.log("Not send:"+err));

    return ReS(res, {data:{message:messages['otp_sms_resent']}});
}
module.exports.forgotPassword = forgotPassword;
/*=====  End of Resend OTP  ======*/



/*============================================
=            Regitser                        =
==============================================*/
const register = async function(req, res){
     
    let body,err,User,message,verificationToken;
    body = req.body;
    const data = {user: {}};

    if(req.checkParams != 'undefined' && !req.checkParams)
        return ReE(res,message=messages['bad_request']);

    //Check if user exists with same mobile number
    [err, User] = await to(models.user.findOne({where:{email:body.email}}));
    if(err){
        return ReE(res, err);
    }
    //return if found

    if(User && User.id != 'undefined'){
        return ReE(res,message=messages['email_exists_already']);
    }

    if(body.email != undefined && body.email != null) {  
        data.user.email = body.email;
    }

    if(body.name != undefined && body.name != null) {  
        data.user.name = body.name;
    }

    data.user.userType = 1
    data.dateJoin = Math.floor(Date.now() / 1000)



    // data.timestamp = Math.floor(Date.now() / 1000);

    data.user.userSetting = {
        paymentMethodId: null
    }

    models.admin.create(data, {
        include: [
            {
                model: models.user,
                include: models.userSetting
            },
        ]
    }).
    // models.user.create(data).
    then( async (admin)=>{
        console.log(admin)
        console.log("creating new user Done");

        var user = admin.user

         //Send welcome email
        console.log(user.email)
        console.log("user.email")


        verificationToken = await generateEmailToken({userId: user.id});
        if(user.email != 'undefined' && user.email != null){
            let link = 'http://' + req.headers.host + '/adminpanel/auth/verifyemail?token=' + verificationToken;            
            sendEmail(user,emailTemplates.emailVerify,link);
        }

        // if(user.email != 'undefined' && user.email != null){
        //     sendEmail(user,emailTemplates.resendOtp,user.otp);
        // }
        
        //add the token in body;
        // body.access_token = req.headers.authorization.split(' ')[1];
        //Now Link the token
        // const token = await Token(user,body);
        

        await user.generateHash(req.body.password);
        user.verified = true
        user.save()

        // var userinfo = userResponse(user)
        // console.log(userinfo)


        const tokenObject = await issueJWT(user);

        // console.log(body.access_token)
        // await models.logon_master.create({user_id: User.id, session_id: body.access_token})
        console.log(tokenObject)
        return ReS(res, { 
            token: tokenObject.token, 
            expiresIn: tokenObject.expires,
            message: messages['successfully_registered']
            }
        );
        
        })
    .catch((err)=>console.log("creating new user Not Done:"+err));

}
module.exports.register = register;
/*=====  End of Regitser  ======*/

const isVerified = async function(req, res){
    try{
        ReS(res, {isVerified: req.user.verified})
    }
    catch (err) {
        ReE(res, err.message)
    }  
} 
module.exports.isVerified = isVerified;



/*============================================
=            Edit Profile                    =
==============================================*/
const editProfile = async function(req, res){
     
    let body,err,checkUser,message,email,name;


     //Now check is this logged user or not
    if(req.user == undefined){
         return ReE(res,message=messages['login_required_for_all']);
    }



    body = req.body;
    const User = req.user;
    const userId = User.id;

    // console.log('\x1b[36m%s\x1b[0m','**************checkParams***********');
    // console.log(req.checkParams);
    // console.log('\x1b[36m%s\x1b[0m','*************checkParams************');

    // if(req.checkParams != 'undefined' && !req.checkParams)
    //     return ReE(res,message=messages['bad_request']);


    if(body.full_name != 'undefined' && body.full_name != null)
        User.name = body.full_name;


    if(body.image != 'undefined' && body.image != null)
        User.image = body.image;

    if(body.dial_code != 'undefined' && body.dial_code != null)
        User.dial_code = body.dial_code;

    if(body.phone_no != 'undefined' && body.phone_no != null)
        User.mobile = body.phone_no;
        
    User.save().
    then(async (User)=>{

        //Now process the Use data by using UserResponse
        const user_info = await userResponse(User,req.headers.authorization.split(' ')[1]);

        const Order     = await ongoingOrderNew(User.id,res);

        //Now Generate the token for logged user
        body.access_token = req.headers.authorization.split(' ')[1];
        const token = await Token(User,body);

        return ReS(res, {data:{
            is_order_running:Order.isOrderRunning,
            user_info,
            auth:token,
            order_details:Order.order_details,
            order_sequence_list:Order.order_sequence_list,

            message:messages['profile_update_successfully']}});


        })
    .catch((err)=>console.log("Edit user Not Done:"+err));

}
module.exports.editProfile = editProfile;
/*=====  End of Regitser  ======*/


module.exports.logout = async(req,res)=>{

        let body,err,message;
        const accessToken = req.headers.authorization.split(' ')[1];
        // console.log(accessToken + ' this was the accessToken' )

        //Lets remove(Hard remove) the given access_token from our user_devices table
        // console.log(req.user + ' this was the user' )
        if(req.user == undefined){
            // console.log('came into undefined')
             return ReE(res,message=messages['login_required_for_all']);
        }

        await models.user_devices.destroy({
            where: {
              access_token: accessToken
            },
        });
        console.log(accessToken)
        
        var data = {
            logged_out: 1,
            logged_out_time: new Date(),
            is_active: 0
        }
        await models.logon_master.update(
            data,
            {
                where: {
                    user_id: req.user.id,
                    is_active: 1,
                    session_id: accessToken
                }
            }
        )
        req.user.status = 'loggedOff'
        req.user.is_online = '0'
        await req.user.save()
        notifyAdmin('riderLogout', {name: req.user.name, id:req.user.id})

        console.log(messages['login_required_for_all'] )
        console.log(messages['logout'] )

        return ReS(res, {data:{message:messages['logout']}});
}