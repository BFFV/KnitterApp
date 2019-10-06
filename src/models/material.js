module.exports = (sequelize, DataTypes) => {
  const material = sequelize.define('material', {
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
  }, {});

  material.associate = function associate(models) {
    material.belongsToMany(models.pattern, { through: 'pattern_materials' });
  };

  return material;
};
