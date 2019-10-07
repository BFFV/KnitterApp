module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'El comentario no puede ser vacío!',
        },
      },
    },
    userId: DataTypes.INTEGER,
    patternId: DataTypes.INTEGER,
  }, {});

  comment.associate = function associate(models) {
    comment.belongsTo(models.user);
    comment.belongsTo(models.pattern);
  };

  return comment;
};
