// pages/api/mqtt/stop.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // Gerçek broker durdurma mantığı burada olacak
      // Şimdilik sadece başarılı yanıt
      res.status(200).json({ 
        success: true, 
        message: 'MQTT broker stopped successfully' 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}