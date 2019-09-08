module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    role: DataTypes.STRING,
  }, {});

  user.associate = function associate(models) {
    user.hasMany(models.pattern);
    user.belongsToMany(models.pattern, { through: 'user_patterns' });
    user.belongsToMany(models.user, { through: 'followers' });
  };

  return user;
};
