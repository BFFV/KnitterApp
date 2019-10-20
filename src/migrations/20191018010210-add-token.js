module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'token',
    {
      type: Sequelize.STRING,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
  ),

  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'token',
  ),
};
