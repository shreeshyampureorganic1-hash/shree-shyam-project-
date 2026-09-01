import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'alee6ahr',
  api_key: process.env.CLOUDINARY_API_KEY || '815152624361853',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'kyPqnsgT2ap4Njy7eqFTTL6pBm4',
  secure: true
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { public_id, resource_type = 'image' } = req.body || {};
    if (!public_id) return res.status(400).json({ error: 'Missing public_id' });

    const result = await cloudinary.uploader.destroy(public_id, { resource_type });
    return res.status(200).json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
