module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'photoId',
    {
      type: Sequelize.STRING,
      onUpdate: 'cascade',
      onDelete: 'cascade',
      defaultValue: 'default',
    },
  )
    .then(() => queryInterface.addColumn(
      'patterns',
      'imageId',
      {
        type: Sequelize.STRING,
        onUpdate: 'cascade',
        onDelete: 'cascade',
        defaultValue: 'default',
      },
    )),

  down: (queryInterface) => queryInterface.removeColumn(
    'users',
    'photoId',
  )
    .then(() => queryInterface.removeColumn(
      'patterns',
      'imageId',
    )),
};
