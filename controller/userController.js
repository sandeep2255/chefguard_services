const {ApiError} = require("../utils/ApiError");
const {ApiResponse} = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/AsyncHandler");
const user = require("../database/models/user");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");

const generateAccessAndRefreshTokens = async (email) => {
  try {
    //console.log(userId)
    const member = await user.findByPk(email);
    //console.log(user)
    const accessToken = member.generateAccessToken();
    // console.log(accessToken)
    const refreshToken = member.generateRefreshToken();

    //console.log(refreshToken)

    member.refreshToken = refreshToken; //Add refresh token to DB
    await member.save({ validate: false }); //save user
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email)) {
    throw new ApiError(400, "username or email is required");
  }
  const member = await user.findOne({
    where: {
      [Sequelize.Op.or]: [{ email: email }],
    },
  });
  if (!member) {
    throw new ApiError(404, "user does not exist ");
  }
  const isPasswordValid = await member.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    member.email
  );

  const loggedInUser = await members.findOne({
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
    .json(
      new ApiResponse(
        200,
        {
          members: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  user.update(
    { refreshToken: null },
    {
      where: {
        email: req.user.email,
      },
      returning: true,
      plain: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Succesfully Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const member = await user.findByPk(decodedToken?.email);

    if (!member) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== members?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(member.email);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Acess token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

module.exports = {
  loginUser,
  logoutUser,
  refreshAccessToken,
};
