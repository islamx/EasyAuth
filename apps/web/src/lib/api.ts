const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const AUTH_TOKEN_KEY = 'easyauth_token';

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') sessionStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window !== 'undefined') sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

type FetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export async function api<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  const token = getStoredToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return response.json();
}
