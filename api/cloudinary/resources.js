import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'alee6ahr',
  api_key: process.env.CLOUDINARY_API_KEY || '815152624361853',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'kyPqnsgT2ap4Njy7eqFTTL6pBm4',
  secure: true
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const folder = req.query.folder || 'shree-shyam';
    const resource_type = req.query.resource_type || 'image';

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 100,
      resource_type
    });

    return res.status(200).json({
      success: true,
      resources: (result.resources || []).map(item => ({
        public_id: item.public_id,
        url: item.secure_url,
        format: item.format,
        bytes: item.bytes,
        created_at: item.created_at,
        resource_type: item.resource_type,
        width: item.width,
        height: item.height
      }))
    });
  } catch (err) {
    return res.status(200).json({ success: true, resources: [] });
  }
}
