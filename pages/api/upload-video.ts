// pages/api/upload-video.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../../lib/db';

// Configure multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './public/videos';
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only video files
    if (!file.mimetype.startsWith('video/')) {
      cb(new Error('Only video files are allowed'));
      return;
    }
    cb(null, true);
  },
});

// Wrap multer in a Promise to handle async operations
const uploadMiddleware = (req: any, res: any) => {
  return new Promise((resolve, reject) => {
    upload.single('video')(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(req);
      }
    });
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting video upload process...');

    const userId = req.cookies.userId;
    if (!userId) {
      console.log('No userId found in cookies');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('User ID:', userId);

    // Verify user is a company and update role if needed
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT role FROM users WHERE world_id = ?', [userId], (err, row: any) => {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          console.log('User role:', row?.role);
          resolve(row);
        }
      });
    });

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ error: 'User not found' });
    }

    // If role is not set, try to get it from cookies
    if (!(user as any).role) {
      const roleFromCookie = req.cookies.role;
      if (roleFromCookie === 'company') {
        // Update user role in database
        await new Promise((resolve, reject) => {
          db.run('UPDATE users SET role = ? WHERE world_id = ?', ['company', userId], (err) => {
            if (err) {
              console.error('Error updating user role:', err);
              reject(err);
            } else {
              console.log('Updated user role to company');
              resolve(true);
            }
          });
        });
      } else {
        console.log('User is not a company');
        return res.status(403).json({ error: 'Forbidden: Only companies can upload videos' });
      }
    } else if ((user as any).role !== 'company') {
      console.log('User is not a company');
      return res.status(403).json({ error: 'Forbidden: Only companies can upload videos' });
    }

    // Handle file upload
    console.log('Processing file upload...');
    const uploadedReq = await uploadMiddleware(req as any, res as any);
    const file = (uploadedReq as any).file;

    if (!file) {
      console.log('No file was uploaded');
      return res.status(400).json({ error: 'No video file provided' });
    }

    console.log('File uploaded successfully:', file.filename);

    const { title, description, reward } = (uploadedReq as any).body;
    console.log('Form data received:', { title, description, reward });

    // Validate required fields
    if (!title || !reward) {
      console.log('Missing required fields');
      // Delete uploaded file if validation fails
      fs.unlink(file.path, () => {});
      return res.status(400).json({ error: 'Title and reward are required' });
    }

    const rewardAmount = parseFloat(reward);
    if (isNaN(rewardAmount) || rewardAmount <= 0 || rewardAmount > 1000) {
      console.log('Invalid reward amount:', rewardAmount);
      // Delete uploaded file if validation fails
      fs.unlink(file.path, () => {});
      return res.status(400).json({ error: 'Invalid reward amount. Must be between 0 and 1000 WLD' });
    }

    const videoUrl = `/videos/${file.filename}`;
    console.log('Video URL:', videoUrl);

    // Insert video into database
    console.log('Inserting video into database...');
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO videos (company_id, title, description, url, reward, status) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, title, description, videoUrl, rewardAmount, 'published'],
        (err) => {
          if (err) {
            console.error('Database insert error:', err);
            // Delete uploaded file if database insert fails
            fs.unlink(file.path, () => {});
            reject(err);
          } else {
            console.log('Video inserted into database successfully');
            resolve(true);
          }
        }
      );
    });

    console.log('Upload process completed successfully');
    return res.status(200).json({
      success: true,
      videoUrl,
      message: 'Video uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size too large. Maximum size is 100MB' });
      }
    }
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'An error occurred during upload'
    });
  }
}