const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const ProductDetails = sequelize.define('ProductDetails', {
  Product_Id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  Product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'productdetails',
});


ProductDetails.associate = (models) => {
    ProductDetails.hasMany(models.ProductFeatures, {
        foreignKey: 'Product_Id',
        as: 'features',
    });
    ProductDetails.hasMany(models.OfferTable, {
        foreignKey: 'Product_id',
        as: 'offers',
    });
    ProductDetails.hasMany(models.ProductImage, {
        foreignKey: 'ProductId',
        as: 'images',
    });
};

module.exports = {ProductDetails};
