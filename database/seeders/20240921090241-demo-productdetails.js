'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('productdetails', [
      {
        Product_Id: 1,
        Product_name: 'Smartphone',
        Model: 'X100',
        Price: 599.99,
        Description: 'A high-performance smartphone with advanced features.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        Product_Id: 2,
        Product_name: 'Laptop',
        Model: 'L200',
        Price: 899.99,
        Description: 'A lightweight and powerful laptop for all your needs.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('productdetails', null, {});
  }
};
