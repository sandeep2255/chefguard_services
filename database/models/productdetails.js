const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const ProductDetails = sequelize.define('ProductDetails', {
    Product_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    Product_name: DataTypes.STRING,
    Model: DataTypes.STRING,
    Price: DataTypes.DECIMAL(10, 2),
    Description: DataTypes.TEXT,
}, {
    sequelize,
    modelName: 'ProductDetails',
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
