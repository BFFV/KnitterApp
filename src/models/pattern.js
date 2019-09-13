



module.exports = (sequelize, DataTypes) => {
  const pattern = sequelize.define('pattern', {
    name: DataTypes.STRING,
    score: DataTypes.INTEGER,
    instructions: DataTypes.TEXT,
    video: DataTypes.STRING,
    image: DataTypes.STRING,
    tension: DataTypes.STRING,
  }, {});

  pattern.associate = function associate(models) {
    pattern.belongsTo(models.user, { foreignKey: 'authorId' });
    pattern.belongsToMany(models.user, { through: 'user_patterns' });
    pattern.hasMany(models.vote_pattern);
    pattern.belongsTo(models.category);
    pattern.belongsToMany(models.material, { through: 'pattern_materials', as: 'materials' });
  };

  return pattern;
};
