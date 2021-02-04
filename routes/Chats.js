const express = require('express')
const router = express.Router()
const cors = require('cors')
const { job } = require('../models')
const { chat } = require('../models')
const { user } = require('../models')
const { message } = require('../models')
const Sequelize = require('sequelize');
const config = require('../config/config')
const Op = Sequelize.Op;
const {
  ensureAuthenticated,
  ensureRole
} = require('../helpers/auth');
router.use(cors())
const Pusher = require("pusher");

const pusher = new Pusher(config.pusher);


router.get('/chats/:userId', async (req, res) => {
  if (req.params.userId == "style.css") {
    res.send("")
    return
  }
  var investorId, entrId
  if (req.user.userType == "entr") {
    entrId = req.user.id
    investorId = req.params.userId
  }
  else {
    investorId = req.user.id
    entrId = req.params.userId
  }
  console.log({ entrId: entrId, investorId: investorId })
  var chatGroup = await chat.findOne({
    where: { entrId: entrId, investorId: investorId },
    raw: true
  })
  if (!chatGroup) {
    await chat.create({ entrId: entrId, investorId: investorId })
    chatGroup = await chat.findOne({
      where: { entrId: entrId, investorId: investorId },
      raw: true
    })
  }

  var messages = await message.findAll({
    where: { chatId: chatGroup.id },
    raw: true
  })
  res.render("chats/main", { layout: "main", messages: messages, chatId: chatGroup.id, user: req.user })
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
    name: req.user.name
  });

  res.send()
});

router.get('/messages', async (req, res) => {
  var groups
  if (req.user.userType == "entr") {
    groups = await chat.findAll({
      attributes: ["id",
        [Sequelize.col('investor.name'), 'name'],
        [Sequelize.col('investor.id'), 'investorId'],
      ],
      where: { entrId: req.user.id },
      include: {
        model: user,
        as: "investor",
        raw: true,
      },
      raw: true,
    })
  }
  else {
    console.log("came in investor")
    groups = await chat.findAll({
      attributes: ["id",
        [Sequelize.col('entr.name'), 'name'],
        [Sequelize.col('entr.id'), 'entrId'],
      ],
      where: { investorId: req.user.id },
      include: {
        model: user,
        as: "entr",
        raw: true,
      },
      raw: true,
    })
  }
  console.log(groups)
  res.render("chats/messages", { layout: "main", chats: groups, user: req.user })
});

router.get('/chat/delete', async (req, res) => {

  await chat.destroy({
    where: { id: req.query.chatId }
  })
  await message.destroy({
    where: { chatId: req.query.chatId }
  })

  var groups
  if (req.user.userType == "entr") {
    groups = await chat.findAll({
      attributes: ["id",
        [Sequelize.col('investor.name'), 'name'],
        [Sequelize.col('investor.id'), 'investorId'],
      ],
      where: { entrId: req.user.id },
      include: {
        model: user,
        as: "investor",
        raw: true,
      },
      raw: true,
    })
  }
  else {
    console.log("came in investor")
    groups = await chat.findAll({
      attributes: ["id",
        [Sequelize.col('entr.name'), 'name'],
        [Sequelize.col('entr.id'), 'entrId'],
      ],
      where: { investorId: req.user.id },
      include: {
        model: user,
        as: "entr",
        raw: true,
      },
      raw: true,
    })
  }
  console.log(groups)
  res.render("chats/messages", { layout: "main", chats: groups, user: req.user })
});

module.exports = router