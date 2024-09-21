const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/AsyncHandler");
const {User} = require("../database/models/user")

const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");

const generateAccessAndRefreshTokens = async (email) => {
  try {
    const member = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }],
      },
    });
    const accessToken = member.generateAccessToken();
    const refreshToken = member.generateRefreshToken();


    member.refreshToken = refreshToken;
    await member.save({ validate: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error);
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Username or email is required");
  }

  const member = await User.findOne({
    where: {
      [Sequelize.Op.or]: [{ email }],
    },
  });

  if (!member) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await member.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(member.email);

  const loggedInUser = await User.findOne({
    where: { email: member.email },
    attributes: { exclude: ["password", "refreshToken"] },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const member = await User.findOne({ where: { email: req.user.email } });
  
  if (!member) {
    throw new ApiError(404, "User not found");
  }

  member.refreshToken = null;
  await member.save();

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Successfully logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const member = await User.findOne({ where: { email: decodedToken.email } });

    if (!member || incomingRefreshToken !== member.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(member.email);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

module.exports = {
  loginUser,
  logoutUser,
  refreshAccessToken,
};
