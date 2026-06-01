# RadioFact v3.7 — Handoff

**Fecha:** 01/06/2026
**Basado en:** handoff_v3_5_mobile.md

---

## 🎯 Proyecto

| Item | Valor |
|---|---|
| **Sistema** | RadioFact — Facturación y Gestión Financiera |
| **Cliente** | La Vanguardia Noticias (LVN) |
| **CUIT** | 30-71644424-0 |
| **Frontend** | React 18 + Vite + Tailwind → `radiofact.vercel.app` |
| **Repo frontend** | `github.com/neggap-fact/radiofact` |
| **Backend** | Node.js + Express + Puppeteer → Railway |
| **Repo backend** | `github.com/neggap-fact/radiofact-backend` |
| **URL backend** | `https://radiofact-backend-production.up.railway.app` |
| **BD** | Supabase (proyecto: akuhpxrcdcxtohnuycid) |
| **Repo local frontend** | `C:\Users\DOLOR PC\Documents\GitHub\radiofact\src\App.jsx` |
| **Repo local backend** | `C:\Users\DOLOR PC\Documents\GitHub\radiofact-backend\index.js` |

---

## 👥 Usuarios en producción

| Email | Password | Nombre | Rol |
|---|---|---|---|
| neggap@gmail.com | OctavioRF | Gabriel | webmaster |
| matiasbarrionuevos@gmail.com | lvnradiofact2026 | Matías | socio |
| neggap+lectura@gmail.com | lectura2026 | Usuario Lectura | operador |

**Roles:** `webmaster` (emite a ARCA), `editor`, `socio` (crea borradores, no emite), `operador` (solo lectura)

---

## 💰 Estado bancario actual (01/06/2026)

| Cuenta | UUID Supabase | Saldo |
|---|---|---|
| Santander Río LVN | `20e41f9d-c34b-42c5-8591-4f6b1e1bbcdd` | $13.832.536,81 |
| Credicoop Corriente LVN | `f7879a2b-f001-475e-830d-2769fb1ede8f` | $15.462.920,56 |
| Efectivo | `50bd073a-2996-4ed3-88c2-fb90c9884e44` | $221.000 |

---

## ✅ Todo lo que está en producción (v3.7)

### Sistema base
- Login con Supabase Auth (email + password)
- Sesión persistente (sobrevive F5)
- Auto-logout 8 minutos de inactividad + aviso a los 7 min (modal countdown 60s + botón "Seguir conectado")
- Ojito apagado por defecto al iniciar sesión

### Facturación
- Emisión a ARCA con CAE via backend Railway
- Flujo de aprobación: Matías crea → Gabriel aprueba → recién emite a ARCA
- Pantalla "Aprobaciones" (solo webmaster) con badge rojo en sidebar
- Editar/borrar facturas en estado "Pendiente aprobación" o "Borrador"
- Ocultar/mostrar facturas Emitidas (sin borrarlas)
- Etiqueta naranja "Pendiente aprobación" diferenciada de "Borrador"
- Filtro por estado incluyendo "Pendiente aprobación"
- Factura Directa (sin contrato) con flujo dual según rol
- Notas de Crédito
- Factura manual ARCA Web (carga manual)

### Gastos
- CRUD completo de gastos con categorías
- Sub-categorías con sugerencias según categoría
- Plantillas de gastos reutilizables
- IVA discriminable por gasto
- Gastos por tarjeta de crédito
- PDF descargable de gastos (Puppeteer, backend): A4, paleta azul, colores pastel por fila, proveedor ampliado, IVA crédito fiscal unificado en monto, excluye tarjetas y gastos externos

### Finanzas
- Dashboard con activos, cuentas, facturación, cobranzas, gastos
- Ojito para ocultar/mostrar montos
- PDF de resumen financiero generado en backend con Puppeteer (reemplazó window.print)
- Navegación desde "Detalle por cliente" → Facturación filtrada por ese cliente
- Filtros de mes/año corregidos: estado inicial = mes y año actual

### Movimientos Bancarios (nuevo en v3.6/v3.7)
- Nueva página "Movimientos" en menú principal
- Carga paginada desde Supabase (50 por página) con filtros por cuenta, mes, año, categoría y búsqueda
- Resumen rápido: ingresos, egresos, impuestos+comisiones, saldo neto
- Importación CSV Santander (`/analizar-extracto-santander`): muestra resumen previo, marca duplicados
- Importación CSV Credicoop (`/procesar-extracto-credicoop`): formato YYYYMMDD, separador `;`, montos `1.200,00`
- Categorización automática de movimientos
- Colores por tipo: verde (ingreso) / rojo (egreso)
- Edición de categoría y concepto inline
- Función "convertir movimiento → gasto"

### Navegación
- Botón Atrás del navegador funciona (History API con hash: `#billing`, `#gastos`, etc.)
- URL se actualiza al navegar entre secciones

---

## 🗄️ BD — Tablas activas

