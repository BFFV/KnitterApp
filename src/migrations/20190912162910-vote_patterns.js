module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('vote_patterns', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER,
      primaryKey: true,
    },

    patternId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'patterns',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },

    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
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

  down: (queryInterface) => queryInterface.dropTable('vote_patterns'),
};
