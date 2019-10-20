const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;
const TOKEN_SALT = 10;

async function buildPasswordHash(instance, options) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
    // eslint-disable-next-line no-param-reassign
    options.validate = false;
  }
}

async function buildTokenHash(instance, options) {
  if (instance.changed('token')) {
    const hash = await bcrypt.hash(instance.token, TOKEN_SALT);
    instance.set('token', hash);
    // eslint-disable-next-line no-param-reassign
    options.validate = false;
  }
}

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'El nombre no puede ser vacío!',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 40],
          msg: 'La contraseña debe tener entre 6 y 40 caracteres!',
        },
        isAlphanumeric: {
          args: true,
          msg: 'La contraseña debe tener sólo letras y números!',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'Email no válido!',
        },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          args: true,
          msg: 'La edad debe ser un número entero!',
        },
        min: {
          args: 1,
          msg: 'La edad debe ser mayor o igual a 1!',
        },
        max: {
          args: 150,
          msg: 'La edad debe ser menor o igual a 150!',
        },
      },
    },
    photo: DataTypes.STRING,
    photoId: DataTypes.STRING,
    role: DataTypes.STRING,
    popularity: DataTypes.INTEGER,
    token: DataTypes.STRING,
  }, {});

  user.associate = function associate(models) {
    user.hasMany(models.pattern, { foreignKey: 'authorId' });
    user.hasMany(models.vote_pattern, { foreignKey: 'userId' });
    user.hasMany(models.comment, { foreignKey: 'userId' });
    user.belongsToMany(models.pattern, { through: 'user_patterns', as: 'usedPatterns' });
    user.belongsToMany(models.user, { through: 'followers', as: 'followedBy', foreignKey: 'followedId' });
    user.belongsToMany(models.user, { through: 'followers', as: 'following', foreignKey: 'followerId' });
    user.belongsToMany(models.pattern, { through: 'favorites', as: 'favoritePatterns' });
  };

  user.beforeCreate(buildPasswordHash);
  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildTokenHash);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};
