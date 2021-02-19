'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'products',
        'brand',
        {
          type: Sequelize.STRING
        }
      ),
      queryInterface.addColumn(
        'products',
        'color',
        {
          type: Sequelize.STRING
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('products', 'brand'),
      queryInterface.removeColumn('products', 'color')
    ]);
  }
};
