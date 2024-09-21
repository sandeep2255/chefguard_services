
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductFeatures extends Model {
    static associate(models) {
      ProductFeatures.belongsTo(models.ProductDetails, {
        foreignKey: 'Product_Id',
        as: 'product'
      });
    }
  }
  ProductFeatures.init({
    Product_Id: DataTypes.INTEGER,
    Feature_Id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    Feature: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductFeatures',
  });
  return ProductFeatures;
};
