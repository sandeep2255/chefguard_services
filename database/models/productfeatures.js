const { DataTypes } = require('sequelize');
const { sequelize } = require('../index'); // Assuming sequelize is exported from your index file

const ProductFeatures = sequelize.define('ProductFeatures', {
    Feature_Id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    Product_Id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ProductDetails',
        key: 'Product_Id',
      },
    },
    Feature: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    tableName: 'productfeatures',
  });


ProductFeatures.associate = (models) => {
    ProductFeatures.belongsTo(models.ProductDetails, {
        foreignKey: 'Product_Id',
        as: 'product',
    });
};

module.exports = {ProductFeatures};
