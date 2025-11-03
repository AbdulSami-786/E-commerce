import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = await mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "sami123",
  password: process.env.DB_PASS || "sami1234500000asw",
  database: process.env.DB_NAME || "buyzaar",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
