const express = require('express')
const router = express.Router()
const cors = require('cors')
const {idea} = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
    ensureAuthenticated,
    ensureRole
    }         = require('../helpers/auth');
router.use(cors())

router.post('/add/idea',ensureAuthenticated, async (req, res) => {
  try{
    await idea.create({desc: req.body.desc, name: req.body.name, userId: req.user.id})
    var ideas = await idea.findAll({raw:true})
    res.render("ideas/listideas", {ideas: ideas, user:req.user})
  }
  catch (err) {
    res.status(500).send({
      error: err.message
    })
  }
})

router.get('/view/idea/:id',ensureAuthenticated, async (req, res) => {
  try{
    var i = await idea.findByPk(req.params.id,{raw:true})
    res.render("ideas/view", {idea: i, user:req.user})
  }
  catch (err) {
    res.status(500).send({
      error: err.message
    })
  }
}) 

router.get('/ideas',ensureAuthenticated, async (req, res) => {
  try{
    var ideas = await idea.findAll({raw:true})
    res.render('ideas/listideas', {layout: "main",  ideas: ideas, user:req.user});
  }
  catch (err) {
    res.status(500).send({
      error: err.message
    })
  }
})

router.get('/add/idea',ensureAuthenticated, async (req, res) => {
  res.render('ideas/add', {layout : 'main'});
});

module.exports = router