import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'alee6ahr',
  api_key: process.env.CLOUDINARY_API_KEY || '815152624361853',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'kyPqnsgT2ap4Njy7eqFTTL6pBm4',
  secure: true
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { folder = 'shree-shyam/general', timestamp = Math.round(new Date().getTime() / 1000) } = req.body || {};
    const paramsToSign = { folder, timestamp };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET || 'kyPqnsgT2ap4Njy7eqFTTL6pBm4');

    return res.status(200).json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'alee6ahr',
      apiKey: process.env.CLOUDINARY_API_KEY || '815152624361853',
      folder
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
