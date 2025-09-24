import { useEffect, useState } from "react";

export function useApiStatus() {
  const [loadingCount, setLoadingCount] = useState(0);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  useEffect(() => {
    const onLoading = (e: any) => setLoadingCount(e.detail?.pending ?? 0);
    const onStatus = (e: any) => setApiStatus(e.detail ?? null);
    window.addEventListener("api:loading", onLoading);
    window.addEventListener("api:status", onStatus);
    return () => {
      window.removeEventListener("api:loading", onLoading);
      window.removeEventListener("api:status", onStatus);
    };
  }, []);

  return { loadingCount, apiStatus };
}
