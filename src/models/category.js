module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'El nombre no puede ser vacío!',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'La descripción no puede ser vacía!',
        },
      },
    },
    accepted: DataTypes.BOOLEAN,
  }, {});

  category.associate = function associate(models) {
    category.hasMany(models.pattern);
  };

  return category;
};
