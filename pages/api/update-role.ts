import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { role } = req.body;
    if (!role || !['user', 'company'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // First check if user exists
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE world_id = ?', [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      // Create user if they don't exist
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO users (world_id, role) VALUES (?, ?)', [userId, role], (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    } else {
      // Update existing user's role
      await new Promise((resolve, reject) => {
        db.run('UPDATE users SET role = ? WHERE world_id = ?', [role, userId], (err) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    }

    return res.status(200).json({ success: true, message: 'Role updated successfully' });
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'An error occurred while updating role'
    });
  }
}