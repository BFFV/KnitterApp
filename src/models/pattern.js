module.exports = (sequelize, DataTypes) => {
  const pattern = sequelize.define('pattern', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'El nombre no puede ser vacío!',
        },
      },
    },
    score: DataTypes.FLOAT,
    instructions: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Las instrucciones no pueden ser vacías!',
        },
      },
    },
    video: DataTypes.STRING,
    image: DataTypes.STRING,
    tension: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'La tensión no puede ser vacía!',
        },
      },
    },
    popularity: DataTypes.INTEGER,
  }, {});

  pattern.associate = function associate(models) {
    pattern.belongsTo(models.user, { foreignKey: 'authorId' });
    pattern.belongsToMany(models.user, { through: 'user_patterns', as: 'usedBy' });
    pattern.hasMany(models.vote_pattern, { foreignKey: 'patternId' });
    pattern.hasMany(models.comment, { foreignKey: 'patternId' });
    pattern.belongsTo(models.category);
    pattern.belongsToMany(models.material, { through: 'pattern_materials', as: 'materials' });
    pattern.belongsToMany(models.user, { through: 'favorites' });
  };

  return pattern;
};
