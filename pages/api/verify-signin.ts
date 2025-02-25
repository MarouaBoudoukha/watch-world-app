// pages/api/verify-signin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { finalPayload } = req.body; // Expected from MiniKit
  if (finalPayload && finalPayload.status === 'success') {
    // Use finalPayload.nullifier_hash as the user ID (a string)
    const userId = finalPayload.nullifier_hash || 'dummyUserId';
    res.setHeader('Set-Cookie', serialize('userId', userId, { path: '/', httpOnly: false }));
    return res.status(200).json({ success: true, userId });
  } else {
    return res.status(400).json({ success: false, error: 'Verification failed' });
  }
}
