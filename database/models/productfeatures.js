const { DataTypes } = require('sequelize');
const { sequelize } = require('../index'); // Assuming sequelize is exported from your index file

const ProductFeatures = sequelize.define('ProductFeatures', {
    Product_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ProductDetails',
            key: 'ProductId',
        },
    },
    Feature_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    Feature: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'ProductFeatures',
});


ProductFeatures.associate = (models) => {
    ProductFeatures.belongsTo(models.ProductDetails, {
        foreignKey: 'Product_Id',
        as: 'product',
    });
};

module.exports = {ProductFeatures};
