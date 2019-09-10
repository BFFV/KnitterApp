module.exports = {
  up: (queryInterface) => {
    const patternsData = [
      {
        name: 'Mandalas',
        instructions: '1) Dibujar círculos\n2) Dibujar cuadrados\n3) Repetir patrón cíclicamente',
        video: 'https://www.youtube.com/watch?v=1sg3Rt4KZpQ',
        image: 'imagen1',
        tension: 'Leve',
        authorId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    return queryInterface.bulkInsert('patterns', patternsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('patterns', null, {}),
};
