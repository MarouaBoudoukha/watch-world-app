// pages/api/verify-action.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { proof, action, signal, reward: rewardFromClient  } = req.body;
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  // Optionally verify proof here

  db.get('SELECT * FROM verified_actions WHERE user_id = ? AND action = ? AND signal = ?', [userId, action, signal], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(400).json({ error: 'Reward already claimed for this video' });

    // Use the reward sent from the client, fallback to 0.1 if not provided.
    const reward = parseFloat(rewardFromClient) || 0.05;
    db.run('INSERT INTO verified_actions (user_id, action, signal, reward) VALUES (?, ?, ?, ?)', [userId, action, signal, reward], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(200).json({ success: true, reward });
    });
  });
}
