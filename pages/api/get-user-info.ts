import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

interface UserData {
  role: string;
  company_name: string | null;
  budget: number | null;
  logo_url: string | null;
  is_registered: number;
  username: string | null;
  profile_picture_url: string | null;
  total_views: number;
  total_earnings: number;
  videos_watched: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = await new Promise<UserData | undefined>((resolve, reject) => {
      db.get(
        `SELECT
          role,
          company_name,
          budget,
          logo_url,
          is_registered,
          username,
          profile_picture_url,
          total_views,
          total_earnings,
          videos_watched
        FROM users
        WHERE world_id = ?`,
        [userId],
        (err, row: UserData) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      role: user.role,
      companyName: user.company_name,
      budget: user.budget,
      logoUrl: user.logo_url,
      isRegistered: Boolean(user.is_registered),
      username: user.username,
      profilePictureUrl: user.profile_picture_url,
      totalViews: user.total_views,
      totalEarnings: user.total_earnings,
      videosWatched: user.videos_watched
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Database error' });
  }
}