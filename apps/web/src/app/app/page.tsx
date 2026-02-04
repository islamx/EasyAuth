'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type User } from '@easyauth/shared';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api, clearAuthToken } from '@/lib/api';

export default function AppPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api<{ user: User }>('/auth/me');
        setUser(response.user);
      } catch (error) {
        router.replace('/signin');
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      clearAuthToken();
      await api('/auth/logout', { method: 'POST' });
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4">
      <div className="max-w-4xl mx-auto pt-12 space-y-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome to the application.</h1>
              {user && (
                <p className="text-sm text-zinc-400 mt-1">
                  Logged in as <span className="text-emerald-500">{user.email}</span>
                </p>
              )}
            </div>
            <Button
              onClick={handleLogout}
              disabled={loggingOut}
              isLoading={loggingOut}
              className="w-auto px-6"
            >
              Logout
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">User Information</h2>
          {user && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">ID:</span>
                <span className="text-white font-mono">{user.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-zinc-800">
                <span className="text-zinc-400">Name:</span>
                <span className="text-white">{user.name}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-zinc-400">Email:</span>
                <span className="text-white">{user.email}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
