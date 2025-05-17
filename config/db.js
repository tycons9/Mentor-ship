// db.js
import mysql from 'mysql2/promise';


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'skillbridgedb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function connectToDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to skillbridgedb database!');
    return connection;
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    throw err;
  }
}

export default pool;
