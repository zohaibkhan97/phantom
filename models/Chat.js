module.exports = (sequelize, DataTypes) => {
  const chat = sequelize.define(
    'chat',
    {
      id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    },
    {
      timestamps: true
    }
  ) 

  chat.associate = function(models) {
    chat.belongsTo(models.user, {as: "entr"})
    chat.belongsTo(models.user, {as: "investor"})
  }
 
  return chat
}
