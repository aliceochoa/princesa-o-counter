import axios from 'axios';

const BASE = (import.meta as any).env.VITE_API_URL?.replace(/\/+$/, '');

// Base URL global (se o app usar caminhos relativos)
if (BASE) {
  axios.defaults.baseURL = BASE;
}

// Retry simples para GETs, útil quando a API do Render está acordando
const MAX_RETRIES = 6;
const DELAYS = [500, 1000, 2000, 3000, 4000, 5000];

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const cfg = error.config || {};
    const method = (cfg.method || '').toLowerCase();
    const url = cfg.url || '';
    const isGet = method === 'get';
    const shouldRetry = isGet && (error.code === 'ECONNABORTED' || !error.response || error.response.status >= 500);

    cfg.__retryCount = cfg.__retryCount || 0;

    if (shouldRetry && cfg.__retryCount < MAX_RETRIES) {
      const idx = cfg.__retryCount;
      cfg.__retryCount += 1;
      const wait = DELAYS[Math.min(idx, DELAYS.length - 1)];
      await new Promise((r) => setTimeout(r, wait));
      return axios(cfg);
    }

    return Promise.reject(error);
  }
);
