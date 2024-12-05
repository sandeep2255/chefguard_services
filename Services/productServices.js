const Sequelize = require("sequelize")
const { ProductDetails } = require("../database/models/productdetails");
const { ProductFeatures } = require("../database/models/productfeatures");
const { ProductImage } = require("../database/models/productimage");
const {OfferTable} = require("../database/models/offertable");
const { sequelize } = require("../database/index");
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

    static async addMultipleItems(itemDetails){
       const items = itemDetails.items
       let productDetailsArr = []
       let featureDetailsArr = []
       let imageDetailsArr = []

       const t = await sequelize.transaction();
       try{
           items.map((item)=>{
                const productId = uuidv4(); // generating Unique id for product
                const { productName, Model, Price, Description, features, images } = item
                
                let details = {
                    Product_Id:productId,
                    Product_name: productName,
                    Model: Model,
                    Price: Price,
                    Description: Description
                }
                productDetailsArr.push(details);
    
                let featuredetails = {
                    Product: productName,
                    Feature: features
                }
                featureDetailsArr.push(featuredetails);
    
                let imagedetails = {
                    Product: productName,
                    images: images
                }
                imageDetailsArr.push(imagedetails);
           })// Bulk inserting product details to ProductDetail table
           await ProductDetails.bulkCreate(productDetailsArr, {transaction:t});

            if (featureDetailsArr && featureDetailsArr.length > 0) {
                let productFeatureData =[]
                featureDetailsArr.forEach(async (Allfeatures)=>{
                    console.log("dsafsdafasfas",Allfeatures)
                    const featureProductDetail = await ProductDetails.findOne({
                            where: {
                                product_name: Allfeatures.Product
                            },
                            attributes: ['id']
                
                    });
                    
                    productFeatureData = Allfeatures.Feature.map((feature) => {
                        const feature_id = uuidv4()
                            return {
                                Product_Id: featureProductDetail.Product_Id,
                                Feature_Id: feature_id,
                                Feature: feature
                            }
                    })
                })
                await ProductFeatures.bulkCreate(productFeatureData,{transaction:t})
            }// creating an entry to productFeatures column and getting the values in productFeatureData

            if (imageDetailsArr && imageDetailsArr.length > 0) {
                let productImageData =[]
                imageDetailsArr.forEach(async (AllImages)=>{
                    
                    let ImageProductDetail = await ProductDetails.findOne({
                        where:{
                            product_name:{

                                [Sequelize.Op.in]:AllImages.product
                            }
                        }
                    });
                    productImageData = AllImages.images.map((image) => {
                        const image_id = uuidv4()
                            return {
                                image_id:image_id,
                                ProductId: ImageProductDetail.Product_Id,
                                image_url: image.imageUrl,
                                image_name: image.imageName,
                                storage_platform: image.storage_platform
                            }
                    })
                })
                await ProductImage.bulkCreate(productImageData,{transaction:t})
            }// creating multiple entry to productImages column and getting the values in productImageData
            t.commit()
       }catch(error){
            t.rollback();
            throw new ApiError('500', error.message,"failed to add items");
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