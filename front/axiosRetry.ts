import axios from "axios";

const BASE = (import.meta as any).env.VITE_API_URL?.replace(/\/+$/, "");
if (BASE) axios.defaults.baseURL = BASE;

let pending = 0;
function emitLoading() {
  window.dispatchEvent(new CustomEvent("api:loading", { detail: { pending } }));
}

axios.interceptors.request.use((cfg) => {
  const method = String(cfg.method || "get").toLowerCase();
  if (method === "get") {
    pending++;
    emitLoading();
  }
  return cfg;
});

const MAX_RETRIES = 6;
const DELAYS = [500, 1000, 2000, 3000, 4000, 5000];

axios.interceptors.response.use(
  (res) => {
    pending = Math.max(0, pending - 1);
    emitLoading();
    return res;
  },
  async (error) => {
    pending = Math.max(0, pending - 1);
    emitLoading();

    const cfg = error.config || {};
    const method = String((cfg.method || "")).toLowerCase();
    const isGet = method === "get";
    const shouldRetry = isGet && (error.code === "ECONNABORTED" || !error.response || error.response.status >= 500);

    (cfg).__retryCount = (cfg).__retryCount || 0;

    if (shouldRetry && (cfg).__retryCount < MAX_RETRIES) {
      const idx = (cfg).__retryCount++;
      const wait = DELAYS[Math.min(idx, DELAYS.length - 1)];
      await new Promise((r) => setTimeout(r, wait));
      return axios(cfg);
    }

    return Promise.reject(error);
  }
);
