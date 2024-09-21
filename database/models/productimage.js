const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const ProductImage = sequelize.define('ProductImage', {
    image_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ProductDetails',
            key: 'ProductId',
        },
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    storage_platform: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'ProductImage',
});

ProductImage.associate = (models) => {
    ProductImage.belongsTo(models.ProductDetails, {
        foreignKey: 'ProductId',
        as: 'product',
    });
};

module.exports = {ProductImage};
