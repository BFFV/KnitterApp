module.exports = {
  up: (queryInterface) => {
    const patternsData = [
      {
        name: 'Mandalas',
        instructions: '1) Dibujar círculos\n2) Dibujar cuadrados\n3) Repetir patrón cíclicamente',
        video: 'https://www.youtube.com/watch?v=1sg3Rt4KZpQ',
        image: 'https://res.cloudinary.com/webhitos/image/upload/v1571539053/hibale5troxdurtj9dlw.jpg',
        imageId: 'default',
        tension: 'Leve',
        authorId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        name: 'Lana de Oveja',
        instructions: '1) Dibujar círculos\n2) Dibujar cuadrados\n3) Repetir patrón cíclicamente',
        video: 'https://www.youtube.com/watch?v=1sg3Rt4KZpQ',
        image: 'https://res.cloudinary.com/webhitos/image/upload/v1571539053/hibale5troxdurtj9dlw.jpg',
        tension: 'Leve',
        authorId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Nieve',
        instructions: '1) Dibujar círculos\n2) Dibujar cuadrados\n3) Repetir patrón cíclicamente',
        video: 'https://www.youtube.com/watch?v=1sg3Rt4KZpQ',
        image: 'https://res.cloudinary.com/webhitos/image/upload/v1571539053/hibale5troxdurtj9dlw.jpg',
        tension: 'Leve',
        authorId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Cascadas',
        instructions: '1) Dibujar círculos\n2) Dibujar cuadrados\n3) Repetir patrón cíclicamente',
        video: 'https://www.youtube.com/watch?v=1sg3Rt4KZpQ',
        image: 'https://res.cloudinary.com/webhitos/image/upload/v1571539053/hibale5troxdurtj9dlw.jpg',
        tension: 'Leve',
        authorId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    return queryInterface.bulkInsert('patterns', patternsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('patterns', null, {}),
};
