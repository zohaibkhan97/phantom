const express = require('express')
const ideas = require('./routes/Ideas')
const jobs = require('./routes/Jobs')
const chats = require('./routes/Chats')
const session = require('express-session');
const auth = require('./routes/Auth')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();
const config = require('./config/config')
const morgan = require('morgan')
//Loads the handlebars module
const handlebars = require('express-handlebars');
const passport = require('passport')

const app = express();

app.use(session({
  // store: myStore,
  // key: 'sid',
  secret: 'secret',
  // cookie: {secure: false, maxAge: 1000000}
  resave: true,
  saveUninitialized: true,
  // cookie: { maxAge: 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());

var pass = require('./config/passport')(passport)

//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');
//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
  layoutsDir: __dirname + '/views/layouts',
  helpers: require('./helpers/hh')
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

const { sequelize } = require('./models')
app.use(express.json());
app.use(ideas)
app.use(jobs)
app.use(auth)
app.use(chats)
app.use(morgan('combined'))
app.use(cors())

app.get('/', (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
  res.render('index', { layout: 'main' });
});

sequelize.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT || 3000)
    console.log(`Server started on port ${config.port}`)
  })
