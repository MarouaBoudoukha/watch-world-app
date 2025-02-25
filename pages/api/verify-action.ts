//pages/api/verify-action.ts
/*
import { verifyCloudProof } from '@worldcoin/idkit';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { proof, action, signal } = req.body;
  const app_id = process.env.APP_ID;
  const userId = req.cookies.userId;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  // Verify the proof with Worldcoin
  const verifyRes = await verifyCloudProof(proof, app_id, action, signal);

  if (verifyRes.success) {
    // Check if this video (signal) has already been claimed by the user
    db.get(
      'SELECT * FROM verified_actions WHERE user_id = ? AND action = ? AND signal = ?',
      [userId, action, signal],
      (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (row) {
          return res.status(400).json({ error: 'Reward already claimed for this video' });
        }

        // Record the claim and award the reward
        const reward = 0.1;
        db.run(
          'INSERT INTO verified_actions (user_id, action, signal, reward) VALUES (?, ?, ?, ?)',
          [userId, action, signal, reward],
          (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json({ success: true, reward });
          }
        );
      }
    );
  } else {
    res.status(400).json(verifyRes);
  }
}
*/

/*
// pages/api/verify-action.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { proof, action, signal } = req.body;
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  // (Optional) Verify the proof on the backend here if desired.

  // Check if this reward was already claimed for this video (signal)
  db.get(
    'SELECT * FROM verified_actions WHERE user_id = ? AND action = ? AND signal = ?',
    [userId, action, signal],
    (err, row) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (row) {
        return res.status(400).json({ error: 'Reward already claimed for this video' });
      }
      const reward = 0.1;
      db.run(
        'INSERT INTO verified_actions (user_id, action, signal, reward) VALUES (?, ?, ?, ?)',
        [userId, action, signal, reward],
        (err) => {
          if (err) return res.status(500).json({ error: 'Database error' });
          res.status(200).json({ success: true, reward });
        }
      );
    }
  );
}
*/
// pages/api/verify-action.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { proof, action, signal } = req.body;
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  // Optionally verify proof here

  db.get('SELECT * FROM verified_actions WHERE user_id = ? AND action = ? AND signal = ?', [userId, action, signal], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(400).json({ error: 'Reward already claimed for this video' });

    const reward = 0.1;
    db.run('INSERT INTO verified_actions (user_id, action, signal, reward) VALUES (?, ?, ?, ?)', [userId, action, signal, reward], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(200).json({ success: true, reward });
    });
  });
}
