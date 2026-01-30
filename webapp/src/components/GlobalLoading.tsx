import { useEffect, useState } from 'react';
import { subscribeRequestState } from '@/lib/request-state';

export function GlobalLoading() {
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    return subscribeRequestState(setActiveRequests);
  }, []);

  if (activeRequests === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-gray-700">Carregando...</span>
      </div>
    </div>
  );
}
