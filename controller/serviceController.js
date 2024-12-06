const { sequelize } = require("../database/index");
const { ServiceDetails } = require("../database/models/servicedetails");
const { cg_serServices } = require("../Services/cg_serServices");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/AsyncHandler");
const Sequelize = require("sequelize");



const createService = asyncHandler(async(req,res,next)=>{
    try{
        const ServiceData = req.body
        const responseData = await cg_serServices.addItem(ServiceData)
        if (!responseData) {
            throw new ApiError(400, 'Invalid product data');
        }
        return res.json(new ApiResponse('200', responseData,'Success'))
    }catch(error){
        next(error)
    }
})

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

        let Details = await ServiceDetails.findAll();
          
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

        const services = await ServiceDetails.findByPk(Service_Id)
        if(!services){
            throw new ApiError(400, 'Product Not Found');
        }

        const responseData = await cg_serServices.updateItems(Service_Id, itemDetails)
        if (!responseData) {
            throw new ApiError(400, 'Invalid product data');
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
            const product = await ServiceDetails.findOne({ where: { Service_Id } });
            if (!product) {
                throw new ApiError(404, `Product with ID ${Service_Id} not found`);
            }

            await ServiceDetails.destroy({ where: { Service_Id }, transaction: t });

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
    deleteService
}