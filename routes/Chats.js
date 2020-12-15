const express = require('express')
const router = express.Router()
const cors = require('cors')
const {job} = require('../models')
const {chat} = require('../models')
const {user} = require('../models')
const {message} = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {
    ensureAuthenticated,
    ensureRole
    }         = require('../helpers/auth');
router.use(cors())
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1123497",
  key: "9feca0caa7a1854d8f87",
  secret: "13528f1eddd7ce396204",
  cluster: "ap2",
  useTLS: true
});

router.get('/chats/send', async (req, res) => {


  pusher.trigger("my-channel", "123", {
    message: "hello world"
  });

  res.send("Done")
});

router.get('/chats/:userId', async (req, res) => {
  if (req.params.userId == "style.css"){
    res.send("")
    return
  }
  var investorId, entrId
  if (req.user.userType == "entr"){
    entrId = req.user.id
    investorId = req.params.userId
  }
  else{
    investorId = req.user.id
    entrId = req.params.userId
  }
  console.log({entrId: entrId, investorId: investorId})
  var chatGroup = await chat.findOne({
    where: {entrId: entrId, investorId: investorId},
    raw:true
  })
  if (!chatGroup){
    await chat.create({entrId: entrId, investorId: investorId})
    chatGroup = await chat.findOne({
      where: {entrId: entrId, investorId: investorId},
      raw:true
    })
  }

  var messages = await message.findAll({
    where: {chatId: chatGroup.id},
    raw:true
  })
  res.render("chats/main", {messages: messages, chatId: chatGroup.id})
});

router.post('/chats/send', async (req, res) => { 

  await message.create({
    message: req.body.message,
    chatId: req.body.chatId,
    byId: req.user.id,
    byName: req.user.name,
  })

  pusher.trigger("my-channel", req.body.chatId, {
    message: req.body.message,
    name:req.user.name
  });

  res.send()
});

router.get('/messages', async (req, res) => {
  var groups
  if (req.user.userType == "entr"){
    groups = await chat.findAll({
      entrId: req.user.id,
      include: {
        model: user,
        as: "investor"
      },
      raw:true,
    })
  }
  else{
    groups = await chat.findAll({
      investorId: req.user.id,
      include: {
        model: user,
        as: "entr"
      },
      raw:true,
    })
  }
  res.render("chats/messages", {chats: groups, user:req.user})
});


module.exports = router