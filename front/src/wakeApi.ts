const BASE = (import.meta as any).env.VITE_API_URL?.replace(/\/+$/, '');

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function pingOnce(url: string, timeoutMs = 6000): Promise<boolean> {
  if (!url) return false;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: 'no-store' });
    return res.ok;
  } catch (e) {
    return false;
  } finally {
    clearTimeout(t);
  }
}

export async function wakeApi(maxMs = 70000): Promise<boolean> {
  if (!BASE) return false;
  const candidates = [`${BASE}/health`, `${BASE}/capitulos`, `${BASE}/docs`];
  const backoff = [0, 1000, 2000, 4000, 8000, 12000, 16000, 20000];
  let elapsed = 0;
  for (let i = 0; i < backoff.length && elapsed <= maxMs; i++) {
    const wait = backoff[i];
    if (wait) await sleep(wait), (elapsed += wait);
    for (const u of candidates) {
      const ok = await pingOnce(u);
      if (ok) {
        console.log('[wakeApi] API pronta em', u);
        return true;
      }
    }
    console.log('[wakeApi] ainda acordando... tentativa', i + 1);
  }
  console.warn('[wakeApi] API não respondeu dentro do tempo');
  return false;
}

// dispara o wake imediatamente ao carregar o app
wakeApi();
