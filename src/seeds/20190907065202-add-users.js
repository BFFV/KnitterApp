module.exports = {
  up: (queryInterface) => {
    const usersData = [
      {
        username: 'BFFV',
        password: '123456',
        email: 'bffarias@uc.cl',
        age: 20,
        photo: 'Foto',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('users', usersData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('users', null, {}),
};
