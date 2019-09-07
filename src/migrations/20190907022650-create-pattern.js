module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('patterns', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    score: {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.INTEGER,
    },
    instructions: {
      allowNull: false,
      type: Sequelize.JSON,
    },
    video: {
      type: Sequelize.STRING,
    },
    image: {
      allowNull: false,
      type: Sequelize.STRING,
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

  down: (queryInterface) => queryInterface.dropTable('patterns'),
};
