// pages/api/get-earnings.ts
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
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const earnings = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM verified_actions
         WHERE user_id = ? AND action = 'watch_video'
         ORDER BY created_at DESC`,
        [userId],
        (err: Error | null, rows: any[]) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });

    const total = (earnings as any[]).reduce((sum, earning) => sum + (earning.reward || 0), 0);

    return res.status(200).json({
      earnings: earnings || [],
      total,
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
