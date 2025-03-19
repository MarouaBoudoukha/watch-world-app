// pages/api/recommendations.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Example: Retrieve user's watch history and preferences from DB.
  /*const userHistory = await new Promise((resolve, reject) => {
    db.all('SELECT videoId FROM user_history WHERE user_id = ?', [userId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
  */
  // Example logic: get tags from user watched videos.
  //const watchedVideoIds = userHistory.map((row: any) => row.videoId);
  // Now, based on these IDs, retrieve video metadata (e.g., tags) and recommend similar videos.
  // This is simplified logic. In a real system, you'd use ML or advanced queries.
  /*db.all(
    `SELECT * FROM videos
     WHERE duration <= 60 AND id NOT IN (${watchedVideoIds.join(',')})
     ORDER BY RANDOM() LIMIT 10`,
    (err, recommendedVideos) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(200).json({ videos: recommendedVideos });
    }
  );
  */
  db.all(
    'SELECT * FROM videos WHERE status = "published" ORDER BY RANDOM() LIMIT 10',
    (err, videos) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(200).json({ videos });
    }
  );
}
