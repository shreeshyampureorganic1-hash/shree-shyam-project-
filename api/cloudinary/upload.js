import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'alee6ahr',
  api_key: process.env.CLOUDINARY_API_KEY || '815152624361853',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'kyPqnsgT2ap4Njy7eqFTTL6pBm4',
  secure: true
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb'
    }
  }
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file, fileBase64, folder = 'shree-shyam/general', resource_type = 'auto' } = req.body;
    const mediaSource = file || fileBase64;

    if (!mediaSource) {
      return res.status(400).json({ error: 'No media content provided' });
    }

    const uploadResult = await cloudinary.uploader.upload(mediaSource, {
      folder,
      resource_type,
      transformation: resource_type === 'image' ? [
        { quality: 'auto', fetch_format: 'auto' }
      ] : undefined
    });

    return res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      resource_type: uploadResult.resource_type,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration
    });
  } catch (error) {
    console.error('Cloudinary serverless upload error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
}
