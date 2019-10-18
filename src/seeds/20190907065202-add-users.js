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
        photo: 'Foto',
        role: 'admin',
        token: bcrypt.hashSync('BFFV', TOKEN_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Nicolás Riera',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        email: 'nariera@uc.cl',
        age: 22,
        photo: 'Foto2',
        role: 'top',
        token: bcrypt.hashSync('Nicolás Riera', TOKEN_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'Juan Aguillón',
        password: bcrypt.hashSync('123456', PASSWORD_SALT),
        email: 'jjaguillon@uc.cl',
        age: 22,
        photo: 'Foto3',
        role: 'common',
        token: bcrypt.hashSync('Juan Aguillón', TOKEN_SALT),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('users', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
