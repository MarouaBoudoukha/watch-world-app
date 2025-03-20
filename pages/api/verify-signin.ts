// pages/api/verify-signin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import db from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { finalPayload } = req.body; // Expected from MiniKit
  if (finalPayload && finalPayload.status === 'success') {
    // Use finalPayload.nullifier_hash as the user ID (a string)
    const userId = finalPayload.nullifier_hash || 'dummyUserId';

    // Create user record if it doesn't exist
    db.run(
      'INSERT OR IGNORE INTO users (world_id, role) VALUES (?, ?)',
      [userId, 'user'], // Default role is 'user'
      (err) => {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ error: 'Failed to create user' });
        }

        // Set the cookie and return success
        res.setHeader('Set-Cookie', serialize('userId', userId, { path: '/', httpOnly: false }));
        return res.status(200).json({ success: true, userId });
      }
    );
  } else {
    return res.status(400).json({ success: false, error: 'Verification failed' });
  }
}
