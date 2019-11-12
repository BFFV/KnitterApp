const bcrypt = require('bcrypt');

const PASSWORD_SALT = 10;
const TOKEN_SALT = 10;

module.exports = {
  up: (queryInterface) => {
    const usersData = [
      {
        username: 'BFFV',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        email: 'bffarias@uc.cl',
        age: 20,
        photo: 'https://res.cloudinary.com/webhitos/image/upload/v1571539053/hibale5troxdurtj9dlw.jpg',
        photoId: 'default',
        role: 'admin',
        popularity: 0,
        token: bcrypt.hashSync('BFFV', TOKEN_SALT),
        resetToken: null,
        resetTokenExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Nicolás Riera',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        email: 'nariera@uc.cl',
        age: 22,
        photo: 'https://res.cloudinary.com/webhitos/image/upload/v1571539053/hibale5troxdurtj9dlw.jpg',
        photoId: 'default',
        role: 'top',
        popularity: 0,
        token: bcrypt.hashSync('Nicolás Riera', TOKEN_SALT),
        resetToken: null,
        resetTokenExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Juan Aguillón',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        email: 'jjaguillon@uc.cl',
        age: 22,
        photo: 'https://res.cloudinary.com/webhitos/image/upload/v1571539053/hibale5troxdurtj9dlw.jpg',
        photoId: 'default',
        role: 'common',
        popularity: 0,
        token: bcrypt.hashSync('Juan Aguillón', TOKEN_SALT),
        resetToken: null,
        resetTokenExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('users', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
