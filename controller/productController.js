const {productServices} = require("../Services/productServices")
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/AsyncHandler");


const createProduct = asyncHandler(async(req,res)=>{
    const productData = req.body
    const responseData = await productServices.addItem(productData)
    if (!responseData) {
        throw new ApiError(400, 'Invalid product data');
    }
    return res.json(new ApiResponse('200', responseData,'Success'))
})


module.exports={createProduct}