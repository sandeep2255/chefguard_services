'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductImages', {
      image_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      ProductId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ProductDetails',
          key: 'Product_Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      image_url: {
        type: Sequelize.STRING
      },
      image_name: {
        type: Sequelize.STRING
      },
      storage_platform: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProductImages');
  }
};
