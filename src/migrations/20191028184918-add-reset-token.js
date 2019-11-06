'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'resetToken',
    {
      type: Sequelize.STRING,
      allowNull: true,
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
  )
  .then(() => queryInterface.addColumn(
      'users',
      'resetTokenExpires',
      {
        type: Sequelize.DATE,
        allowNull: true,
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
    )),


  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'resetToken',
  )
  .then(() => queryInterface.removeColumn(
      'users',
      'resetTokenExpires',
    )),
};
