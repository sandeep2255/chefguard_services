const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const ServiceDetails = sequelize.define('ServiceDetails', {
  Service_Id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  Service_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Logo_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'servicedetails',
});

module.exports = {ServiceDetails};
