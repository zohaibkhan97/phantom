const express = require('express')
const router = express.Router()
const cors = require('cors')
const {idea} = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.use(cors())

router.post('/add/idea', async (req, res) => {
  try{
    console.log(req.body)
    await idea.create(req.body)
    var ideas = await idea.findAll({raw:true})
    res.render("listideas", {ideas: ideas})
  }
  catch (err) {
    res.status(500).send({
      error: err.message
    })
  }
})

router.get('/ideas', async (req, res) => {
  try{
    var ideas = await idea.findAll({raw:true})
    res.render('listideas', {layout: "main",  ideas: ideas});
    // res.send(ideas)
  }
  catch (err) {
    res.status(500).send({
      error: err.message
    })
  }
})


module.exports = router