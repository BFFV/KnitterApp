module.exports = (sequelize, DataTypes) => {
  const votePattern = sequelize.define('vote_pattern', {
    patternId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          args: true,
          msg: 'El puntaje debe ser un número entero!',
        },
        min: {
          args: 1,
          msg: 'El puntaje debe ser mayor o igual a 1!',
        },
        max: {
          args: 5,
          msg: 'El puntaje debe ser menor o igual a 5!',
        },
      },
    },
  }, {});

  votePattern.associate = function associate(models) {
    votePattern.belongsTo(models.user);
    votePattern.belongsTo(models.pattern);
  };

  return votePattern;
};
