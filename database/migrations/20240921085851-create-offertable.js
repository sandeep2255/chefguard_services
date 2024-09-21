'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('OfferTables', {
      Product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ProductDetails',
          key: 'Product_Id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      offer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
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
    await queryInterface.dropTable('OfferTables');
  }
};
