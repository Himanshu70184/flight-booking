import { DEFAULT_CMS_CONTENT } from '../data/defaultCmsContent';
import { ApiResponse, CmsBlog, CmsFaq, CmsTestimonial, PublicCmsContent } from '../types/cms';

// Auto-detect API URL based on environment
function getApiBaseUrl(): string {
  // Check for explicit env variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check if running on Vercel (production)
  if (import.meta.env.VITE_VERCEL_URL || import.meta.env.VERCEL_URL) {
    return '/api';
  }
  
  // Check if hostname is not localhost (production)
  const hostname = window?.location?.hostname;
  if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return '/api';
  }
  
  // Check for production mode
  if (import.meta.env.MODE === 'production') {
    return '/api';
  }
  
  // Default to local development
  return 'http://localhost:4000/api';
}

const API_BASE_URL = getApiBaseUrl();
const ADMIN_TOKEN_KEY = 'cms_admin_token';

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) {
        message = body.message;
      }
    } catch (_error) {
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function getAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  if (!token) return { 'Content-Type': 'application/json' };

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function fetchAdmin<T>(path: string, init?: RequestInit): Promise<T> {
  const extraHeaders = (init?.headers || {}) as Record<string, string>;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...extraHeaders,
    } as any,
  });

  return parseResponse<T>(response);
}

export async function fetchPublicContent(): Promise<PublicCmsContent> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/content`);
    const result = await parseResponse<ApiResponse<PublicCmsContent>>(response);

    return {
      ...DEFAULT_CMS_CONTENT,
      ...result.data,
      blogs: result.data?.blogs?.length ? result.data.blogs : DEFAULT_CMS_CONTENT.blogs,
      testimonials: result.data?.testimonials?.length ? result.data.testimonials : DEFAULT_CMS_CONTENT.testimonials,
      faqs: result.data?.faqs?.length ? result.data.faqs : DEFAULT_CMS_CONTENT.faqs,
      contact: { ...DEFAULT_CMS_CONTENT.contact, ...(result.data?.contact || {}) },
      seo: { ...DEFAULT_CMS_CONTENT.seo, ...(result.data?.seo || {}) },
    };
  } catch (error) {
    console.warn('Failed to load CMS content. Using defaults.', error);
    return DEFAULT_CMS_CONTENT;
  }
}

export async function fetchAdminCollection<T>(resource: 'blogs' | 'testimonials' | 'faqs'): Promise<T[]> {
  try {
    console.log(`Fetching data from /admin/${resource}`);
    const result = await fetchAdmin<ApiResponse<T[]>>(`/admin/${resource}`);
    console.log(`Data fetched from /admin/${resource}:`, result.data);
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching data from /admin/${resource}:`, error);
    throw error;
  }
}

export async function createAdminItem<T>(resource: 'blogs' | 'testimonials' | 'faqs', payload: T): Promise<T> {
  const result = await fetchAdmin<ApiResponse<T>>(`/admin/${resource}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function updateAdminItem<T>(resource: 'blogs' | 'testimonials' | 'faqs', id: string, payload: T): Promise<T> {
  const result = await fetchAdmin<ApiResponse<T>>(`/admin/${resource}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function deleteAdminItem(resource: 'blogs' | 'testimonials' | 'faqs', id: string): Promise<void> {
  await fetchAdmin<ApiResponse<{ message: string }>>(`/admin/${resource}/${id}`, { method: 'DELETE' });
}

export async function fetchSettings() {
  const result = await fetchAdmin<ApiResponse<PublicCmsContent & { _id?: string }>>('/admin/settings');
  return result.data;
}

export async function updateSettings(payload: Pick<PublicCmsContent, 'seo' | 'contact'>) {
  const result = await fetchAdmin<ApiResponse<PublicCmsContent>>('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function loginAdmin(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const result = await parseResponse<ApiResponse<{ token: string; user: { email: string; name: string; role: string } }>>(response);
  setAdminToken(result.data.token);
  return result.data.user;
}

export async function fetchAdminMe() {
  const result = await fetchAdmin<ApiResponse<{ email: string; name: string; role: string }>>('/auth/me');
  return result.data;
}

export function logoutAdmin() {
  clearAdminToken();
}

export function hasAdminToken() {
  return Boolean(getAdminToken());
}

export type { CmsBlog, CmsFaq, CmsTestimonial };
