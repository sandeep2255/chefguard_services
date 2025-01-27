const Sequelize = require("sequelize")
const { ProductDetails } = require("../database/models/productdetails");
const { ProductImage } = require("../database/models/productimage");
const {OfferTable} = require("../database/models/offertable");
const { sequelize } = require("../database/index");
const { v4: uuidv4 } = require('uuid');
const {} = require("./cloudinary_services");
const { ApiError } = require("../utils/ApiError");
const { Readable } =  require('stream')
const {cloudinaryServices} = require('./cloudinary_services')

class productServices {
    static async addItem(itemDetails, imageData) {
        console.log(itemDetails)
        const { productName, Model, Price, Description, offerPercentage} = itemDetails


        // const fileDetails = imageData.map(image => ({
        //     originalName: file.originalname,
        //     fileName: file.filename,
        //     path: file.path,
        //     size: file.size
            
        // }));
        const existingProduct = await ProductDetails.findOne({
            where: {
              Product_name: productName,
              Model: Model
            }
          });

        if (existingProduct){
            throw new ApiError('409',"Item already exist");
        }

        const uploadPromises = imageData.map(async (image) => {
            const fileName = image.originalname;
            const fileBuffer = image.buffer;
        
            const cloudinaryClient = await cloudinaryServices.cloudinaryConfig();
        
            return cloudinaryServices.uploadFile(cloudinaryClient, fileBuffer, fileName, '189','152');
        });
        
        const images = await Promise.all(uploadPromises);

        const t = await sequelize.transaction();
        try {
            const productId = uuidv4()
            const newProductDetails = await ProductDetails.create(
                {
                    Product_Id:productId,
                    Product_name: productName,
                    Model: Model,
                    Price: Price,
                    Description: Description
                },
                { transaction: t }
            )
            await t.commit();

            let offerDetails = {productId:productId, offerPercentage:offerPercentage}
            this.addOfferItem(offerDetails);

            // const offerId = uuidv4()
            // const newOfferDetails = await OfferTable.create(
            //     {
            //         Product_id:productId,
            //         offer_id: offerId,
            //         offer_price: offerPrice,
            //         offer_percentage: offerPercentage,
            //     },
            //     { transaction: t }
            // )
            // await t.commit();

            let productImageData = []
            if (images && images.length > 0) {
                const t = await sequelize.transaction();
                productImageData = images.map((image) => {
                    const image_id = uuidv4()
                        return {
                            image_id:image_id,
                            ProductId: newProductDetails.Product_Id,
                            image_url: image.url,
                            image_name: image.public_id,
                            storage_platform: 'CLOUDINARY'
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
        const { productName, Model, Price, Description, offerPercentage } = itemDetails;
        const t = await sequelize.transaction();
    
        try {
            const existingProduct = await ProductDetails.findByPk(productId, { transaction: t });
            if (!existingProduct) {
                throw new ApiError('404', 'Product not found', `No product with ID ${productId} exists`);
            }

            // let fileName = imageData.originalname

            // let fileBuffer = imageData.buffer;


            // const cloudinaryClient = await cloudinaryServices.cloudinaryConfig()
            
            // const details = await cloudinaryServices.uploadFile(cloudinaryClient, fileBuffer, fileName)

            // const images = [details];
    
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

            let offerDetails = {productId:productId, offerPercentage:offerPercentage}

            this.updateOfferItem(offerDetails)

    
            // if (images && images.length > 0) {
            //     // await ProductImage.destroy({
            //     //     where: { ProductId: productId },
            //     //     transaction: t
            //     // });
    
            //     const updatedImages = images.map((image) => ({
            //         image_id: uuidv4(),
            //         ProductId: productId,
            //         image_url: image.url,
            //         image_name: image.public_id,
            //         storage_platform: 'CLOUDINARY'
            //     }));
            //     await ProductImage.bulkCreate(updatedImages, { transaction: t });
            // }
    
            await t.commit();
    
            const responseData =  {
                    productId,
                    productName,
                    Model,
                    Price,
                    Description,
                };
            return responseData;
        } catch (error) {
            await t.rollback();
            throw new ApiError('500', error.message, 'Failed to update item');
        }
    }    

    static async addImageToProduct(productId, imageData){
        const t = await sequelize.transaction();
        var updatedImages = null;
        try{


            const uploadPromises = imageData.map(async (image) => {
                const fileName = image.originalname;
                const fileBuffer = image.buffer;
            
                const cloudinaryClient = await cloudinaryServices.cloudinaryConfig();
            
                return cloudinaryServices.uploadFile(cloudinaryClient, fileBuffer, fileName, '189','152');
            });
            
            const images = await Promise.all(uploadPromises);

            if (images && images.length > 0) {
                // await ProductImage.destroy({
                //     where: { ProductId: productId },
                //     transaction: t
                // });

                updatedImages = images.map((image) => ({
                    image_id: uuidv4(),
                    ProductId: productId,
                    image_url: image.url,
                    image_name: image.public_id,
                    storage_platform: 'CLOUDINARY'
                }));
                await ProductImage.bulkCreate(updatedImages, { transaction: t });
            }
            await t.commit();
            return updatedImages;

        }catch(error){
            await t.rollback();
            throw new ApiError('500', error.message, 'Failed to upload item');
        }
        
    }

    static async deleteImageofProducts(image_name,image_id){
        const t = await sequelize.transaction();
        try{

            const cloudinaryClient = await cloudinaryServices.cloudinaryConfig();
            await cloudinaryServices.deleteFile(cloudinaryClient,image_name)

            await ProductImage.destroy({
                where: { image_id: image_id },
                transaction: t
            })

            await t.commit()
            return image_name

        }catch(error){
            await t.rollback();
            throw new ApiError('500', error.message, 'Failed to delete item');
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


    static async updateOfferItem(offerDetails){
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

            const offerData = await OfferTable.update({
                offer_price:offerPrice,
                offer_percentage:offerPercentage
            },
            {
                where: { Product_Id: productId },
                transaction: t
            }) // inserting offer details to offer table

            await t.commit() //committing transaction

            return offerData
        }catch(error){
            await t.rollback();
            throw new ApiError('500', error.message, "could't add offer")
        }
    }
}

module.exports = {productServices}