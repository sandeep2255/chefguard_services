const { sequelize } = require("../database/index");
const { OfferTable } = require("../database/models/offertable");
const { ProductDetails } = require("../database/models/productdetails");
const { ProductImage } = require("../database/models/productimage");
const { errorHandler } = require("../middleware/errorHandler");
const {productServices} = require("../Services/productServices")
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/AsyncHandler");
const Sequelize = require("sequelize");



const createProduct = asyncHandler(async(req,res,next)=>{
    try{
        const productData = req.body
        

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const image = req.files

        const responseData = await productServices.addItem(productData, image)
        if (!responseData) {
            throw new ApiError(400, 'Invalid product data');
        }
        return res.json(new ApiResponse('200', responseData,'Success'))
    }catch(error){
        next(error)
    }
})

const createMultipleProducts = asyncHandler(async(req,res, next)=>{
    try{

        const productData = req.body
        const responseData = await productServices.addMultipleItems(productData)
        if (!responseData) {
            throw new ApiError(400, 'Invalid product data');
        }
        return res.json(new ApiResponse('200', responseData,'Success'))
    }catch(error){
        next(error)
    }
})

const createOffer = asyncHandler(async(req,res,next)=>{
    try{

        const offerData = req.body
        const responseData = await productServices.addOfferItem(offerData)
        if(!responseData){
            throw new ApiError(400, 'Invalid offer data');
        }
        return res.json(new ApiResponse('200',responseData, 'Success'))
    }catch(error){
        next(error)
    }
})

const getProducts = asyncHandler(async(req,res,next)=>{
    try{
        responseData = [];

        let Details = await ProductDetails.findAll(
            {
                include:[
                    {
                        model:ProductImage,
                        as:'images',
                        required:false,
                        attributes:['image_id','image_url','image_name','storage_platform']
                    },
                    {
                        model:OfferTable,
                        as:'offers',
                        required:false,
                        attributes:['offer_id','offer_price','offer_percentage']
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

const getOneProducts = asyncHandler(async(req,res,next)=>{
    try{
        let Product_Id = req.params.Product_Id;
        responseData = [];

        let Details = await ProductDetails.findOne(
            {
                include:[
                    {
                        model:ProductImage,
                        as:'images',
                        required:false,
                        attributes:['image_id','image_url','image_name','storage_platform']
                    },
                    {
                        model:OfferTable,
                        as:'offers',
                        required:false,
                        attributes:['offer_id','offer_price','offer_percentage']
                    }
                ],
                where:[{Product_Id}]
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

const updateProducts = asyncHandler(async(req,res,next)=>{
    try{
        let Product_Id = req.params.Product_Id;
        const itemDetails = req.body
        const { productName, Model, Price, Description } = itemDetails
        let Product_name = productName

        // const productId = await ProductDetails.findOne({
        //     where:{
        //         [Sequelize.Op.or]:[{Product_name}]
        //     },
        //     attributes:['Product_Id']
        // })
        if(!Product_Id){
            throw new ApiError(400, 'Product Not Found');
        }

        const responseData = await productServices.updateItems(Product_Id, itemDetails)
        if (!responseData) {
            throw new ApiError(400, 'Invalid product data');
        }

        return res.json(new ApiResponse('200',responseData, 'Sucessfully Updated'))
    }catch(error){
        next(error)
    }
});

const deleteProduct = asyncHandler(async (req, res, next) => {
    try {
        const { Product_Id } = req.params;

        const t = await sequelize.transaction();

        try {
            const product = await ProductDetails.findOne({ where: { Product_Id } });
            if (!product) {
                throw new ApiError(404, `Product with ID ${Product_Id} not found`);
            }

            // await ProductFeatures.destroy({ where: { Product_Id }, transaction: t });
            // await ProductImage.destroy({ where: { ProductId: Product_Id }, transaction: t });
            // if (OfferTable.rawAttributes['Product_Id']) {
            //     const deletedOffers = await OfferTable.destroy({ where: { Product_id: Product_Id }, transaction: t });
            //     console.log(`Deleted ${deletedOffers} features`);
            // } else {
            //     console.log(`Skipping offer deletion as 'Product_id' does not exist in ProductFeatures.`);
            // }

            if (ProductImage.rawAttributes['ProductId']) {
                const deletedOffers = await ProductImage.destroy({ where: { ProductId: Product_Id }, transaction: t });
                console.log(`Deleted ${deletedOffers} images`);
            } else {
                console.log(`Skipping offer deletion as 'Product_id' does not exist in ProductImage.`);
            }

            if (OfferTable.rawAttributes['Product_id']) {
                const deletedOffers = await OfferTable.destroy({ where: { Product_id: Product_Id }, transaction: t });
                console.log(`Deleted ${deletedOffers} offers`);
            } else {
                console.log(`Skipping offer deletion as 'Product_id' does not exist in OfferTable.`);
            }

            await ProductDetails.destroy({ where: { Product_Id }, transaction: t });

            await t.commit();

            res.status(200).json(new ApiResponse('200', null, 'Product and associated data deleted successfully'));
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        next(error);
    }
});

const deleteImage = asyncHandler(async (req,res,next)=>{
    try{
        const image_id = req.params.image_id;
        const imageDetails = await ProductImage.findOne({ where: { image_id } });
        if (!imageDetails) {
            throw new ApiError(404, `Product with ID ${Product_Id} not found`);
        }
       
        await productServices.deleteImageofProducts(imageDetails.image_name, image_id)
        res.status(200).json(new ApiResponse('200', null, 'Image deleted successfully'));

    }catch(error){
        next(error)
    }
});

const addImage = asyncHandler(async (req,res,next)=>{
    try{
        const Product_Id = req.params.Product_Id;
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const image = req.files

        const productDetails = await ProductDetails.findOne({ where: { Product_Id } });
        if (!productDetails) {
            throw new ApiError(404, `Product with ID ${Product_Id} not found`);
        }

       
        var data = await productServices.addImageToProduct(Product_Id, image)
        res.status(200).json(new ApiResponse('200', data, 'Image uploaded successfully'));

    }catch(error){
        next(error)
    }
});



module.exports={
    createProduct,
    createMultipleProducts,
    createOffer,
    updateProducts,
    getOneProducts,
    getProducts,
    deleteProduct,
    deleteImage,
    addImage
}