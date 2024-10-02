const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const configPath = path.join(__dirname, 'config', 'config.json');
const rawdata = fs.readFileSync(configPath);
const { username, password, database, host, dialect, port } = JSON.parse(rawdata)['test'];


const sequelize = new Sequelize(database, username, password, {
  host: host,
  port:port,
  dialect: dialect
});
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };