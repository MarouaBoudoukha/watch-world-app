// pages/api/get-company-metrics.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  db.get('SELECT COUNT(*) as videoCount FROM videos WHERE company_id = ?', [userId], (err, row: any) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    return res.status(200).json({ videoCount: row.videoCount });
  });
}