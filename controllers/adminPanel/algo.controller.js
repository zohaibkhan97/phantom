'use strict';
const models          = require('../../../models');
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
	async getOrder(req, res){
		try{
			console.log(req.params)
			const order = await models.order_master.findOne({
				where: {id: req.params.id},
				include: [{
					association: 'customer'
				},
				{
					association: 'restaurant'
				},
				{
					association: 'address'
					},
				{
					association: 'rider'
					}]
			})
			console.log(order.id)
			res.send(order)
		}
		catch (err) {
			console.log(err.message)
			res.status(500).send({
				error: err.message
			})
		}	
	},


    async driverCurrentAssignments (req, res) {
		  try{
		  	const assignments = await models.orderassignment_master.findAll({
		  		where: {rider_id: req.params.id, status: "inProgress"}
		  	})
		  	res.send(assignments)

		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},

	async setCurrentAssignmentsSeq (req, res) {
		  try{
		  	var assignment = await models.orderassignment_master.update({sequence: req.body.seq}, {where: {rider_id: req.body.rider_id}})
		  	res.send(assignment)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},

	async updateAssignment (req, res) {
		  try{
		  	await models.orderassignment_master.update(req.body.data, {where: {order_master_id: req.body.order_id}})
		  	var assignment = await models.orderassignment_master.findOne({
				where: {order_master_id: req.body.order_id},
			    include: [{ all: true }]
			})
		  	res.send(assignment)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},


	async addAssignment (req, res) {
		  try{
		  	console.log(req.body)
		  	var assignment = await models.orderassignment_master.create(req.body.data)
		  	// var order = await Order.findByPk(req.body.orderId)
		  	// var driver = await Driver.findByPk(req.body.driverId)
		  	// console.log(order)
		  	// console.log(driver)
		  	// driver = await driver.addOrder(order, { through: req.body.data});
		  	console.log(assignment.toJSON())
		  	res.send(assignment)

		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},


	async index (req, res) {
		  try{
		  	const client = await models.routes_master.findAll({
		  		include: [{
		  			model: User
		  		}]
		  	})
		  	res.send(client)

		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},


	async addRoute (req, res) {
		  try{
		  	const route = await models.routes_master.create(req.body.data)
		  	res.send(route)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},


	async getRoutes (req, res) {
		  try{
		  	var route = await models.routes_master.findAll({
		  		where: {
		  			assignmentsLinkId: req.params.id, 
		  			status: {
		  				[Op.ne]: "cancelled"
		  			}
		  		},
		  		include: [{
		  			model: models.order_master,
			    	include: [{
			    		model: models.address_master,
		  				as: 'address'
			    	}]
		  		},
		  		{
		  			association: 'customer'
		  		},
		  		{
		  			association: 'client'
		  		}]
		  	})

		  	res.send(route)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},


	async getRoutesBySequence (req, res) {
		  try{
		  	var route = await models.routes_master.findAll({
		  		where: {
		  			assignmentsLinkId: req.params.id, 
		  			status: {
		  				[Op.ne]: "cancelled"
		  			}
		  		},
		  		include: [{
		  			model: models.order_master,
			    	include: [{
			    		model: models.address_master,
		  				as: 'address'
			    	}]
		  		},
		  		{
		  			association: 'customer'
		  		},
		  		{
		  			association: 'client'
		  		}],
		  		order: [
		  			['sequence', 'ASC']
		  		]
		  	})

		  	res.send(route)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},

	async getRoute (req, res) {
		  try{
		  	var route = await models.routes_master.findOne({
		  		where: {id: req.params.id},
		  		include: [{
		  			model: models.order_master,
			    	include: [{
			    		model: models.address_master,
		  				as: 'address'
			    	}]
		  		},
		  		{
		  			association: 'customer'
		  		},
		  		{
		  			association: 'client'
		  		}]
		  	})
		  	res.send(route)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},

	async updateOrder (req, res) {
		  try{
			
			const order = await models.order_master.update(
			  req.body.data,
			  { where: { id: req.body.id } }
			)
		  	res.send(order)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }

		},

	async updateDriver (req, res) {
		  try{
			const driver = models.user_master.update(
			  req.body.data,
			  { where: { id: req.body.id } }
			)
		  	res.send(driver)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},

	async getNearestDrivers (req, res) {
		  try{
			
			const drivers = await models.user_master.findAll({
			  where: {
                is_deleted:0,
                is_online:1,
                user_type:5,
            	}
			})
		  	res.send(drivers)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
	} ,

	async setAssignmentsLinkId (req, res) {
		  try{
			const assignmentsLinkId = await models.assignmentlink_master.update(
			  {assignmentsLinkId: req.params.id},
			  { where: { id:1 } }
			)
			res.send(assignmentsLinkId)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
	}  ,

	async getAssignmentsLinkId (req, res) {
		  try{
			const assignmentsLinkId = await models.assignmentlink_master.findOne(
			  { where: { id:1 } }
			)
			res.send(assignmentsLinkId)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
	} ,

	async updateRoute (req, res) {
		  try{
		  	console.log(req.body)
			const route = models.routes_master.update(
			  req.body.data,
			  { where: { id: req.body.id } }
			)
		  	res.send(route)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
		},

	async getDriver (req, res) {
		  try{
			
			const driver = await models.user_master.findOne({
			  where: {
			  	id: req.params.id 
                // is_deleted:0,
                // is_available:1,
                // is_online:0,
                // user_type:5,
            	}
			})
		  	res.send(driver)
		  }
		  catch (err) {
		  	console.log(err.message)
		  	res.status(500).send({
		  		error: err.message
		  	})
		  }
	} ,




	// async setNumRoutes (req, res) {
	// 	  try{
	// 		const assignmentsLinkId = await models.assignmentlink_master.update(
	// 		  {numRoutes: req.params.numRoutes},
	// 		  { where: { id:1 } }
	// 		)
	// 		res.send(assignmentsLinkId)
	// 	  }
	// 	  catch (err) {
	// 	  	console.log(err.message)
	// 	  	res.status(500).send({
	// 	  		error: err.message
	// 	  	})
	// 	  }
	// }  ,

	// async getNumRoutes (req, res) {
	// 	  try{
	// 		const assignmentsLinkId = await models.assignmentlink_master.findOne(
	// 		  { where: { id:1 } }
	// 		)
	// 		res.send(assignmentsLinkId)
	// 	  }
	// 	  catch (err) {
	// 	  	console.log(err.message)
	// 	  	res.status(500).send({
	// 	  		error: err.message
	// 	  	})
	// 	  }
	// } 
}
