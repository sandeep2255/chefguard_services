'use strict';

const { UUIDV4 } = require('sequelize');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('servicedetails', [
      {
        Service_Id: UUIDV4(),
        Service_name: 'Web Development',
        Logo_url: 'https://example.com/web-development-logo.png',
        Description: 'We offer full-stack web development services.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Service_Id: UUIDV4(),
        Service_name: 'Mobile App Development',
        Logo_url: 'https://example.com/mobile-app-logo.png',
        Description: 'Custom mobile application development for iOS and Android.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        Service_Id: Sequelize.UUIDV4(),
        Service_name: 'Digital Marketing',
        Logo_url: 'https://example.com/digital-marketing-logo.png',
        Description: 'End-to-end digital marketing solutions for your business.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // To undo the seeding (useful for rollback)
    await queryInterface.bulkDelete('servicedetails', null, {});
  }
};
