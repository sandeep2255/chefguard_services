'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('serviceimages', {
      image_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      Service_Id: {
        type: Sequelize.STRING,  // This matches the type in servicedetails
        allowNull: false,
      },
      image_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      storage_platform: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Creating foreign key association
    await queryInterface.addConstraint('serviceimages', {
      fields: ['Service_Id'],
      type: 'foreign key',
      name: 'serviceimages_service_id_fk',
      references: {
        table: 'servicedetails', // Ensure this table exists
        field: 'Service_Id',  // Field in servicedetails should also be a STRING
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('serviceimages');
  }
};
