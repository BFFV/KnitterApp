module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'favorites',
    {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },

      patternId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
    },
  ),

  down: (queryInterface) => queryInterface.dropTable('favorites'),
};
