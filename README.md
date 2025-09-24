# Princesa(o) Counter

Aplicação com **frontend React + Vite** e **API FastAPI**.

## 🚀 Como rodar localmente

### 1) API (FastAPI)
```bash
cd api
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn api_fastapi:app --reload
# a API sobe em http://127.0.0.1:8000 (ajuste se o arquivo principal tiver outro nome)
```

### 2) Frontend (Vite + React + TS) — pasta `front/`
Crie um arquivo `.env` dentro de `front/`:
```
VITE_API_URL=http://127.0.0.1:8000
```

Depois:
```bash
cd front
npm ci
npm run dev
# abre em http://localhost:5173
```
## 🌐 Deploy

### API (Render)
1. Crie um Web Service no Render apontando para a pasta `api/` do repositório.
2. **Build**: `pip install -r requirements.txt`
3. **Start**: `uvicorn api_fastapi:app --host 0.0.0.0 --port 10000`
4. Anote a URL pública, ex.: `https://sua-api.onrender.com`.

> Garanta que o CORS da API libera seu domínio do GitHub Pages:
> `https://aliceochoa.github.io/princesa-o-counter` e `http://localhost:5173` (dev).

### Frontend (GitHub Pages)
1. Em **Settings → Pages**, deixe **Source: GitHub Actions**.
2. Em **Settings → Secrets and variables → Actions**, crie o secret **`VITE_API_URL`** com a URL pública da API.
3. O deploy roda automaticamente a cada push na branch `main`.

> O `vite.config.ts` já está com `base: '/princesa-o-counter/'` e há um `404.html` para SPA fallback.
## 📁 Estrutura
```
/api
/frontend
.github/workflows/pages.yml
README.md
```

## 🛠️ Stack
- Frontend: React, Vite, TypeScript
- API: FastAPI, Uvicorn
- Deploy: GitHub Pages (front) + Render (API)

---
