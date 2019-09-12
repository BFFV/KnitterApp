module.exports = (sequelize, DataTypes) => {
  const material = sequelize.define('material', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {});

  material.associate = function associate(models) {
    material.belongsToMany(models.pattern, { through: 'pattern_materials' });
  };

  return material;
};
