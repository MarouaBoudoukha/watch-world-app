// pages/api/get-earnings.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

type EarningsRow = { total?: number };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  db.get('SELECT SUM(reward) as total FROM verified_actions WHERE user_id = ?', [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    // Cast the row to EarningsRow so TypeScript recognizes the total property.
    const earningsRow = row as EarningsRow;
    return res.status(200).json({ total: earningsRow?.total || 0 });
  });
}
