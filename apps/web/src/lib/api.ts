const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export async function api<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}
