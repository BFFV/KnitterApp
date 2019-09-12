module.exports = (sequelize, DataTypes) => {
  const vote = sequelize.define('vote', {
    rating: DataTypes.INTEGER,
  }, {});

  vote.associate = function associate(models) {
    vote.belongsTo(models.pattern);
  };

  return vote;
};
