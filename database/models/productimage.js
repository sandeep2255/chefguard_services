'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductImage extends Model {
    static associate(models) {
      ProductImage.belongsTo(models.ProductDetails, {
        foreignKey: 'ProductId',
        as: 'product'
      });
    }
  }
  ProductImage.init({
    image_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    ProductId: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    image_name: DataTypes.STRING,
    storage_platform: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProductImage',
  });
  return ProductImage;
};
