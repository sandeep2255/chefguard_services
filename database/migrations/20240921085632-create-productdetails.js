'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProductDetails', {
      Product_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Product_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Model: {
        type: Sequelize.STRING
      },
      Price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      Description: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('ProductDetails');
  }
};
