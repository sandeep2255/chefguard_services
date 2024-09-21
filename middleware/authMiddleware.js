const {ApiError} = require("../utils/ApiError");
const { asyncHandler } = require("../utils/AsyncHandler");
const {User} = require("../database/models/user");
const jwt = require("jsonwebtoken");
const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const member = await User.findOne({
      where: {
        email: decodedToken.email,
      },
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!member) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.member = member;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
module.exports = verifyJWT;
