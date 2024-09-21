'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('OfferTables', [
      {
        Product_id: 1,
        offer_id: 1,
        offer_price: 549.99,
        offer_percentage: 8.33,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Product_id: 2,
        offer_id: 2,
        offer_price: 799.99,
        offer_percentage: 11.11,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OfferTables', null, {});
  }
};
