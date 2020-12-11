const path = require('path')
require('dotenv').config();
module.exports = {
  port: process.env.PORT || 3000,
  db: {
    database: process.env.DB_NAME || 'phantom',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    options: {
      dialect: process.env.DIALECT || 'mysql',
      host: process.env.DB_HOST || 'localhost',
      // storage: path.resolve(__dirname, '../../tabtracker.sqlite')
    }
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'secret'
  }
}
