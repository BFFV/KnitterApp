module.exports = (sequelize, DataTypes) => {
  const vote_pattern = sequelize.define('vote_pattern', {
    patternId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,

  }, {});

  vote_pattern.associate = function associate(models) {
    // persona tiene voto
    // los votos le perteneces a una persona
    // los patrones tienen votos
    // los votos pertenecen a las personas
    vote_pattern.belongsTo(models.user);
    vote_pattern.belongsTo(models.pattern);

    };

  return vote_pattern;
};
