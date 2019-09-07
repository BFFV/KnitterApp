module.exports = {
  up: async (queryInterface) => queryInterface.bulkInsert('patterns', [{
    name: 'Mandalas',
    instructions: '{"1": "Dibujar círculos", "2": "Dibujar cuadrados", "3": "Repetir patrón cíclicamente"}',
    video: 'https://www.youtube.com/watch?v=1sg3Rt4KZpQ',
    image: 'imágen',
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('patterns', null, {});
  },
};
