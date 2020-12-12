'use strict';
const models          = require('../../../models');
const moment          = require('moment');
const authService     = require('../../../services/auth.service');
const { to, ReE, ReS }= require('../../../services/util.service');
const { 
    sendBy,
    OrderStatusCode,
    OrderStatus,
    uniqueOrderNumber,
    getOrderDetail,
    Notifier
    }                 = require('../../../services/functions.service');
const CONFIG          = require('../../../config/config');
const { forEach }     = require('p-iteration');
const messages        = require('../../../cores/messages').messages;
const {AdminPush} =  require('../../../services/notification.service');
const Sequelize       = require('sequelize');
const Op              = Sequelize.Op;


/*=============================================
=            Order list                       =
=============================================*/


module.exports = {

	async getSubs(req, res){
		try{

			var subs = await models.sub.findAll({
				attributes: {
					exclude: ['createdAt', 'updatedAt', 'userId'],
					include: ["id", "startDate", "endDate","paid","status",
	                    [Sequelize.col('user.client.id'), 'clientId'],
	                    [Sequelize.col('user.name'), 'clientName'],
	                    [Sequelize.col('subType.name'), 'subTypeName'],
	                ],
				},
                include: [
                	{model: models.user, attributes : [], include: models.client},
                	{model: models.subType, attributes : [],},
                ],
			})

			var a = await models.user.findAll({
				include: models.client
			})

			ReS(res, subs)
		}
		catch (err) {
			ReE(res, err.message)
		}		
	},

	async getCounselor(req, res){
		try{

			var counselor = await models.counselor.findOne({
				where: {id: req.query.id},
                attributes: ["id", "isPsychiatrist", "excerpt","education","expTherapy", "acceptingNewMatches",
                    [Sequelize.col('user.name'), 'name'],
                    [Sequelize.col('user.email'), 'email'],
                    [Sequelize.col('user.number'), 'number'],
                    [Sequelize.col('user.verified'), 'verified'],
                ],
                include: [
                	{model: models.user, attributes : []},
                ],
			})
			var bookings = await models.booking.findAll({
				attributes: ["id", "status", "bookingType",
					[Sequelize.col('availability.slot.startTime'), 'startTime'],
					[Sequelize.col('availability.slot.endTime'), 'endTime'],
					[Sequelize.col('availability.slot.dayId'), 'dayId'],
					[Sequelize.col('client.user.name'), 'clientName'],
					[Sequelize.col('client.id'), 'clientId'],
				],
				where: {status:1},
				include: [{
						model: models.availability, 
						where: {counselorId: counselor.id},
						include: models.slot,
						attributes: []
					},
					{
						model: models.client,
						attributes: [],
						include: {
							model: models.user,
						}
					}
				]
			})

			counselor = counselor.toJSON()
			counselor.bookings = bookings
			ReS(res, counselor)
		}
		catch (err) {
			console.log(err.message)
			ReE(res, err.message)
		}		
	},

	async updateCounselor(req, res){
		try{

			var counselor = await models.counselor.findOne({
				where: {id: req.body.id},
				include: {
					model: models.user, 
					include: {model: models.bankDetail}
				},
			})
			if (!counselor){
				return ReE(res,messages['error_user_not_found']);
			}

			var data = req.body
			var userData = {
				name: data.name,
				email: data.email,
				number: data.number
			}

			await counselor.update({
				excerpt: data.excerpt,
				education: data.education,
				expTherapy: data.expTherapy,
				acceptingNewMatches: data.acceptingNewMatches,
				})

			await counselor.user.bankDetail.update(data.bankDetails)
			await counselor.user.update(userData)

			ReS(res)
		}
		catch (err) {
			ReE(res, err.message)
		}		
	},

	async addCounselor(req, res){
		try{

		    let body,err,User,message;
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


			data.excerpt = body.excerpt
			data.education = body.education
			data.expTherapy = body.expTherapy
			data.user.number = body.number

		    data.user.userType = 2
		    data.dateJoin = Math.floor(Date.now() / 1000)

		    // User Bank Details Initialize
		    data.user.bankDetail = {}
		    ////////////////////////////////

		    // User Settings initialize
		    data.user.userSetting = {}
		    ////////////////////////////////
		    /// 
		    await models.counselor.create(data, {
		        include: [
		            {
		                model: models.user,
		                include: [
		                    {
		                        model: models.userSetting
		                    },
		                    {
		                        model: models.bankDetail
		                    },
		                ]
		            },
		        ]
		    })

			ReS(res)
		}
		catch (err) {
			ReE(res, err.message)
		}		
	},


	async getCounselors(req, res){
		try{

			var counselors = await models.counselor.findAll({
                attributes: ["id", "isPsychiatrist", "excerpt","education","expTherapy", "acceptingNewMatches",
                    [Sequelize.col('user.name'), 'name'],
                    [Sequelize.col('user.email'), 'email'],
                    [Sequelize.col('user.number'), 'number'],
                    [Sequelize.col('user.verified'), 'verified'],
                ],
                include: [
                	{model: models.user, attributes : []}
                ],
			})

			ReS(res, counselors)

		}
		catch (err) {
			ReE(res, err.message)
		}	
	},


	async getAcceptingCounselors(req, res){
		try{

			var counselors = await models.counselor.findAll({
				where: {acceptingNewMatches: true},
                attributes: ["id", "isPsychiatrist", "excerpt","education","expTherapy", "acceptingNewMatches",
                    [Sequelize.col('user.name'), 'name'],
                    [Sequelize.col('user.email'), 'email'],
                    [Sequelize.col('user.number'), 'number'],
                    [Sequelize.col('user.verified'), 'verified'],
                ],
                include: [
                	{model: models.user, attributes : []}
                ],
			})

			ReS(res, counselors)

		}
		catch (err) {
			ReE(res, err.message)
		}	
	},


	async getClient(req, res){
		try{
			console.log(req.query)
			var client = await models.client.findOne({
				where: {id: req.query.id},
				attributes: ["id", "dateJoin","emergencyName","emergencyNumber",
					[Sequelize.col('user.name'), 'name'],
					[Sequelize.col('user.email'), 'email'],
					[Sequelize.col('user.number'), 'number'],
            	],
				include: [
					{
						model: models.user, attributes : []
					},
                	{
                		model: models.counselor, 
                		// attributes : [],
						include: {model: models.user},
                		through: {model: models.assignment, where: {}, attributes: ['active']},
				        order: [
				            ['active', 'DESC'],
				        ],
                	}
				]
				// raw:true
			})

			// if (!client){
			// 	return ReE(res,messages['error_user_not_found']);
			// }
			ReS(res, client)
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},

	async updateClient(req, res){
		try{

			var client = await models.client.findOne({
				where: {id: req.body.id},
				include: {model: models.user}
			})

			if (!client){
				return ReE(res,messages['error_user_not_found']);
			}

			var dataReceived = req.body
			var userData = {
				name: dataReceived.name,
				number: dataReceived.number,
				email: dataReceived.email
			}

			await client.update({
				emergencyName: dataReceived.emergencyName,
				emergencyNumber: dataReceived.emergencyNumber 
			})
			await client.user.update(userData)

			ReS(res)
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},

	async addClient(req, res){
		try{

		    let body,err,User,message;
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


			data.emergencyName = body.emergencyName
			data.emergencyNumber = body.emergencyNumber
			data.user.number = body.number

		    data.user.userType = 1
		    data.dateJoin = Math.floor(Date.now() / 1000)

		    // User Bank Details Initialize
		    // data.user.bankDetail = {}
		    ////////////////////////////////

		    // User Settings initialize
		    data.user.userSetting = {}
		    ////////////////////////////////
		    /// 
		    await models.client.create(data, {
		        include: [
		            {
		                model: models.user,
		                include: models.userSetting
		            },
		        ]
		    })

			ReS(res)
		}
		catch (err) {
			ReE(res, err.message)
		}		
	},


	async getClients(req, res){
		try{

			var clients = await models.client.findAll({
                attributes: ["id", "dateJoin", "emergencyName","emergencyNumber",
                    [Sequelize.col('user.name'), 'name'],
                    [Sequelize.col('user.email'), 'email'],
                    [Sequelize.col('user.number'), 'number'],
                    [Sequelize.col('user.verified'), 'verified'],
                ],
                include: [
                	{
                		model: models.user, attributes : []
                	}

                ],

			})

			ReS(res, clients)

		}
		catch (err) {
			console.log(err.message)
			ReE(res, err.message)
		}	
	},



	async addQuestion(req, res){
		try{
			console.log("came here")
			await addQuestionHelper(req.body)
			res.send("ok")
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},

	

	async addQuestions(req, res){
		try{
			var questions = req.body.questions

			for (var i = 0; i < questions.length; i++) {
				await addQuestionHelper(questions[i])
			}

			res.send("ok")
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},
	

	async addQuestionsToGroup(req, res){
		try{
			var questionIds = req.body.questionIds
			var group = await models.surveyQuestionGroup.findByPk(req.body.groupId)

			await group.addSurveyQuestions(questionIds)

			res.send("ok")
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},
	

	async addQuestionGroup(req, res){
		try{
			console.log(req.body)

			models.surveyQuestionGroup.create({
				text: req.body.text,
				groupFor: req.body.groupFor
			})

			res.send("ok")
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},

	async addHelp(req, res){
		try{

			await models.help.create({
				helpText: req.body.helpText,
				userId: req.user.id
			})
			ReS(res)
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},


	async addAssignment(req, res){
		try{
			var data = req.body

			var client = await models.client.findByPk(data.clientId)
			var counselor = await models.counselor.findByPk(data.counselorId)

			if (!client){
				return ReE(res, messages['client_not_found'])
			}
			if (!counselor){
				return ReE(res, messages['counselor_not_found'])
			}

			var assignment = await models.assignment.findOne({
				where: {
					clientId: data.clientId, 
					active: true,
				}
			})
			if (assignment){
				return ReE(res, messages['already_matched'])
			}

			assignment = await models.assignment.findOne({
				where: {
					clientId: data.clientId, 
					counselorId: data.counselorId,
				}
			})

			if (assignment){
				if (assignment.active){
					return ReE(res, messages['pair_already_matched'])
				}

				else if (!assignment.active){
					assignment.active = true
					await assignment.save()
					return ReS(res)
				}
			}

			await models.assignment.create({
				startDate: moment().format(messages['datetime_formate_2']),
				clientId: data.clientId,
				counselorId: data.counselorId,
				active: true,
			})

			ReS(res)
		}
		catch (err) {
			console.log(err)
			res.status(500).send({
				error: err.message
			})
		}	
	},


	async unmatchAssignment(req, res){
		try{
			var data = req.body

			var client = await models.client.findByPk(data.clientId)
			var counselor = await models.counselor.findByPk(data.counselorId)

			if (!client){
				return ReE(res, messages['client_not_found'])
			}
			if (!counselor){
				return ReE(res, messages['counselor_not_found'])
			}

			var assignment = await models.assignment.findOne({
				where: {
					clientId: data.clientId, 
					counselorId: data.counselorId,
					active: true,
				}
			})

			if (!assignment){
				return ReE(res, messages['assignment_not_found'])
			}

			assignment.active = false
			await assignment.save()

			ReS(res)
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},


	async getClientAssignment(req, res){
		try{
			var data = req.query

			var client = await models.client.findByPk(data.clientId)

			if (!client){
				return ReE(res, messages['client_not_found'])
			}

			var assignment = await models.assignment.findOne({
				where: {
					clientId: data.clientId, 
					active: true,
				}
			})

			ReS(res, assignment)
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},


	async updateAvailability(req, res){
		try{

			var data = req.body
			var counselorId = data.counselorId
			var availableSlotIds = data.availableSlotIds
			var dayIds = data.dayIds

			var whereForSlotInclude = {}
			if (dayIds && dayIds.length > 0 && dayIds.length < 7){
				whereForSlotInclude.dayId = dayIds
			}
			console.log(whereForSlotInclude)
			var availabilities = await models.availability.findAll({
				where: {counselorId: data.counselorId},
				include: {model: models.slot, where: whereForSlotInclude}
			})

			for (var i = 0; i < availabilities.length; i++) {
				var avail = availabilities[i]
				if (availableSlotIds.includes(avail.slotId)){
					avail.available = true
				}
				else{
					avail.available = false
				}
				await avail.save()
			}
			console.log(availabilities.length)
			console.log(whereForSlotInclude)

			ReS(res)
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},



}


const addQuestionHelper = async (data) => {
	try{
		var options = []
			console.log(options.length)
		var opts = data.options
		for (var j = 0; j < opts.length; j++) {
			var option = opts[j].option
			options.push({option: option})
		}
		
		var data = {
			question: data.question,
			answerType: data.answerType,
			questionFor: data.questionFor,
			options: options
		}
		await models.surveyQuestion.create(data, {
	        include: models.option
	    })

		return {success: 1}
	}

	catch (err){
		throw err
	}
}