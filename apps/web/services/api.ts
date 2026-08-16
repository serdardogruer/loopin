// API Client Configuration for Loopin V2

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://loopin.codapi.site/api/v1';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('loopin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `API Hatası: ${response.status} ${response.statusText}`);
    }

    return data as T;
  } catch (error: any) {
    console.error(`[API Client Error] ${endpoint}:`, error);
    throw error;
  }
}
