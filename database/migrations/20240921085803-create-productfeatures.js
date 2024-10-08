'use strict';

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('productfeatures', {
      Product_Id: {
        type: Sequelize.STRING,
        references: {
          model: 'productdetails',
          key: 'Product_Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Feature_Id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      Feature: {
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
    await queryInterface.dropTable('productfeatures');
  }
};
