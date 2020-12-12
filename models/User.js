var bcrypt = require('bcrypt');
const saltRounds = 12;


module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      number: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      userType: {
        type: DataTypes.STRING
      },
      verified: {
        type: DataTypes.BOOLEAN
      },
      chatId: {
        type: DataTypes.STRING
      },
    },
    {
      timestamps: true
    }
  )

  user.associate = function(models) {

    user.hasOne(models.idea)

  }


  user.prototype.generateHash = async function(password) {
    this.password = await bcrypt.hash(password, saltRounds);
    console.log(this.password)
    
  };

  user.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
  };

  return user
}
