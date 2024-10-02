const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const ProductImage = sequelize.define('ProductImage', {
    image_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    ProductId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'ProductDetails',
        key: 'Product_Id',
      },
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storage_platform: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
    tableName: 'productimages',
  });

ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.ProductDetails, {
        foreignKey: 'ProductId',
        as: 'product',
    });
};

module.exports = {ProductImage};
