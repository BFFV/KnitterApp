module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('vote_patterns', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    patternId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },

    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },

    rating: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },

  }),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
