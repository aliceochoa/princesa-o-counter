import { useEffect, useState } from "react";

export function useApiStatus() {
  const [loadingCount, setLoadingCount] = useState(0);
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [hasSettledOnce, setHasSettledOnce] = useState(false); // NOVO

  useEffect(() => {
    const onLoading = (e: any) => {
      const pending = e.detail?.pending ?? 0;
      setLoadingCount(pending);
      if (pending === 0) {
        // marcou que pelo menos um ciclo de requests terminou
        setHasSettledOnce(true);
      }
    };
    const onStatus = (e: any) => setApiStatus(e.detail ?? null);

    window.addEventListener("api:loading", onLoading);
    window.addEventListener("api:status", onStatus);
    return () => {
      window.removeEventListener("api:loading", onLoading);
      window.removeEventListener("api:status", onStatus);
    };
  }, []);

  return { loadingCount, apiStatus, hasSettledOnce }; // ← exporta o novo flag
}
