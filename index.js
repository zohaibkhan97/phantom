const express = require('express')
const ideas = require('./routes/Ideas')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();
const config = require('./config/config')
const morgan = require('morgan')
//Loads the handlebars module
const handlebars = require('express-handlebars');


const app = express();
//Sets our app to use the handlebars engine
app.set('view engine', 'handlebars');
//Sets handlebars configurations (we will go through them later on)
app.engine('handlebars', handlebars({
	layoutsDir: __dirname + '/views/layouts',
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'))

const {sequelize} = require('./models')

app.use(express.json());
app.use(ideas)
app.use(morgan('combined'))
app.use(cors())
 
app.get('/', (req, res) => {
	//Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
	res.render('main', {layout : 'main'});
});

sequelize.sync({force: false})
  .then(() => {
    app.listen(process.env.PORT || 3000)
    console.log(`Server started on port ${config.port}`)
  })
