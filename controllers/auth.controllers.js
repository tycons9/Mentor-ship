import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../config/db.js';

const saltRounds = 10;



export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      message: "All fields (name, email, password, role) are required."
    });
  }

  try {
    const connection = await connectToDatabase();

    const [existing] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await connectToDatabase();

    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = users[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development', // only true in production
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: 'Login successful',
       token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logout successful' });
};
// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const connection = await connectToDatabase();

    const [users] = await connection.execute('SELECT id, name, email, role FROM users');

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update user info
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const connection = await connectToDatabase();

    // Check if user exists
    const [existing] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let hashedPassword = existing[0].password; // Keep old password if not updating

    if (password) {
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    await connection.execute(
      'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
      [name, email, hashedPassword, role, id]
    );

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await connectToDatabase();

    const [existing] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await connection.execute('DELETE FROM users WHERE id = ?', [id]);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export default {
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUser,
  deleteUser
};