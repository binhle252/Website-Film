const mysql = require("mysql2");
const dotenv = require("dotenv");

const env = process.env.MYSQL_HOST || "localhost";

// Kết nối MySQL
const db = mysql.createConnection({
  host: `${env}`,
  user: "root",
  password: "12345678",
  database: "web",
});
console.log(`${env}`);

db.connect((err) => {
  if (err) {
    console.log("Lỗi kết nối:", err);
  } else {
    console.log("Đã kết nối MySQL!");
  }
});

module.exports = db;
