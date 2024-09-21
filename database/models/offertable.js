'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OfferTable extends Model {
    static associate(models) {
      OfferTable.belongsTo(models.ProductDetails, {
        foreignKey: 'Product_id',
        as: 'product'
      });
    }
  }
  OfferTable.init({
    Product_id: DataTypes.INTEGER,
    offer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    offer_price: DataTypes.DECIMAL(10, 2),
    offer_percentage: DataTypes.DECIMAL(5, 2)
  }, {
    sequelize,
    modelName: 'OfferTable',
  });
  return OfferTable;
};
