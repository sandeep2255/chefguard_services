const { DataTypes } = require('sequelize');
const { sequelize } = require('../index');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
}, {
    sequelize,
    modelName: 'User',
});

// Define any associations here if needed in future
User.associate = (models) => {
    // Define associations if necessary
    // Example: User.hasMany(models.Post)
};
User.beforeCreate(async (member, options) => {
    if (member.changed("password")) {
        member.password = await bcrypt.hash(member.password, 10);
    }
});

User.beforeUpdate(async (member, options) => {
    if (member.changed("password")) {
        member.password = await bcrypt.hash(member.password, 10);
    }
});

User.prototype.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

User.prototype.generateAccessToken = function () {
    return jwt.sign(
        {
        email: this.email,
        firstName: this.firstName,
        },
        process.env.JWT_ACCESS_SECRET,
        {
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
        }
    );
};

User.prototype.generateRefreshToken = function () {
    return jwt.sign(
        {
        member_id: this.member_id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
        expiresIn: process.env.JWT_REFRESH_EXPIRES,
        }
    );
};

module.exports = {User};
