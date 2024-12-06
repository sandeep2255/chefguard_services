const Sequelize = require("sequelize")
const { ProductDetails } = require("../database/models/productdetails");
const { ProductImage } = require("../database/models/productimage");
const {OfferTable} = require("../database/models/offertable");
const { sequelize } = require("../database/index");
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require("../utils/ApiError");

class productServices {
    static async addItem(itemDetails) {
        const { productName, Model, Price, Description, images } = itemDetails
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
            await t.commit();

            // inserting product_features
            let productImageData = []
            if (images && images.length > 0) {
                const t = await sequelize.transaction();
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
                await t.commit(); // commiting transactions
            }// creating an entry to productImages column and getting the values in productImageData

        
            return {
                productDetails: newProductDetails, 
                productImage:productImageData
            }
        } catch (error) {
            // await t.rollback();
            throw new ApiError('500', error.message,"failed to add item");
        }
    }

    static async addMultipleItems(itemDetails){
        const items = itemDetails.items;
        let productDetailsArr = [];
        let imageDetailsArr = [];
    
        const t = await sequelize.transaction();
        try {
            for (const item of items) {
                const productId = uuidv4();
                const { productName, Model, Price, Description, images } = item;
                
                let details = {
                    Product_Id: productId,
                    Product_name: productName,
                    Model: Model,
                    Price: Price,
                    Description: Description
                };
                productDetailsArr.push(details);
    
                let imagedetails = {
                    Product_name: productName,
                    images: images
                };
                imageDetailsArr.push(imagedetails);
            }
    
            await ProductDetails.bulkCreate(productDetailsArr, { transaction: t });
            await t.commit()
    
            if (imageDetailsArr.length > 0) {
                const productImageData = [];
                const t = await sequelize.transaction();
    
                for (const AllImages of imageDetailsArr) {
                    let Product_name = AllImages.Product_name;
                    const ImageProductDetail = await ProductDetails.findOne({
                        where: {
                            [Sequelize.Op.or]: [{ Product_name }],
                        },
                    });
    
                    let productImages = AllImages.images;
                    for (const image of productImages) {
                        const image_id = uuidv4();
                        productImageData.push({
                            image_id: image_id,
                            ProductId: ImageProductDetail.Product_Id,
                            image_url: image.imageUrl,
                            image_name: image.imageName,
                            storage_platform: image.storage_platform
                        });
                    }
                }
    
                if (productImageData.length > 0) {
                    await ProductImage.bulkCreate(productImageData, { transaction: t });
                    await t.commit()
                }
            }
            
            return {
                productDetails: productDetailsArr
            }
        } catch (error) {
            // Rollback transaction if any error occurs
            // await t.rollback();
            throw new ApiError('500', error.message, "failed to add items");
        }
    }
    
    static async updateItems(productId, itemDetails) {
        const { productName, Model, Price, Description, features, images } = itemDetails;
        const t = await sequelize.transaction();
    
        try {
            const existingProduct = await ProductDetails.findByPk(productId, { transaction: t });
            if (!existingProduct) {
                throw new ApiError('404', 'Product not found', `No product with ID ${productId} exists`);
            }
    
            await ProductDetails.update(
                {
                    Product_name: productName,
                    Model: Model,
                    Price: Price,
                    Description: Description
                },
                {
                    where: { Product_Id: productId },
                    transaction: t
                }
            );
    
            if (features && features.length > 0) {
                await ProductFeatures.destroy({
                    where: { Product_Id: productId },
                    transaction: t
                });
    
                const updatedFeatures = features.map((feature) => ({
                    Product_Id: productId,
                    Feature_Id: uuidv4(),
                    Feature: feature
                }));
                await ProductFeatures.bulkCreate(updatedFeatures, { transaction: t });
            }
    
            if (images && images.length > 0) {
                // await ProductImage.destroy({
                //     where: { ProductId: productId },
                //     transaction: t
                // });
    
                const updatedImages = images.map((image) => ({
                    image_id: uuidv4(),
                    ProductId: productId,
                    image_url: image.imageUrl,
                    image_name: image.imageName,
                    storage_platform: image.storage_platform
                }));
                await ProductImage.bulkCreate(updatedImages, { transaction: t });
            }
    
            await t.commit();
    
            const responseData =  {
                    productId,
                    productName,
                    Model,
                    Price,
                    Description,
                    features,
                    images
                };
            return responseData;
        } catch (error) {
            await t.rollback();
            throw new ApiError('500', error.message, 'Failed to update item');
        }
    }    

    static async addOfferItem(offerDetails){
        const {productId, offerPercentage} = offerDetails
        const t = await sequelize.transaction();

        try{

            const offerID = uuidv4(); // generating unique id for offer id
            const currentProduct = await ProductDetails.findOne({
                where:{
                    [Sequelize.Op.or]:[{Product_Id:productId}]
                }
            }) // fetching current price

            const offerPrice = currentProduct.Price - ((currentProduct.Price * offerPercentage)/100) // calculating offer price

            const offerData = await OfferTable.create({
                Product_id:productId,
                offer_id:offerID,
                offer_price:offerPrice,
                offer_percentage:offerPercentage
            },{transaction:t}) // inserting offer details to offer table

            await t.commit() //committing transaction

            return offerData
        }catch(error){
            await t.rollback();
            throw new ApiError('500', error.message, "could't add offer")
        }
    }
}

module.exports = {productServices}