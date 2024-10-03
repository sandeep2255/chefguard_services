'use strict';

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productimages', {
      image_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      ProductId: {
        type: Sequelize.STRING,
        references: {
          model: 'productdetails',
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
    await queryInterface.dropTable('productimages');
  }
};
