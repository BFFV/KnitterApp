const bcrypt = require('bcrypt');
const PASSWORD_SALT = 10;

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

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
    user.hasMany(models.pattern, { foreignKey: 'authorId' });
    user.belongsToMany(models.pattern, { through: 'user_patterns', as: 'used_patterns' });
    user.belongsToMany(models.user, { through: 'followers', as: 'followed_by' });
  };
  
  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};
