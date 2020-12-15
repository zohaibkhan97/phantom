module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define(
    'message',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      message: {
        type: DataTypes.STRING
      },
      byName: {
        type: DataTypes.STRING
      },
    },
    {
      timestamps: true
    } 
  )

  message.associate = function(models) {

    message.belongsTo(models.chat)
    message.belongsTo(models.user, {as: "by"})

  }

  return message
}
