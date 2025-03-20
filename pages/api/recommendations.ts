// pages/api/recommendations.ts
import { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const videos = await new Promise((resolve, reject) => {
      db.all(
        `SELECT v.*, u.company_name, u.logo_url
         FROM videos v
         JOIN users u ON v.company_id = u.world_id
         WHERE v.status = 'published'
         ORDER BY v.created_at DESC
         LIMIT 20`,
        [],
        (err: Error | null, rows: any[]) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });

    return res.status(200).json({
      videos: videos || [],
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
