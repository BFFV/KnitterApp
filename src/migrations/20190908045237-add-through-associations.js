module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'user_patterns',
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
  )
    .then(() => queryInterface.createTable(
      'pattern_materials',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        patternId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          primaryKey: true,
        },

        materialId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
      },
    ))
    .then(() => queryInterface.createTable(
      'followers',
      {
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        followerId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          primaryKey: true,
        },

        followedId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
      },
    )),

  down: (queryInterface) => queryInterface.dropTable('user_patterns')
    .then(() => queryInterface.dropTable('pattern_materials'))
    .then(() => queryInterface.dropTable('followers')),
};
