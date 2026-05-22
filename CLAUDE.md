# RadioFact — Sistema de Facturación

## Stack
- Frontend: React 18 + Vite + Tailwind → Vercel (radiofact.vercel.app)
- Backend: Node.js + Express + pdfkit → Railway
- BD: Supabase

## Archivo principal
- Todo el frontend está en src/App.jsx (7000+ líneas)
- No usar react-router-dom — navegación con History API + hash

## Reglas importantes
- Validar sintaxis JSX con @babel/parser antes de cualquier push
- DEBUG_MODE = false — las facturas son reales
- Deploy automático: push a main en GitHub → Vercel actualiza solo

## URLs
- Frontend: https://radiofact.vercel.app
- Backend: https://radiofact-backend-production.up.railway.app
- Repo: github.com/neggap-fact/radiofact
