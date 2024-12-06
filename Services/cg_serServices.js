const Sequelize = require("sequelize")
const { sequelize } = require("../database/index");
const { v4: uuidv4 } = require('uuid');
const { ApiError } = require("../utils/ApiError");
const { ServiceDetails } = require("../database/models/servicedetails");

class cg_serServices {
    static async addItem(itemDetails) {
        const { Service_name, Logo_url, Description } = itemDetails
        const t = await sequelize.transaction();
        try {
            const Service_Id = uuidv4() // generating a unique id using uuid for product
            const newServiceDetails = await ServiceDetails.create(
                {
                    Service_Id:Service_Id,
                    Service_name: Service_name,
                    Logo_url: Logo_url,
                    Description: Description
                },
                { transaction: t } // transaction initiated
            ) // creating an entry to productDetails column and getting the values in newProductDetails
            await t.commit()
            return {
                serviceDetails: newServiceDetails
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
    
    static async updateItems(Service_Id, itemDetails) {
        const { Service_name, Logo_url, Description } = itemDetails
        const t = await sequelize.transaction();
    
        try {
            const existingProduct = await ServiceDetails.findByPk(Service_Id, { transaction: t });
            if (!existingProduct) {
                throw new ApiError('404', 'Service not found', `No Service with ID ${Service_Id} exists`);
            }
    
            await ServiceDetails.update(
                {
                    Service_name: Service_name,
                    Logo_url: Logo_url,
                    Description: Description
                },
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

}

module.exports = {cg_serServices}