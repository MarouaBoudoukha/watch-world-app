import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get all videos for the company
  db.all(
    `SELECT
      id,
      title,
      description,
      url,
      reward,
      views,
      created_at
    FROM videos
    WHERE company_id = (SELECT id FROM users WHERE world_id = ?)
    ORDER BY created_at DESC`,
    [userId],
    (err, rows: any[]) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      return res.status(200).json({
        videos: rows.map(video => ({
          id: video.id,
          title: video.title,
          description: video.description,
          url: video.url,
          reward: video.reward,
          views: video.views,
          createdAt: video.created_at
        }))
      });
    }
  );
}