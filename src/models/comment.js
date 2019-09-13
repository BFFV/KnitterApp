module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
    userId: DataTypes.INTEGER,
    patternId: DataTypes.INTEGER,

  }, {});

  comment.associate = function associate(models) {
    comment.belongsTo(models.user);
    comment.belongsTo(models.pattern);
  };

  return comment;
};
