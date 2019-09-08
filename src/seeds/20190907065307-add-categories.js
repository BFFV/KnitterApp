module.exports = {
  up: (queryInterface) => {
    const categoriesData = [
      {
        name: 'Telares',
        description: 'El telar es una máquina para tejer, construida con madera o metal,'
        + ' en la que se colocan unos hilos paralelos, denominados urdimbres, que deben'
        + ' sujetarse a ambos lados para tensarlos',
        accepted: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('categories', categoriesData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('categories', null, {}),
};
