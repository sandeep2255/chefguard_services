const Sequelize = require("sequelize")
const { sequelize } = require("../database/index");
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require("../utils/ApiError");
const { ServiceDetails } = require("../database/models/servicedetails");
const {cloudinaryServices} = require('./cloudinary_services');
const { ServiceImages } = require("../database/models/serviceImages");

class cg_serServices {
    static async addItem(itemDetails, imageData, logoData) {
        const { Service_name, Description } = itemDetails

        const existingService = await ServiceDetails.findOne({
            where: {
                Service_name: Service_name,
            }
        });

        if (existingService){
            throw new ApiError('409',"Item already exist");
        }
        

        const logoName = logoData.originalname;
        const logoBuffer = logoData.buffer;
        const cloudinaryClient = await cloudinaryServices.cloudinaryConfig();
        const logo_details = await cloudinaryServices.uploadFile(cloudinaryClient, logoBuffer, logoName, '75', '55');

        const uploadPromises = imageData.map(async (image) => {
            const fileName = image.originalname;
            const fileBuffer = image.buffer;
        
            // const cloudinaryClient = await cloudinaryServices.cloudinaryConfig();
        
            return cloudinaryServices.uploadFile(cloudinaryClient, fileBuffer, fileName, '290', '102');
        });

        const images = await Promise.all(uploadPromises);

        const t = await sequelize.transaction();
        try {
            const Service_Id = uuidv4() // generating a unique id using uuid for product
            const newServiceDetails = await ServiceDetails.create(
                {
                    Service_Id:Service_Id,
                    Service_name: Service_name,
                    Logo_url: logo_details.url,
                    Description: Description
                },
                { transaction: t } // transaction initiated
            ) // creating an entry to productDetails column and getting the values in newProductDetails
            await t.commit()
            let serviceImageData = []
            if (images && images.length > 0) {
                const t = await sequelize.transaction();
                serviceImageData = images.map((image) => {
                    const image_id = uuidv4()
                        return {
                            image_id:image_id,
                            Service_Id: newServiceDetails.Service_Id,
                            image_url: image.url,
                            image_name: image.public_id,
                            storage_platform: 'CLOUDINARY'
                        }
                })
                await ServiceImages.bulkCreate(serviceImageData,{transaction:t})
                await t.commit(); // commiting transactions
            }
            return {
                serviceDetails: newServiceDetails,
                serviceImageData:serviceImageData
            }
        } catch (error) {
            // await t.rollback();
            throw new ApiError('500', error.message,"failed to add item");
        }
    }

    static async addMultipleItems(itemDetails){
        const items = itemDetails.items;
        let ServiceDetailsArr = [];
    
        const t = await sequelize.transaction();
        try {
            for (const item of items) {
                const Service_Id = uuidv4();
                const { Service_name, Logo_url, Description } = item
                
                let details = {
                    Service_Id: Service_Id,
                    Service_name: Service_name,
                    Logo_url: Logo_url,
                    Description: Description
                };
                ServiceDetailsArr.push(details);
            }
    
            await ServiceDetails.bulkCreate(ServiceDetailsArr, { transaction: t });
            await t.commit()
            
            return {
                serviceDetails: ServiceDetailsArr
            }
        } catch (error) {
            // Rollback transaction if any error occurs
            await t.rollback();
            throw new ApiError('500', error.message, "failed to add items");
        }
    }
    
    static async updateItems(Service_Id, itemDetails, imageData) {
        const { Service_name, Logo_url, Description } = itemDetails
        const imageValid = imageData

        let updateData = {
            Service_name: Service_name, // Always update Service_name
            Description: Description,  // Include Description by default
        };

        if(imageValid){

            const fileName = imageData.originalname;
            const fileBuffer = imageData.buffer;
        
            const cloudinaryClient = await cloudinaryServices.cloudinaryConfig();
        
            const uploadDetails = await cloudinaryServices.uploadFile(cloudinaryClient, fileBuffer, fileName, '75', '55');
            updateData.Logo_url = uploadDetails.url;
        }
        const t = await sequelize.transaction();
    
        try {
            const existingProduct = await ServiceDetails.findByPk(Service_Id, { transaction: t });
            if (!existingProduct) {
                throw new ApiError('404', 'Service not found', `No Service with ID ${Service_Id} exists`);
            }

    
            await ServiceDetails.update(
                updateData,
                {
                    where: { Service_Id: Service_Id },
                    transaction: t
                }
            );

            await t.commit();
    
            const responseData =  {
                    Service_Id,
                    Service_name,
                    Logo_url,
                    Description
                };
            return responseData;
        } catch (error) {
            await t.rollback();
            throw new ApiError('500', error.message, 'Failed to update item');
        }
    }

    static async addImageToService(serviceId, imageData){
        const t = await sequelize.transaction();
        var updatedImages = null;
        try{


            const uploadPromises = imageData.map(async (image) => {
                const fileName = image.originalname;
                const fileBuffer = image.buffer;
            
                const cloudinaryClient = await cloudinaryServices.cloudinaryConfig();
            
                return cloudinaryServices.uploadFile(cloudinaryClient, fileBuffer, fileName, '290', '102');
            });
            
            const images = await Promise.all(uploadPromises);

            if (images && images.length > 0) {
                // await ProductImage.destroy({
                //     where: { ProductId: productId },
                //     transaction: t
                // });

                updatedImages = images.map((image) => ({
                    image_id: uuidv4(),
                    Service_Id: serviceId,
                    image_url: image.url,
                    image_name: image.public_id,
                    storage_platform: 'CLOUDINARY'
                }));
                await ServiceImages.bulkCreate(updatedImages, { transaction: t });
            }
            await t.commit();
            return updatedImages;

        }catch(error){
            await t.rollback();
            throw new ApiError('500', error.message, 'Failed to upload item');
        }
        
    }

    static async deleteImageofServices(image_name, image_id){
        const t = await sequelize.transaction();
        try{

            const cloudinaryClient = await cloudinaryServices.cloudinaryConfig();
            await cloudinaryServices.deleteFile(cloudinaryClient,image_name)

            await ServiceImages.destroy({
                where:{image_id:image_id}
            });

            await t.commit()
            return image_id

        }catch(error){
            await t.rollback();
            throw new ApiError('500', error.message, 'Failed to delete item');
        }

    }

}

module.exports = {cg_serServices}