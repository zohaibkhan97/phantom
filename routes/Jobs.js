const express = require('express')
const router = express.Router()
const cors = require('cors')
const {job} = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
    ensureAuthenticated,
    ensureRole
    }         = require('../helpers/auth');
router.use(cors())

router.post('/add/job',ensureAuthenticated, async (req, res) => {
  try{
    console.log(req.body)
    await job.create(req.body)
    var jobs = await job.findAll({raw:true})
    res.render("jobs/listjobs", {jobs: jobs, user:req.user})
  }
  catch (err) {
    res.status(500).send({
      error: err.message
    })
  }
})

router.get('/view/job/:id', async (req, res) => {
  try{
    var j = await job.findByPk(req.params.id,{raw:true})
    res.render("jobs/view", {job: j, user:req.user})
  }
  catch (err) {
    res.status(500).send({
      error: err.message
    })
  }
})

router.get('/jobs', async (req, res) => {
  try{
    var jobs = await job.findAll({raw:true})
    res.render('jobs/listjobs', {layout: "main",  jobs: jobs, user:req.user});
    // res.send(jobs)
  }
  catch (err) {
    res.status(500).send({
      error: err.message
    })
  }
})

router.get('/add/job',ensureAuthenticated, async (req, res) => {
  res.render('jobs/add', {layout : 'main', user:req.user});
});

module.exports = router