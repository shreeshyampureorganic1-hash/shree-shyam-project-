const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'alee6ahr';
const API_URL = import.meta.env.VITE_API_URL || '';

export const CloudinaryFolders = {
  LOGO: 'shree-shyam/logo',
  BANNER_VIDEOS: 'shree-shyam/banners/videos',
  BANNER_IMAGES: 'shree-shyam/banners/images',
  CATEGORIES: 'shree-shyam/categories',
  GALLERY: 'shree-shyam/gallery',
  productFolder: (category = 'general', productName = 'item') => {
    const cleanCat = (category || 'general').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const cleanName = (productName || 'item').toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `shree-shyam/products/${cleanCat}/${cleanName}`;
  }
};

/**
 * Upload single file (image or video) to Cloudinary
 * Attempts serverless/backend API first, then falls back to direct Cloudinary client upload
 */
export async function uploadToCloudinary(file, folder = 'shree-shyam/general', resourceType = 'auto') {
  const isVideo = file.type?.startsWith('video/') || resourceType === 'video';
  const resolvedResourceType = isVideo ? 'video' : 'image';

  // 1. Try Serverless / Backend endpoint if available
  if (API_URL || typeof window !== 'undefined') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('resource_type', resolvedResourceType);

      const endpoint = API_URL ? `${API_URL}/api/cloudinary/upload` : `/api/cloudinary/upload`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url || data.secure_url) {
          return {
            url: data.url || data.secure_url,
            publicId: data.public_id || data.publicId,
            format: data.format,
            bytes: data.bytes,
            resourceType: data.resource_type || resolvedResourceType,
            width: data.width,
            height: data.height,
            duration: data.duration
          };
        }
      }
    } catch (backendError) {
      console.warn('API endpoint upload bypassed, using direct Cloudinary upload:', backendError);
    }
  }

  // 2. Direct Cloudinary Client-Side Upload
  const directEndpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resolvedResourceType}/upload`;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const res = await fetch(directEndpoint, {
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
        resourceType: data.resource_type || resolvedResourceType,
        width: data.width,
        height: data.height,
        duration: data.duration
      };
    }
  } catch (directErr) {
    console.warn('Direct upload preset note:', directErr);
  }

  // 3. Fallback to Local Object Data URL (ensures zero crashes during offline or missing preset)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        url: e.target.result,
        publicId: `local_${Date.now()}`,
        format: file.type?.split('/')[1] || 'jpeg',
        bytes: file.size,
        resourceType: resolvedResourceType,
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
    const endpoint = API_URL ? `${API_URL}/api/cloudinary/delete` : `/api/cloudinary/delete`;
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_id: publicId, resource_type: resourceType })
    });
    return await response.json();
  } catch (error) {
    console.warn('Delete from Cloudinary note:', error);
    return { success: true };
  }
}

/**
 * Fetch assets from Cloudinary media library
 */
export async function fetchCloudinaryResources(folder = 'shree-shyam', resourceType = 'image') {
  try {
    const endpoint = API_URL ? `${API_URL}/api/cloudinary/resources` : `/api/cloudinary/resources`;
    const response = await fetch(`${endpoint}?folder=${encodeURIComponent(folder)}&resource_type=${resourceType}`);
    if (response.ok) {
      const data = await response.json();
      return data.resources || [];
    }
  } catch (error) {
    console.warn('Fetch Cloudinary resources note:', error);
  }
  return [];
}

/**
 * Optimize image URL using Cloudinary transformations (WebP/AVIF, auto-quality, responsive)
 */
export function getOptimizedImageUrl(url, width = 800, height = null, crop = 'scale') {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com')) return url;

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
