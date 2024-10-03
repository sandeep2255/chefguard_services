'use strict';

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OfferTable', {
      Product_id: {
        type: Sequelize.STRING,
        references: {
          model: 'productdetails',
          key: 'Product_Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      offer_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      offer_price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      offer_percentage: {
        type: Sequelize.DECIMAL(5, 2)
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
    await queryInterface.dropTable('OfferTable');
  }
};
