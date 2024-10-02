const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "https://1bc9-2409-40f3-c2-a7b3-40f-fc56-37ef-1281.ngrok-free.app",
  user: "root",
  password: "Sandeep@1999",
  database: "chefguard",
  port: "3306",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

module.exports = { connect: connection };
