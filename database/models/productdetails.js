'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductDetails extends Model {
    static associate(models) {
      ProductDetails.hasMany(models.ProductFeatures, {
        foreignKey: 'Product_Id',
        as: 'features'
      });
      ProductDetails.hasMany(models.OfferTable, {
        foreignKey: 'Product_id',
        as: 'offers'
      });
      ProductDetails.hasMany(models.ProductImage, {
        foreignKey: 'ProductId',
        as: 'images'
      });
    }
  }
  ProductDetails.init({
    Product_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Product_name: DataTypes.STRING,
    Model: DataTypes.STRING,
    Price: DataTypes.DECIMAL(10, 2),
    Description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ProductDetails',
  });
  return ProductDetails;
};