- `clientes`, `contratos`, `facturas`, `gastos`
- `cuentas_bancarias`, `movimientos_bancarios`
- `usuarios_perfil`, `tarjetas_credito`, `plantillas_gastos`
- `proveedores`, `notas_credito`, `operaciones_arca`

### Tabla `movimientos_bancarios` — columnas relevantes

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid | PK |
| `cuenta_id` | uuid | FK → cuentas_bancarias |
| `fecha` | date | YYYY-MM-DD |
| `descripcion` | text | Texto del extracto |
| `importe` | numeric | Siempre positivo; dirección por `tipo` |
| `saldo_posterior` | numeric | Saldo de cuenta después del movimiento |
| `referencia` | text | COMBTE (Credicoop) o referencia Santander |
| `origen` | text | `"santander"` \| `"credicoop"` \| `"extracto"` |
| `categoria` | text | Ver categorías abajo |
| `tipo` | text | `"ingreso"` \| `"egreso"` |
| `concepto` | text | Texto libre editable por usuario |
| `contraparte` | text | Nombre del tercero |
| `cuit_contraparte` | text | CUIT del tercero |
| `gasto_id` | uuid | FK → gastos (si fue convertido) |
| `factura_id` | uuid | FK → facturas (si fue conciliado) |
| `notas` | text | Notas internas |
| `creado_por` | uuid | FK → usuarios_perfil |

### Categorías de movimientos

| Valor | Label |
|---|---|
| `impuesto_banco` | Impuestos banco |
| `transferencia_recibida` | Transferencias recibidas |
| `transferencia_emitida` | Transferencias enviadas |
| `servicio` | Servicios |
| `comision` | Comisiones |
| `otro` | Otros |

---

