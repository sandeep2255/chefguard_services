const { ProductDetails } = require("../database/models/productdetails");
const { ProductFeatures } = require("../database/models/productfeatures");
const { ProductImage } = require("../database/models/productimage");
const { sequelize } = require("../database/index")
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require("../utils/ApiError");

class productServices {
    static async addItem(itemDetails) {
        const { productName, Model, Price, Description, features, images } = itemDetails
        const t = await sequelize.transaction();
        try {
            const productId = uuidv4() // generating a unique id using uuid for product
            const newProductDetails = await ProductDetails.create(
                {
                    Product_Id:productId,
                    Product_name: productName,
                    Model: Model,
                    Price: Price,
                    Description: Description
                },
                { transaction: t } // transaction initiated
            ) // creating an entry to productDetails column and getting the values in newProductDetails
            // inserting product_features
            let productFeatureData = []
            if (features && features.length > 0) {
                productFeatureData = features.map((feature) => {
                    const feature_id = uuidv4()
                        return {
                            Product_Id: newProductDetails.Product_Id,
                            Feature_Id: feature_id,
                            Feature: feature
                        }
                })
                await ProductFeatures.bulkCreate(productFeatureData,{transaction:t})
            }// creating an entry to productFeatures column and getting the values in productFeatureData

            // inserting product_features
            let productImageData = []
            if (images && images.length > 0) {
                productImageData = images.map((image) => {
                    const image_id = uuidv4()
                        return {
                            image_id:image_id,
                            ProductId: newProductDetails.Product_Id,
                            image_url: image.imageUrl,
                            image_name: image.imageName,
                            storage_platform: image.storage_platform
                        }
                })
                await ProductImage.bulkCreate(productImageData,{transaction:t})
            }// creating an entry to productImages column and getting the values in productImageData

            await t.commit(); // commiting transactions
        
            return {
                productDetails: newProductDetails, 
                productFeature:productFeatureData, 
                productImage:productImageData
            }
        } catch (error) {
            await t.rollback();
            throw new ApiError('500', error.message,"failed to add item");
        }
    }
}

module.exports = {productServices}