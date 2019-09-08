module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('votes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    rating: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },

    // Timestamps
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('votes'),
};
