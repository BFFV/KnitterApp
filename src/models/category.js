module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    accepted: DataTypes.BOOLEAN,
  }, {});

  category.associate = function associate(models) {
    category.hasMany(models.pattern);
  };

  return category;
};
