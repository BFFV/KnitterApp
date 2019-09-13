module.exports = (sequelize, DataTypes) => {
  const vote_pattern = sequelize.define('vote_pattern', {
    patternId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
  }, {});

  vote_pattern.associate = function associate(models) {
    vote_pattern.belongsTo(models.user);
    vote_pattern.belongsTo(models.pattern);
  };

  return vote_pattern;
};
