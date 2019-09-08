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
    commentable: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    commentable_id: {
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

  down: (queryInterface) => queryInterface.dropTable('comments'),
};
