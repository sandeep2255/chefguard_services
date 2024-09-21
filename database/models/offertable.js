const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');

const OfferTable = sequelize.define('OfferTable', {
    Product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    offer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    offer_price: DataTypes.DECIMAL(10, 2),
    offer_percentage: DataTypes.DECIMAL(5, 2),
}, {
    sequelize,
    modelName: 'OfferTable',
});

OfferTable.associate = (models) => {
    OfferTable.belongsTo(models.ProductDetails, {
        foreignKey: 'Product_id',
        as: 'product',
    });
};

module.exports = {OfferTable};
