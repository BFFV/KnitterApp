module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    content: DataTypes.TEXT,
    commentable: DataTypes.STRING,
    commentable_id: DataTypes.INTEGER,
  }, {});

  comment.associate = function associate() {
    // associations can be defined here. This method receives a models parameter.
  };

  return comment;
};
