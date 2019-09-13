module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'patterns',
    'authorId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
  )
    .then(() => queryInterface.addColumn(
      'patterns',
      'categoryId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'categories',
          key: 'id',
        },
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
    )),

  down: (queryInterface) => queryInterface.removeColumn(
    'patterns',
    'authorId',
  )
    .then(() => queryInterface.removeColumn(
      'patterns',
      'categoryId',
    )),
};
