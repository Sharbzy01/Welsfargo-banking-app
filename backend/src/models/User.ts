import { pool } from '../server.js';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async create(user: Partial<User>): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password_hash || '', 10);
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, phone, address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, phone, address, created_at, updated_at
    `;
    const result = await pool.query(query, [
      user.email,
      hashedPassword,
      user.first_name,
      user.last_name,
      user.phone,
      user.address
    ]);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}