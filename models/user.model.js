import { connectToDatabase } from '../config/db.js';

export const findUserByEmail = async (email) => {
  const connection = await connectToDatabase();
  const [rows] = await connection.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

export const findUserById = async (id) => {
  const connection = await connectToDatabase();
  const [rows] = await connection.execute(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

export const getAllUsersExcept = async (excludedId) => {
  const connection = await connectToDatabase();
  const [rows] = await connection.execute(
    'SELECT id, name, email, role FROM users WHERE id != ?',
    [excludedId]
  );
  return rows;
};

export const createUser = async (name, email, hashedPassword, role) => {
  const connection = await connectToDatabase();
  const [result] = await connection.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );
  return result;
};

export const updateUser = async (id, updatedFields) => {
  const connection = await connectToDatabase();

  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updatedFields)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  values.push(id);

  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;

  const [result] = await connection.execute(query, values);
  return result;
};

export const deleteUser = async (id) => {
  const connection = await connectToDatabase();
  const [result] = await connection.execute(
    'DELETE FROM users WHERE id = ?',
    [id]
  );
  return result;
};
export default {
  findUserByEmail,
  findUserById,
  getAllUsersExcept,
  createUser,
  updateUser,
  deleteUser
};