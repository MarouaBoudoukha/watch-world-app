// pages/api/get-user-actions.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  db.all('SELECT action, signal, reward FROM verified_actions WHERE user_id = ?', [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    return res.status(200).json(rows);
  });
}
