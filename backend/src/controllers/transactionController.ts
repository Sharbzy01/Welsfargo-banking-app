import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { TransactionModel } from '../models/Transaction.js';
import { AccountModel } from '../models/Account.js';

export class TransactionController {
  static async getTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const transactions = await TransactionModel.findByUserId(req.user.id);
      res.json({ transactions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  static async getAccountTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { accountId } = req.params;
      const account = await AccountModel.findById(accountId);

      if (!account) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }

      if (account.user_id !== req.user?.id) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const transactions = await TransactionModel.findByAccountId(accountId);
      res.json({ transactions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  }

  static async transfer(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { fromAccountId, toAccountId, amount, description } = req.body;

      if (!fromAccountId || !toAccountId || !amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid transfer data' });
        return;
      }

      const fromAccount = await AccountModel.findById(fromAccountId);
      const toAccount = await AccountModel.findById(toAccountId);

      if (!fromAccount || !toAccount) {
        res.status(404).json({ error: 'Account not found' });
        return;
      }

      if (fromAccount.user_id !== req.user.id) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      if (fromAccount.balance < amount) {
        res.status(400).json({ error: 'Insufficient funds' });
        return;
      }

      // Create transaction
      const transaction = await TransactionModel.create({
        from_account_id: fromAccountId,
        to_account_id: toAccountId,
        amount,
        transaction_type: 'transfer',
        description: description || 'Transfer',
        status: 'completed'
      });

      // Update balances
      await AccountModel.updateBalance(fromAccountId, -amount);
      await AccountModel.updateBalance(toAccountId, amount);

      res.json({
        message: 'Transfer completed successfully',
        transaction
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Transfer failed' });
    }
  }
}