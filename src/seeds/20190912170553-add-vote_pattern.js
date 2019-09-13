module.exports = {
  up: (queryInterface) => {
    const vote_patternsData = [
      {
        patternId: 1,
        userId: 1,
        rating: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        patternId: 1,
        userId: 2,
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    return queryInterface.bulkInsert('vote_patterns', vote_patternsData);
  },

  down: (queryInterface) => queryInterface.bulkDelete('vote_patterns', null, {}),
};
