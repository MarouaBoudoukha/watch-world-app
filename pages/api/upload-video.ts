// pages/api/upload-video.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import db from '../../lib/db';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/videos',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = req.cookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  db.get('SELECT role FROM users WHERE id = ?', [userId], (err, row: any) => {
    if (err || !row || row.role !== 'company') {
      return res.status(403).json({ error: 'Forbidden: Only companies can upload videos' });
    }

    upload.single('video')(req as any, res as any, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Upload error' });
      }

      const { title, description, reward } = req.body;
      const videoUrl = `/videos/${(req as any).file.filename}`;

      db.run(
        'INSERT INTO videos (company_id, title, description, url, reward) VALUES (?, ?, ?, ?, ?)',
        [userId, title, description, videoUrl, parseFloat(reward)],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          return res.status(200).json({ success: true, videoUrl });
        }
      );
    });
  });
}