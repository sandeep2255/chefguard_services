'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductFeatures', {
      Product_Id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ProductDetails',
          key: 'Product_Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      Feature_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
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
    await queryInterface.dropTable('ProductFeatures');
  }
};
