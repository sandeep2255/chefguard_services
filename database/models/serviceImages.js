const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const ServiceImages = sequelize.define('ServiceImages', {
  Service_Id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  image_id:{
    type:DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey:true,
    allowNull:true,
  },
  image_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storage_platform: {
      type: DataTypes.STRING,
      allowNull: true,
    },
}, {
  timestamps: true,
  tableName: 'serviceimages',
});


ServiceImages.associate = (models) => {
    ServiceImages.belongsTo(models.ServiceDetails, {
        foreignKey: 'Service_Id',
        as: 'service',
    });
};


module.exports = {ServiceImages};
