// Auto-detect API URL based on environment
function getApiBaseUrl(): string {
  // Check for explicit env variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production (Vercel), use relative API path
  if (import.meta.env.PROD || import.meta.env.VITE_VERCEL_URL) {
    return '/api';
  }
  
  // Default to local development
  return 'http://localhost:4000/api';
}

const API_BASE_URL = getApiBaseUrl();

/**
 * Upload image file to server
 * Images are stored in server/uploads/ directory
 */
export async function uploadImage(file: File, type: 'blog' | 'testimonial'): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    
    // Return full URL for the image
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${result.data.imageUrl}`;
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image');
  }
}
