const express = require('express')
const router = express.Router()
const cors = require('cors')
const config = require('../config/config')
const {job} = require('../models')
const {user} = require('../models')
const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');
const multer  = require('multer')
const upload = multer()
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

router.get('/job/:id/apply', async (req, res) => {
  try{
    var jobs = await job.findAll({raw:true})
    res.render('jobs/apply', {layout: "main",  jobId: req.params.id, user:req.user});
  }
  catch (err) {
    res.status(500).send({
      error: err.message
    })
  }
})

router.post('/job/apply', upload.single('file'), async (req, res) => {
  try{
    console.log(req.body)
    console.log(req.file)
    let err,Email,image;
    var Credentials = config.emailCredentials
    //make mail setting
    console.log(Credentials.emailCredentials)
    const transporter = nodemailer.createTransport({

        service: Credentials.service,
        auth: {
          user: Credentials.auth.user, // Your email id
          pass: Credentials.auth.pass // Your password
        }, 
    });

    console.log({

        service: Credentials.service,
        auth: {
          user: Credentials.auth.user, // Your email id
          pass: Credentials.auth.pass // Your password
        }, 
    })
    
    var j = await job.findByPk(req.body.jobId)
    var u = await user.findByPk(j.userId)
    console.log(u)
    //make configuration
    const mailOptions = {
      from: "fury052697@gmail.com", 
      to: u.email,            
      subject: "New Job Application!",
      // text: 'Hello world',  // plaintext body
      html: "Application received from "+ req.body.name + ". Following is the cover letter:\n" + req.body.desc ,           // HTML body
      attachments: [
        {   // Buffer
            filename: 'resume.pdf',
            content: req.body.file
        }
      ]
    };
    //Now send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        res.render("jobs/applyDone", {message: "Something went wrong!"})
      }else{
        res.render("jobs/applyDone", {message: "Application submitted successfuly!"})
     };
    });

  }
  catch (err) {
    res.render("jobs/applyDone", {message: "Something went wrong!"})
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