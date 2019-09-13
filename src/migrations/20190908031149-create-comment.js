module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('comments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    content: {
      allowNull: false,
      type: Sequelize.TEXT,
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

  down: (queryInterface) => queryInterface.dropTable('comments'),
};
