const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'alee6ahr';

export const CloudinaryFolders = {
  LOGO: 'shree-shyam/logo',
  BANNER_VIDEOS: 'shree-shyam/banners/videos',
  BANNER_IMAGES: 'shree-shyam/banners/images',
  CATEGORIES: 'shree-shyam/categories',
  GALLERY: 'shree-shyam/gallery',
  productFolder: (category = 'general', productName = 'item') => {
    const cleanCat = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cleanName = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `shree-shyam/products/${cleanCat}/${cleanName}`;
  }
};

/**
 * Upload single file (image or video) via secure backend API
 */
export async function uploadToCloudinary(file, folder = 'shree-shyam/general', resourceType = 'auto', onProgress = null) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    formData.append('resource_type', resourceType);

    const response = await fetch(`${API_URL}/api/cloudinary/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    return {
      url: data.url,
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
      resourceType: data.resource_type,
      width: data.width,
      height: data.height,
      duration: data.duration
    };
  } catch (backendError) {
    console.warn('Backend upload encountered an issue, trying direct upload fallback:', backendError);
    // Direct Cloudinary client-side upload fallback if server is momentarily unreachable
    return directCloudinaryUpload(file, folder, resourceType);
  }
}

/**
 * Fallback direct upload method
 */
async function directCloudinaryUpload(file, folder, resourceType) {
  const isVideo = file.type.startsWith('video/') || resourceType === 'video';
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${isVideo ? 'video' : 'image'}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'unsigned_preset'); // If preset is present
  formData.append('folder', folder);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      return {
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format,
        bytes: data.bytes,
        resourceType: data.resource_type
      };
    }
  } catch (e) {
    // If external upload failed completely (e.g. offline preview), generate local object URL
    console.warn('Direct upload also failed, using local object URL fallback:', e);
  }

  // Local object URL fallback
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        url: e.target.result,
        publicId: `local_${Date.now()}`,
        format: file.type.split('/')[1] || 'jpeg',
        bytes: file.size,
        resourceType: isVideo ? 'video' : 'image',
        isLocalPreview: true
      });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Delete asset from Cloudinary
 */
export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  try {
    const response = await fetch(`${API_URL}/api/cloudinary/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: publicId, resource_type: resourceType })
    });
    return await response.json();
  } catch (error) {
    console.error('Delete from Cloudinary failed:', error);
    return { success: false };
  }
}

/**
 * Fetch assets from Cloudinary media library
 */
export async function fetchCloudinaryResources(folder = 'shree-shyam', resourceType = 'image') {
  try {
    const response = await fetch(`${API_URL}/api/cloudinary/resources?folder=${encodeURIComponent(folder)}&resource_type=${resourceType}`);
    const data = await response.json();
    return data.resources || [];
  } catch (error) {
    console.error('Fetch Cloudinary resources failed:', error);
    return [];
  }
}

/**
 * Optimize image URL using Cloudinary transformations (WebP/AVIF, auto-quality, responsive)
 */
export function getOptimizedImageUrl(url, width = 800, height = null, crop = 'scale') {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com')) return url;

  // Insert transformations into Cloudinary URL
  // https://res.cloudinary.com/demo/image/upload/v12345/sample.jpg -> /upload/f_auto,q_auto,w_800/
  const transform = [`f_auto`, `q_auto`, `w_${width}`];
  if (height) transform.push(`h_${height}`, `c_${crop}`);

  return url.replace('/upload/', `/upload/${transform.join(',')}/`);
}

/**
 * Optimize video URL for high-efficiency streaming
 */
export function getOptimizedVideoUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com')) return url;
  return url.replace('/upload/', '/upload/q_auto,vc_auto,f_auto/');
}
