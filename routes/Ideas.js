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
    console.log(req.body)
    await idea.create(req.body)
    var ideas = await idea.findAll({raw:true})
    res.render("ideas/listideas", {ideas: ideas})
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
    console.log(i)
    res.render("ideas/view", {idea: i})
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
    res.render('ideas/listideas', {layout: "main",  ideas: ideas});
    // res.send(ideas)
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