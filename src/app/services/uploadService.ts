const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

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
