module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },

    username: {
      allowNull: false,
      type: Sequelize.STRING,
    },

    password: {
      allowNull: false,
      type: Sequelize.STRING,
    },

    email: {
      allowNull: false,
      type: Sequelize.STRING,
    },

    age: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },

    role: {
      allowNull: false,
      type: Sequelize.STRING,
    },

    photo: {
      type: Sequelize.STRING,
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

  down: (queryInterface) => queryInterface.dropTable('users'),
};
