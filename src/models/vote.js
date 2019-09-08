module.exports = (sequelize, DataTypes) => {
  const vote = sequelize.define('vote', {
    rating: DataTypes.INTEGER,
  }, {});

  vote.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return vote;
};
