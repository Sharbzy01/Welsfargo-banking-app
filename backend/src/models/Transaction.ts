import { pool } from '../server.js';

export interface Transaction {
  id: string;
  from_account_id: string;
  to_account_id: string;
  amount: number;
  transaction_type: 'transfer' | 'deposit' | 'withdrawal';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: Date;
}

export class TransactionModel {
  static async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const query = `
      INSERT INTO transactions (from_account_id, to_account_id, amount, transaction_type, description, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, from_account_id, to_account_id, amount, transaction_type, description, status, created_at
    `;
    const result = await pool.query(query, [
      transaction.from_account_id,
      transaction.to_account_id,
      transaction.amount,
      transaction.transaction_type,
      transaction.description,
      transaction.status || 'pending'
    ]);
    return result.rows[0];
  }

  static async findByAccountId(accountId: string, limit: number = 50): Promise<Transaction[]> {
    const query = `
      SELECT * FROM transactions
      WHERE from_account_id = $1 OR to_account_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [accountId, limit]);
    return result.rows;
  }

  static async findByUserId(userId: string, limit: number = 50): Promise<Transaction[]> {
    const query = `
      SELECT t.* FROM transactions t
      JOIN accounts a ON (t.from_account_id = a.id OR t.to_account_id = a.id)
      WHERE a.user_id = $1
      ORDER BY t.created_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  static async updateStatus(id: string, status: string): Promise<Transaction> {
    const query = `
      UPDATE transactions SET status = $1 WHERE id = $2
      RETURNING id, from_account_id, to_account_id, amount, transaction_type, description, status, created_at
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }
}