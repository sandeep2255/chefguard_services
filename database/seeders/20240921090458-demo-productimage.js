'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('ProductImages', [
      {
        image_id: 1,
        ProductId: 1,
        image_url: 'https://example.com/smartphone.jpg',
        image_name: 'smartphone_image',
        storage_platform: 'AWS S3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        image_id: 2,
        ProductId: 2,
        image_url: 'https://example.com/laptop.jpg',
        image_name: 'laptop_image',
        storage_platform: 'AWS S3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('ProductImages', null, {});
  }
};
