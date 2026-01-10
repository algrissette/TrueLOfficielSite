import mysql from 'mysql2/promise';
import dotenv from 'dotenv';


//setup the connection to the main database to return promises
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'truce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
