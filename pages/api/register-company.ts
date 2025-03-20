import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

  try {
    // Parse form data
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public/uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
    });

    const formData = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const companyName = formData.fields.companyName?.[0];
    const budget = parseFloat(formData.fields.budget?.[0] || '0');
    const logoFile = formData.files.logo?.[0];

    if (!companyName || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let logoUrl = null;
    if (logoFile) {
      const fileExt = path.extname(logoFile.originalFilename || '');
      const fileName = `${uuidv4()}${fileExt}`;
      const newPath = path.join(process.cwd(), 'public/uploads', fileName);

      // Rename the uploaded file
      await fs.promises.rename(logoFile.filepath, newPath);
      logoUrl = `/uploads/${fileName}`;
    }

    // Update user in database
    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE users
         SET company_name = ?,
             budget = ?,
             logo_url = ?,
             is_registered = 1,
             role = 'company'
         WHERE world_id = ?`,
        [companyName, budget, logoUrl, userId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error registering company:', error);
    return res.status(500).json({ error: 'Failed to register company' });
  }
}