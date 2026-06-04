import { pool } from '../server.js';

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_type: 'checking' | 'savings';
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export class AccountModel {
  static async create(account: Partial<Account>): Promise<Account> {
    const accountNumber = this.generateAccountNumber();
    const query = `
      INSERT INTO accounts (user_id, account_number, account_type, balance)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, account_number, account_type, balance, created_at, updated_at
    `;
    const result = await pool.query(query, [
      account.user_id,
      accountNumber,
      account.account_type || 'checking',
      account.balance || 0
    ]);
    return result.rows[0];
  }

  static async findByUserId(userId: string): Promise<Account[]> {
    const query = 'SELECT * FROM accounts WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id: string): Promise<Account | null> {
    const query = 'SELECT * FROM accounts WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async updateBalance(id: string, amount: number): Promise<Account> {
    const query = `
      UPDATE accounts SET balance = balance + $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, user_id, account_number, account_type, balance, created_at, updated_at
    `;
    const result = await pool.query(query, [amount, id]);
    return result.rows[0];
  }

  private static generateAccountNumber(): string {
    return 'ACC' + Math.random().toString().substr(2, 10).padEnd(10, '0');
  }
}