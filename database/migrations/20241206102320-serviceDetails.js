'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('servicedetails', {
      Service_Id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      Service_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Logo_url: {
        type: Sequelize.STRING
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('servicedetails');
  }
};
