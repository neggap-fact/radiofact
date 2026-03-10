import React from 'react'
import ReactDOM from 'react-dom/client'

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
// Una vez que crees tu proyecto en Supabase, reemplazá estos valores
// Los encontrás en: Supabase → Settings → API
const SUPABASE_URL = 'TU_SUPABASE_URL_AQUI'
const SUPABASE_KEY = 'TU_SUPABASE_ANON_KEY_AQUI'

// Por ahora el sistema funciona sin Supabase (modo demo con datos locales)
// Cuando tengas las credenciales, reemplazá los valores de arriba

// ─── APP COMPONENT ────────────────────────────────────────────────────────────
// Pegá aquí todo el contenido del componente App que está en el prototipo de Claude
// (el código completo del artifact "Sistema de Facturación Recurrente")

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)