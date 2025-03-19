// pages/api/get-user-role.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  db.get('SELECT role FROM users WHERE id = ?', [userId], (err, row: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ role: row.role });
  });
}