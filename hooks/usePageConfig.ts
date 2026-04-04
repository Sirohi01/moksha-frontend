import { useState, useEffect } from 'react';

interface UsePageConfigReturn<T> {
  config: T | null;
  seo: any | null;
  loading: boolean;
  error: string | null;
}

export function usePageConfig<T>(pageName: string, fallbackConfig: T): UsePageConfigReturn<T> {
  const [config, setConfig] = useState<T | null>(null);
  const [seo, setSeo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/api/page-config/${pageName}`, {
          cache: 'no-store'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            if (data.data.config) setConfig(data.data.config as T);
            if (data.data.seo) setSeo(data.data.seo);
          } else {
            console.warn(`No config found for ${pageName}, using fallback`);
            setConfig(fallbackConfig);
          }
        } else {
          console.warn(`Failed to fetch config for ${pageName}, using fallback`);
          setConfig(fallbackConfig);
        }
      } catch (err) {
        console.warn(`Error fetching config for ${pageName}:`, err);
        setError(err instanceof Error ? err.message : 'Failed to fetch configuration');
        setConfig(fallbackConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [pageName, fallbackConfig]);

  // Handle Real-time Preview Messages from Admin Editor
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === 'UPDATE_PREVIEW_DATA') {
          const payload = event.data.payload;
          if (!payload) return;
          
          setConfig((prev: any) => {
            if (!prev) return prev;
            const newConfig = { ...prev };
            Object.keys(payload).forEach(sectionId => {
              if (newConfig[sectionId]) {
                newConfig[sectionId] = { ...newConfig[sectionId], ...payload[sectionId] };
              }
            });
            return newConfig;
          });
        }
        
        if (event.data?.type === 'UPDATE_SEO_DATA') {
            if (event.data.payload) setSeo(event.data.payload);
        }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return { config, seo, loading, error };
}