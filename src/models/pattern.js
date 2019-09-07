module.exports = (sequelize, DataTypes) => {
  const pattern = sequelize.define('pattern', {
    name: DataTypes.STRING,
    score: DataTypes.INTEGER,
    instructions: DataTypes.JSON,
    video: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {});

  pattern.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return pattern;
};
