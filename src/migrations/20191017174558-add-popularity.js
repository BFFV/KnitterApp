module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'popularity',
    {
      type: Sequelize.INTEGER,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade',
      defaultValue: 0,
    },
  )
    .then(() => queryInterface.addColumn(
      'patterns',
      'popularity',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade',
        defaultValue: 0,
      },
    )),

  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'popularity',
  )
    .then(() => queryInterface.removeColumn(
      'patterns',
      'popularity',
    )),
};
