module.exports = {
  up: (queryInterface) => {
    const materialsData = [
      {
        name: 'Lana de Oveja',
        description: 'Lana obtenida del Sur.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('materials', materialsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('materials', null, {}),
};