## 🔧 Backend — Endpoints activos

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/facturar` | Emite factura a ARCA |
| POST | `/nota-credito` | Emite NC a ARCA |
| POST | `/pdf-factura` | Genera PDF de factura |
| POST | `/pdf-nota-credito` | Genera PDF de NC |
| POST | `/pdf-gastos` | PDF de reporte de gastos (Puppeteer) |
| POST | `/pdf-finanzas` | PDF de resumen financiero (Puppeteer) |
| GET | `/arca-ultimo-numero` | Consulta último número de comprobante |
| POST | `/padron-a5` | Consulta padrón ARCA |
| POST | `/enviar-email` | Envía email con PDF adjunto |
| POST | `/enviar-email-libre` | Email libre (sin PDF) |
| POST | `/analizar-extracto-santander` | Parsea CSV Santander, devuelve preview |
| POST | `/procesar-extracto-credicoop` | Parsea CSV Credicoop, devuelve preview |
| POST | `/importar-movimientos-bancarios` | Inserta movimientos + actualiza saldo cuenta |

---

## 🐛 Fixes aplicados en esta sesión (01/06/2026)

### Frontend — bug de timezone UTC-3 en filtros de fecha

Todos los `new Date(string_de_fecha)` que filtraban por mes/año usaban UTC medianoche, lo que en Argentina (UTC-3) desplazaba las fechas del día 1 de cada mes al mes anterior.

**Fix aplicado:** agregar `'T00:00:00'` para forzar hora local.

Archivos afectados en `src/App.jsx`:

| Línea aprox. | Componente | Cambio |
|---|---|---|
| Dashboard ~1400 | Dashboard | `new Date(e.fecha+'T00:00:00')` en filtro de gastos |
| Dashboard ~1477 | Dashboard | `+'T00:00:00'` en sort de últimos gastos |
| Contratos ~1886 | Contracts | `new Date(ct.fechaInicio+'T00:00:00')` en diff de días |
| Finance ~6320 | Finance | `filtExp`: `+'T00:00:00'` |
| Finance ~6380 | Finance | `filtIng`: `+'T00:00:00'` |
| Expenses ~4597 | Expenses | `filtered`: `+'T00:00:00'` |
| Expenses ~4767 | Expenses | `baseFiltered`: `+'T00:00:00'` |

### Frontend — último día de mes hardcodeado en MovimientosBancarios

La query Supabase usaba `.lte("fecha", \`${year}-${mes}-31\`)` para todos los meses. Para meses con menos de 31 días (junio, abril, febrero, etc.) PostgreSQL rechaza la fecha inválida → query falla silenciosamente → 0 resultados.

**Fix:** `new Date(parseInt(fYear), parseInt(fMonth), 0).getDate()` devuelve el último día real del mes.

### Backend — INSERT de movimientos bancarios incompleto

`/importar-movimientos-bancarios` armaba el `row` sin `categoria`, `tipo` ni `concepto`. Si la tabla tiene NOT NULL en `tipo`, todos los inserts fallan silenciosamente con 0 movimientos guardados.

**Fix:** agregar los tres campos al objeto `row` antes del INSERT.

### Backend — saldo_final Credicoop invertido

El CSV del Credicoop viene en orden **descendente** (más reciente primero). La lógica original tomaba el saldo de la última fila (= más antigua = saldo inicial). 

**Fix:** tomar el saldo de la primera fila con saldo no nulo (`movimientos.find(m => m.saldo_posterior != null)`) como `saldo_final`.

### Backend — referencia vacía en movimientos Credicoop

El campo COMBTE puede estar vacío. Sin referencia, la detección de duplicados no funciona correctamente.

**Fix:** `referencia = combte || \`${codigo}_${fecha}\`` usando la columna CODIGO del CSV.

---

## 🚧 Pendientes urgentes

| # | Tarea | Detalle |
|---|---|---|
| 1 | **Login con RLS** | Policies correctas para tablas `usuarios` y `usuarios_perfil` con rol `authenticated`. RLS temporalmente desactivado en esas tablas. |
| 2 | **Modelo Claude en backend** | Cambiar a `claude-sonnet-4-6` en endpoint `/procesar-factura-gasto` |
| 3 | **Total gastos no coincide** | Aplicar filtro consistente en Finance: excluir `es_tarjeta=true` y `es_externo=true` (igual que en PDF de gastos) |
| 4 | **PDF de Finanzas se corta** | Migrar a Puppeteer igual que `pdf-gastos` (ya hecho parcialmente) |
| 5 | **Categorización movimientos** | Muchos quedan en "Otros" — mejorar `clasificarMovimiento()` para detectar AFIP, impuestos, SPSE, Distrigas, etc. |
| 6 | **Saldo Credicoop al reimportar** | Verificar con CSV real que ahora toma la primera fila (saldo más reciente) |

---

## 🔜 Pendientes mejoras

| # | Tarea | Detalle |
|---|---|---|
| 7 | **Finanzas detalle por cliente** | Fecha muestra "Invalid Date" → usar campo `fecha` en formato YYYYMMDD. No contar facturas anuladas. Renombrar "Neto" a "Total" |
| 8 | **CargarFacturaPDFModal** | Agregar selector de cuenta bancaria cuando `pagado=true` |
| 9 | **Panel conciliación** | Permitir editar categorías antes de confirmar importación de extracto |
| 10 | **PDF mensual completo** | Agregar sección movimientos por cuenta y resumen impositivo completo |
| 11 | **App Mobile (PWA)** | Ver plan detallado en `handoff_v3_5_mobile.md` |

---

## ⚙️ Parseo CSV Credicoop — reglas

Formato: `FECHA;DESCRIPCION;COMBTE;DEBITO;CREDITO;SALDO;CODIGO`

| Regla | Detalle |
|---|---|
| Fecha | YYYYMMDD → YYYY-MM-DD con `fechaCredicoopAISO()` |
| Montos | `'1.200,00'` → `parseFloat(str.replace(/\./g,'').replace(',','.'))` |
| Dirección | CREDITO > 0 → ingreso (tipo=`"ingreso"`); DEBITO > 0 → egreso (tipo=`"egreso"`) |
| Importe | Siempre positivo absoluto; `tipo` indica dirección |
| Saldo final | CSV descendente → primera fila = más reciente = `saldo_final` |
| Referencia | `COMBTE` si existe, si no `CODIGO_fecha` |
| Encoding | UTF-8 |

---

## ⚠️ Notas importantes para el desarrollador

1. **No usar react-router-dom** — la navegación usa History API con hash (`#billing`, `#gastos`, etc.)
2. **Supabase dashboard** crashea si Chrome tiene el traductor activado — desactivarlo para esas páginas
3. **Deploy frontend:** push a `main` → Vercel detecta y despliega automáticamente (1-2 min)
4. **Deploy backend:** push a `main` en `radiofact-backend` → Railway despliega automáticamente (1-2 min)
5. **RLS en `usuarios_perfil`** está deshabilitado — pendiente reactivar con políticas correctas
6. **DEBUG_MODE = false** en App.jsx — las facturas son reales, cuidado con pruebas
7. **`new Date(string)`** sin `'T00:00:00'` → bug de timezone en Argentina (UTC-3). Todo parseo de fecha YYYY-MM-DD debe usar `+'T00:00:00'`
8. **Importe en movimientos** siempre positivo absoluto — la dirección se determina por el campo `tipo`

---

## 🚀 Mensaje sugerido para el próximo chat

```
Hola, vengo de la sesión del 01/06/2026 de RadioFact v3.7.
Adjunto el handoff completo (handoff_v3_7.md).

Sistema en producción: radiofact.vercel.app
Backend: radiofact-backend-production.up.railway.app

Lo que está funcionando:
- Facturación completa con ARCA + flujo de aprobaciones
- Gastos con PDF (Puppeteer)
- Finanzas con PDF (Puppeteer)
- Módulo Movimientos Bancarios con importación CSV Santander y Credicoop
- Todos los filtros de fecha corregidos (bug UTC-3)

Pendientes urgentes:
1. RLS en usuarios_perfil (desactivado)
2. Modelo claude-sonnet-4-6 en /procesar-factura-gasto
3. Categorización de movimientos (muchos quedan en "Otros")
4. Verificar saldo Credicoop con reimportación real del CSV
```

---

**Fin del handoff v3.7**
**Sesión cerrada:** 01/06/2026
