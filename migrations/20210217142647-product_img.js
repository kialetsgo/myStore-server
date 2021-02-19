'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'products',
      'image',
      {
        type: Sequelize.STRING,
        allowNull: false
      })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('products', 'image');
  }
};
