"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getCurrentUser, type AdminUser } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export default function AuthGuard({ children, requiredPermission }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push('/admin/login');
        return;
      }

      // Simple permission check
      if (requiredPermission && currentUser.role !== 'admin' && currentUser.permissions && !currentUser.permissions.includes(requiredPermission)) {
        router.push('/admin');
        return;
      }

      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, requiredPermission]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}