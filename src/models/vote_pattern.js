module.exports = (sequelize, DataTypes) => {
  const votePattern = sequelize.define('vote_pattern', {
    patternId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
  }, {});

  votePattern.associate = function associate(models) {
    votePattern.belongsTo(models.user);
    votePattern.belongsTo(models.pattern);
  };

  return votePattern;
};
