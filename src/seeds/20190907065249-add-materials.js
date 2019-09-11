module.exports = {
  up: (queryInterface) => {
    const materialsData = [
      {
        name: 'Lana de Oveja',
        description: 'Lana obtenida del Sur.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Hilo',
        description: 'Hilo de gran calidad.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Botones Medianos',
        description: 'Botones de aprox. 1 cm. de radio.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('materials', materialsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('materials', null, {}),
};
