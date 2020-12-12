module.exports = (sequelize, DataTypes) => {
  const idea = sequelize.define(
    'idea',
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
      desc: {
        type: DataTypes.STRING
      },
    },
    {
      timestamps: true
    }
  )

  idea.associate = function(models) {

    idea.belongsTo(models.user)

  }

  return idea
}
