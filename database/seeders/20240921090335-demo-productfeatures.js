'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('productfeatures', [
      {
        Product_Id: 1,
        Feature_Id: 1,
        Feature: '5G Connectivity',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Product_Id: 1,
        Feature_Id: 2,
        Feature: 'OLED Display',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Product_Id: 2,
        Feature_Id: 3,
        Feature: '8GB RAM',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('productfeatures', null, {});
  }
};
