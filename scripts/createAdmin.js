// scripts/createAdmin.js
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../config/db.js';

const saltRounds = 10;

const createAdmin = async () => {
  const name = 'Wintana';
  const email = 'Wintanaadmin@example.com';
  const password = 'Wintana@12';
  const role = 'admin';

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const connection = await connectToDatabase();

    const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Admin already exists.');
      return;
    }

    await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    console.log('✅ Admin user inserted successfully.');
  } catch (err) {
    console.error('❌ Failed to create admin:', err.message);
  }
};

createAdmin();
