const { sequelize } = require("../database/index");
const { ServiceDetails } = require("../database/models/servicedetails");
const { ServiceImages } = require("../database/models/serviceImages");
const { cg_serServices } = require("../Services/cg_serServices");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/AsyncHandler");
const Sequelize = require("sequelize");



const createService = asyncHandler(async(req,res,next)=>{
    try{
        const ServiceData = req.body

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const logo = req.files['logo'] ? req.files['logo'][0] : null;
        const image = req.files['file'] || [];

        const responseData = await cg_serServices.addItem(ServiceData,image, logo)
        if (!responseData) {
            throw new ApiError(400, 'Invalid product data');
        }
        return res.json(new ApiResponse('200', responseData,'Success'))
    }catch(error){
        next(error)
    }
})

const addImage = asyncHandler(async(req,res,next)=>{
    try{
        const Service_Id = req.params.Service_Id;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const image = req.files

        const serviceDetails = await ServiceDetails.findOne({ where: { Service_Id } });
        if (!serviceDetails) {
            throw new ApiError(404, `Service with ID ${Service_Id} not found`);
        }

       
        var data = await cg_serServices.addImageToService(Service_Id, image)
        res.status(200).json(new ApiResponse('200', data, 'Image uploaded successfully'));
    }catch(error){
        next(error);
    }
});

const deleteImage = asyncHandler(async (req,res,next)=>{
    try{
        const image_id = req.params.image_id;

        const imageDetails = await ServiceImages.findOne({ where: { image_id } });
        if (!imageDetails) {
            throw new ApiError(404, `service image with ID ${Product_Id} not found`);
        }

       
        await cg_serServices.deleteImageofServices(imageDetails.image_name, image_id)
        res.status(200).json(new ApiResponse('200', null, 'Image deleted successfully'));

    }catch(error){
        next(error)
    }
});

const createMultipleService = asyncHandler(async(req,res, next)=>{
    try{

        const serviceData = req.body
        const responseData = await cg_serServices.addMultipleItems(serviceData)
        if (!responseData) {
            throw new ApiError(400, 'Invalid product data');
        }
        return res.json(new ApiResponse('200', responseData,'Success'))
    }catch(error){
        next(error)
    }
})

const getServices = asyncHandler(async(req,res,next)=>{
    try{
        responseData = [];
        
        let Details = await ServiceDetails.findAll(
            {
                include:[
                    {
                        model:ServiceImages,
                        as:'images',
                        required:true,
                        attributes:['image_id','image_url','image_name','storage_platform']
                    }
                ]
            }
        );
            
        responseData.push(Details);
        if(!responseData){
            throw new ApiError(400, 'Invalid offer data');
        }
        return res.json(new ApiResponse('200',responseData, 'Success'))
    }catch(error){
        next(error)
    }
})

const getOneService = asyncHandler(async(req,res,next)=>{
    try{
        let Service_Id = req.params.Service_Id;
        responseData = [];

        let Details = await ServiceDetails.findOne(
            {
                include:[
                            {
                                model:ServiceImages,
                                as:'images',
                                required:true,
                                attributes:['image_id','image_url','image_name','storage_platform']
                            },
                        ],
                    where:[{Service_Id}]
            }
        );
          
        responseData.push(Details);
        if(!responseData){
            throw new ApiError(400, 'Invalid offer data');
        }
        return res.json(new ApiResponse('200',responseData, 'Success'))
    }catch(error){
        next(error)
    }
})

const updateService = asyncHandler(async(req,res,next)=>{
    try{
        let Service_Id = req.params.Service_Id;
        const itemDetails = req.body
        const imageData = req.files

        const services = await ServiceDetails.findByPk(Service_Id)
        if(!services){
            throw new ApiError(400, 'service Not Found');
        }

        const responseData = await cg_serServices.updateItems(Service_Id, itemDetails, imageData)
        if (!responseData) {
            throw new ApiError(400, 'Invalid service data');
        }

        return res.json(new ApiResponse('200',responseData, 'Sucessfully Updated'))
    }catch(error){
        next(error)
    }
});

const deleteService = asyncHandler(async (req, res, next) => {
    try {
        const { Service_Id } = req.params;

        const t = await sequelize.transaction();

        try {
            const service = await ServiceDetails.findOne({ where: { Service_Id } });
            if (!service) {
                throw new ApiError(404, `service with ID ${Service_Id} not found`);
            }

            await ServiceDetails.destroy({ where: { Service_Id }, transaction: t });

            await ServiceImages.destroy({where: { Service_Id }, transaction: t})

            await t.commit();

            res.status(200).json(new ApiResponse('200', null, 'Service data deleted successfully'));
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        next(error);
    }
});


module.exports={
    createService,
    createMultipleService,
    getServices,
    getOneService,
    updateService,
    deleteService,
    addImage,
    deleteImage
}