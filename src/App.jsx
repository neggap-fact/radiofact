// RadioFact v2.2 — Padrón A5 ARCA + sin botón Sincronizar
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabase";

const Icon = ({ d, size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);
const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  clients: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  contracts: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  billing: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  finance: "M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6",
  users: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
  send: "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
  expenses: "M3 3h18v18H3zM3 9h18M9 21V9",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
  pdf: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h5",
  report: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h5",
  trash: "M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6",
  creditNote: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
};

const BACKEND_URL = "https://radiofact-backend-production.up.railway.app";
const DEBUG_MODE = false; // Cambiar a false para emitir facturas reales a ARCA

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const EXPENSE_CATS = ["Proveedores","Personal","Servicios","Impuestos","Alquiler","Otros"];

function fmtMoney(n) {
  return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n||0);
}

// ── ALÍCUOTA DE IIBB SANTA CRUZ (publicidad/servicios de comunicación) ──
const IIBB_ALICUOTA = 0.03;  // 3%

// Suma neto/iva/total de facturas EXCLUYENDO las anuladas con NC.
// Devuelve { neto, iva, total, iibb, cantidad }.
function totalizarFacturas(invoices) {
  let neto = 0, iva = 0, total = 0, cantidad = 0;
  for (const inv of invoices) {
    if (inv.estado === "Anulada") continue;
    neto += parseFloat(inv.neto) || 0;
    iva += parseFloat(inv.iva) || 0;
    total += parseFloat(inv.total) || 0;
    cantidad++;
  }
  return {
    neto,
    iva,
    total,
    iibb: neto * IIBB_ALICUOTA,
    cantidad,
  };
}
function fmtDate(d) {
  if (!d) return "-";
  const [y,m,day] = d.split("-");
  return `${day}/${m}/${y}`;
}
function todayStr() { return new Date().toISOString().split("T")[0]; }

// Formatea el nombre del cliente: "Razón Social — Alias" si tiene alias, solo "Razón Social" si no.
function fmtClientName(client) {
  if (!client) return "";
  const rs = client.razonSocial || client.razon_social || "";
  const al = client.alias || "";
  return al ? `${rs} — ${al}` : rs;
}

// ── HELPERS DE FECHAS DE SERVICIO ─────────────────────────────────────────
// Convierte un Date a string "YYYY-MM-DD" usando fecha LOCAL (sin pasar por UTC).
function toLocalDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Convierte "YYYY-MM-DD" a "YYYYMMDD" (formato que pide ARCA).
function dateStrToArca(s) {
  if (!s) return "";
  return s.replace(/-/g, "");
}

// Suma N días a una fecha "YYYY-MM-DD" y devuelve nueva "YYYY-MM-DD"
function sumarDias(yyyymmdd, dias) {
  if (!yyyymmdd) return "";
  const [y, m, d] = yyyymmdd.split("-").map(Number);
  const fecha = new Date(y, m - 1, d);
  fecha.setDate(fecha.getDate() + dias);
  return toLocalDateStr(fecha);
}

// Suma N meses a una fecha "YYYY-MM-DD" y devuelve nueva "YYYY-MM-DD"
// (resta 1 día porque "1 mes desde el 01/01 = hasta el 31/01" no "hasta el 01/02")
function sumarMeses(yyyymmdd, meses) {
  if (!yyyymmdd) return "";
  const [y, m, d] = yyyymmdd.split("-").map(Number);
  const fecha = new Date(y, m - 1, d);
  fecha.setMonth(fecha.getMonth() + parseInt(meses));
  fecha.setDate(fecha.getDate() - 1);
  return toLocalDateStr(fecha);
}

// Calcula cuántos meses hay entre dos fechas "YYYY-MM-DD"
// (aproximado: cuenta meses calendario, redondea hacia abajo)
function calcularMesesEntre(desde, hasta) {
  if (!desde || !hasta) return 0;
  const [y1, m1, d1] = desde.split("-").map(Number);
  const [y2, m2, d2] = hasta.split("-").map(Number);
  let meses = (y2 - y1) * 12 + (m2 - m1);
  if (d2 < d1 - 1) meses -= 1; // ajuste si el día final es antes
  if (meses < 0) meses = 0;
  return meses + 1; // +1 porque "del 01/01 al 31/01" es 1 mes, no 0
}

// Devuelve la fecha más tardía entre dos strings YYYY-MM-DD
function maxFecha(a, b) {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

// Cálculo automático default: mes ANTERIOR completo (lo más común).
// El usuario después puede editar cualquier fecha o usar los botones rápidos del ReviewModal.
// IMPORTANTE: Vto Pago nunca puede ser anterior a HOY (ARCA error 10036).
function calcularFechasServicio(contrato, billMonth, billYear) {
  const dvp = parseInt(contrato.diaVencimientoPago) || 0;
  // Mes anterior al de facturación
  let mesSrv = billMonth - 1;
  let anioSrv = billYear;
  if (mesSrv < 1) { mesSrv = 12; anioSrv = billYear - 1; }
  // Primer y último día del mes anterior
  const desde = new Date(anioSrv, mesSrv - 1, 1);
  const hasta = new Date(anioSrv, mesSrv, 0);
  const vto = new Date(hasta);
  vto.setDate(vto.getDate() + dvp);
  const hoy = toLocalDateStr(new Date());
  return {
    servicioDesde: toLocalDateStr(desde),
    servicioHasta: toLocalDateStr(hasta),
    vtoPago: maxFecha(toLocalDateStr(vto), hoy),  // nunca antes de hoy
  };
}

// Helpers para botones rápidos del ReviewModal
function fechasMesAnteriorCompleto(billMonth, billYear, dvp = 0) {
  let mesSrv = billMonth - 1;
  let anioSrv = billYear;
  if (mesSrv < 1) { mesSrv = 12; anioSrv = billYear - 1; }
  const desde = new Date(anioSrv, mesSrv - 1, 1);
  const hasta = new Date(anioSrv, mesSrv, 0);
  const vto = new Date(hasta);
  vto.setDate(vto.getDate() + dvp);
  const hoy = toLocalDateStr(new Date());
  return {
    servicioDesde: toLocalDateStr(desde),
    servicioHasta: toLocalDateStr(hasta),
    vtoPago: maxFecha(toLocalDateStr(vto), hoy),
  };
}
function fechasMesActualCompleto(billMonth, billYear, dvp = 0) {
  const desde = new Date(billYear, billMonth - 1, 1);
  const hasta = new Date(billYear, billMonth, 0);
  const vto = new Date(hasta);
  vto.setDate(vto.getDate() + dvp);
  const hoy = toLocalDateStr(new Date());
  return {
    servicioDesde: toLocalDateStr(desde),
    servicioHasta: toLocalDateStr(hasta),
    vtoPago: maxFecha(toLocalDateStr(vto), hoy),
  };
}

// ── REGISTRO DE OPERACIONES ARCA (idempotencia + auditoría) ────────────────
// Genera un UUID único por operación e inserta una fila en operaciones_arca.
// Si el insert falla por unique constraint (UUID repetido), devuelve false:
// significa que esta operación ya estaba en curso o se completó. NO HAY que
// volver a llamar a ARCA en ese caso.
async function registrarOperacionArca(tipo, requestBody) {
  const id = crypto.randomUUID();
  const { error } = await supabase.from("operaciones_arca").insert({
    id,
    tipo,
    request_body: requestBody,
    estado: "pendiente",
  });
  if (error) {
    console.error("registrarOperacionArca falló:", error);
    return { ok: false, id: null };
  }
  return { ok: true, id };
}

async function completarOperacionArca(id, responseBody, exito) {
  if (!id) return;
  await supabase.from("operaciones_arca").update({
    response_body: responseBody,
    estado: exito ? "exitoso" : "fallido",
    completed_at: new Date().toISOString(),
  }).eq("id", id);
}

// ── MODAL DE CONFIRMACIÓN DE BORRADO (con tipeo "BORRAR" para protección extra) ──
function ConfirmDeleteModal({ titulo, mensaje, advertencia, requireTyping = false, onConfirm, onCancel, loading }) {
  const [typed, setTyped] = useState("");
  const canConfirm = requireTyping ? typed === "BORRAR" : true;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Icon d={Icons.trash} size={20} className="text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">{titulo}</h3>
            <p className="text-sm text-gray-600 mt-1">{mensaje}</p>
          </div>
        </div>

        {advertencia && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            ⚠️ {advertencia}
          </div>
        )}

        {requireTyping && (
          <div>
            <label className="text-xs text-gray-600 block mb-1">
              Para confirmar, escribí <strong>BORRAR</strong> abajo:
            </label>
            <input
              type="text"
              value={typed}
              onChange={e => setTyped(e.target.value)}
              autoFocus
              placeholder="BORRAR"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 font-mono"
            />
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading || !canConfirm}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Borrando..." : "Sí, borrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
function ConfirmEmisionModal({ titulo, resumen, items, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Icon d={Icons.alert} size={20} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">{titulo}</h3>
            <p className="text-xs text-gray-500 mt-1">Esta acción es irreversible. Una vez emitida, la factura queda registrada en ARCA.</p>
          </div>
        </div>

        {resumen && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1 border border-gray-200">
            {Object.entries(resumen).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span className="text-gray-500">{k}:</span>
                <span className="font-medium text-gray-900 text-right">{v}</span>
              </div>
            ))}
          </div>
        )}

        {items && items.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 text-xs border border-gray-200 max-h-40 overflow-y-auto">
            <p className="font-medium text-gray-700 mb-2">Se emitirán {items.length} factura(s):</p>
            <ul className="space-y-1">
              {items.map((it, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="text-gray-600 truncate">{it.label}</span>
                  <span className="font-medium text-gray-900 flex-shrink-0">{it.monto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "⏳ Emitiendo..." : "Confirmar y emitir"}
          </button>
        </div>
      </div>
    </div>
  );
}

const INIT_USERS = [
  {id:"u1",name:"Webmaster",email:"admin@radio.com",password:"admin123",role:"webmaster",active:true},
  {id:"u2",name:"María López",email:"maria@radio.com",password:"maria123",role:"admin",active:true},
  {id:"u3",name:"Carlos Ruiz",email:"carlos@radio.com",password:"carlos123",role:"operator",active:true},
];
const INIT_CLIENTS = [
  {id:"c1",razonSocial:"Supermercado El Sol S.A.",cuit:"30-71234567-1",domicilio:"Av. San Martín 1200, Caleta Olivia",condicionIVA:"Responsable Inscripto",tipoFactura:"A",email:"administracion@elsol.com.ar",telefono:"297-4112233",active:true},
  {id:"c2",razonSocial:"Farmacia Central",cuit:"20-25678901-4",domicilio:"Rivadavia 450, Caleta Olivia",condicionIVA:"Monotributista",tipoFactura:"B",email:"farmaciacentral@gmail.com",telefono:"297-4889900",active:true},
  {id:"c3",razonSocial:"Automotores del Sur S.R.L.",cuit:"30-68901234-7",domicilio:"Ruta 3 Km 123, Caleta Olivia",condicionIVA:"Responsable Inscripto",tipoFactura:"A",email:"ventas@automotoresdelsur.com.ar",telefono:"297-4556677",active:true},
];
const INIT_CONTRACTS = [
  {id:"ct1",clientId:"c1",descripcion:"Publicidad Radio AM - Tandas horarias",montoNeto:50000,iva:5250,total:55250,fechaInicio:"2025-01-01",duracionMeses:12,diaFacturacion:1,textoOpcional:"",active:true},
  {id:"ct2",clientId:"c1",descripcion:"Publicidad Web - Banner principal",montoNeto:20000,iva:2100,total:22100,fechaInicio:"2025-01-01",duracionMeses:6,diaFacturacion:1,textoOpcional:"",active:true},
  {id:"ct3",clientId:"c2",descripcion:"Publicidad Radio FM - Menciones",montoNeto:30000,iva:3150,total:33150,fechaInicio:"2025-02-01",duracionMeses:6,diaFacturacion:1,textoOpcional:"",active:true},
  {id:"ct4",clientId:"c3",descripcion:"Publicidad AM + FM - Paquete completo",montoNeto:80000,iva:8400,total:88400,fechaInicio:"2025-01-01",duracionMeses:12,diaFacturacion:1,textoOpcional:"OC 2025-001",active:true},
];
const INIT_INVOICES = [
  {id:"inv1",contractId:"ct1",clientId:"c1",clientName:"Supermercado El Sol S.A.",clientEmail:"administracion@elsol.com.ar",tipoFactura:"A",numero:"A-0001-00000001",month:1,year:2026,periodo:"Enero 2026",detalle:"Publicidad Radio AM — Período: Enero 2026",neto:50000,iva:5250,total:55250,estado:"Pagada",cae:"12345678901234",fechaPago:"2026-01-10",emailEnviado:true},
  {id:"inv2",contractId:"ct2",clientId:"c1",clientName:"Supermercado El Sol S.A.",clientEmail:"administracion@elsol.com.ar",tipoFactura:"A",numero:"A-0001-00000002",month:1,year:2026,periodo:"Enero 2026",detalle:"Publicidad Web - Banner — Período: Enero 2026",neto:20000,iva:2100,total:22100,estado:"Pagada",cae:"12345678901235",fechaPago:"2026-01-10",emailEnviado:true},
  {id:"inv3",contractId:"ct3",clientId:"c2",clientName:"Farmacia Central",clientEmail:"farmaciacentral@gmail.com",tipoFactura:"B",numero:"B-0001-00000003",month:1,year:2026,periodo:"Enero 2026",detalle:"Publicidad Radio FM — Período: Enero 2026",neto:30000,iva:3150,total:33150,estado:"Emitida",cae:"",fechaPago:"",emailEnviado:false},
  {id:"inv4",contractId:"ct4",clientId:"c3",clientName:"Automotores del Sur S.R.L.",clientEmail:"ventas@automotoresdelsur.com.ar",tipoFactura:"A",numero:"A-0001-00000004",month:1,year:2026,periodo:"Enero 2026",detalle:"Publicidad AM + FM — Período: Enero 2026 — OC 2025-001",neto:80000,iva:8400,total:88400,estado:"Emitida",cae:"",fechaPago:"",emailEnviado:false},
  {id:"inv5",contractId:"ct1",clientId:"c1",clientName:"Supermercado El Sol S.A.",clientEmail:"administracion@elsol.com.ar",tipoFactura:"A",numero:"A-0001-00000005",month:2,year:2026,periodo:"Febrero 2026",detalle:"Publicidad Radio AM — Período: Febrero 2026",neto:50000,iva:5250,total:55250,estado:"Emitida",cae:"",fechaPago:"",emailEnviado:false},
];
const INIT_EXPENSES = [
  {id:"ex1",descripcion:"Sueldo operador técnico",categoria:"Personal",monto:180000,fecha:"2026-01-31",proveedor:"Juan Pérez",comprobante:"REC-001",pagado:true,notas:""},
  {id:"ex2",descripcion:"Servicio de internet fibra",categoria:"Servicios",monto:25000,fecha:"2026-01-05",proveedor:"Telecom",comprobante:"FAC-2026-001",pagado:true,notas:""},
  {id:"ex3",descripcion:"Alquiler estudio",categoria:"Alquiler",monto:120000,fecha:"2026-01-01",proveedor:"Inmobiliaria Sur",comprobante:"REC-2026-01",pagado:true,notas:""},
  {id:"ex4",descripcion:"Mantenimiento equipos transmisión",categoria:"Proveedores",monto:45000,fecha:"2026-01-15",proveedor:"TecnoRadio S.R.L.",comprobante:"FAC-0045",pagado:false,notas:"Pendiente de pago"},
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INIT_USERS);
  const [clients, setClients] = useState([]);
  const [contracts, setContracts] = useState(INIT_CONTRACTS);
  const [invoices, setInvoices] = useState([]);
  const [creditNotes, setCreditNotes] = useState([]);
  const [emailNCModal, setEmailNCModal] = useState(null);
  const [expenses, setExpenses] = useState(INIT_EXPENSES);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState("dashboard");
  const [config, setConfig] = useState({
    empresa:"LA VANGUARDIA NOTICIAS",cuit:"30-71644424-0",
    domicilio:"Gobernador Gregores 1370, Caleta Olivia",email:"info@lavanguardianoticias.com.ar",
    diaFacturacion:1,diasGracia:5,
    emailTemplate:"Estimado/a {cliente},\n\nAdjunto encontrará la factura {numero} correspondiente al período {periodo}.\n\nMonto total: {total}\n\nQuedamos a su disposición.\n\nSaludos,\n{empresa}",
  });
  const [loginForm, setLoginForm] = useState({email:"",password:""});
  const [loginError, setLoginError] = useState("");

  // Cargar clientes desde Supabase
  useEffect(()=>{
    async function cargarClientes() {
      const {data,error} = await supabase.from("clientes").select("*").order("razon_social");
      if(!error && data) {
        setClients(data.map(c=>({
          id: c.id,
          razonSocial: c.razon_social,
          alias: c.alias || "",
          cuit: c.cuit,
          domicilio: c.domicilio,
          condicionIVA: c.condicion_iva,
          tipoFactura: c.tipo_factura,
          email: c.email,
          emailsAdicionales: c.emails_adicionales || "",
          telefono: c.telefono || "",
          active: c.activo !== false,
        })));
      }
    }
    cargarClientes();
  },[]);

  // Cargar contratos desde Supabase
  useEffect(()=>{
    async function cargarContratos() {
      const {data,error} = await supabase.from("contratos").select("*").order("created_at",{ascending:false});
      if(!error && data && data.length > 0) {
        setContracts(data.map(c=>({
          id: c.id,
          clientId: c.cliente_id,
          descripcion: c.descripcion || "",
          montoNeto: parseFloat(c.monto)||0,
          iva: parseFloat(c.iva)||0,
          total: Math.round((parseFloat(c.monto)+parseFloat(c.iva))*100)/100,
          fechaInicio: c.fecha_inicio || todayStr(),
          fechaFin: c.fecha_fin || "",
          duracionMeses: c.duracion_meses || 12,
          diaFacturacion: c.dia_facturacion || 1,
          textoOpcional: c.texto_opcional || "",
          diaVencimientoPago: c.dia_vencimiento_pago != null ? c.dia_vencimiento_pago : 0,
          active: c.activo !== false,
        })));
      }
    }
    cargarContratos();
  },[]);

  // Cargar facturas desde Supabase
  useEffect(()=>{
    async function cargarFacturas() {
      const {data,error} = await supabase.from("facturas").select("*").order("created_at",{ascending:false});
      if(!error && data) {
        // Helper: parsea "Mayo 2026" → [5, 2026]. Devuelve [null, null] si no matchea.
        const parsePeriodoTexto = (txt) => {
          if (!txt) return [null, null];
          const partes = txt.trim().split(/\s+/);
          if (partes.length < 2) return [null, null];
          const idx = MONTHS.findIndex(m => m.toLowerCase() === partes[0].toLowerCase());
          const año = parseInt(partes[partes.length - 1]);
          if (idx === -1 || isNaN(año)) return [null, null];
          return [idx + 1, año];
        };
        // Helper: parsea "2026-05-01" → [5, 2026] sin pasar por new Date() (evita timezone shift).
        const parseFechaISO = (fechaStr) => {
          if (!fechaStr) return [null, null];
          const partes = fechaStr.split("-");
          if (partes.length < 3) return [null, null];
          return [parseInt(partes[1]), parseInt(partes[0])];
        };
        setInvoices(data.map(f=>{
          // Prioridad 1: campo periodo ("Mayo 2026") porque refleja la INTENCIÓN del usuario.
          // Prioridad 2: fecha_emision parseada como string puro (sin timezone shift).
          // Prioridad 3: fecha actual como último recurso.
          let [mes, año] = parsePeriodoTexto(f.periodo);
          if (!mes || !año) [mes, año] = parseFechaISO(f.fecha_emision);
          if (!mes || !año) {
            mes = new Date().getMonth() + 1;
            año = new Date().getFullYear();
          }
          return {
            id: f.id,
            contractId: f.contrato_id,
            clientId: f.cliente_id,
            clientName: f.client_name || "",
            clientEmail: f.client_email || "",
            tipoFactura: f.tipo_comprobante===1?"A":"B",
            numero: f.numero_comprobante ? `${f.tipo_comprobante===1?"A":"B"}-0003-${String(f.numero_comprobante).padStart(8,"0")}` : "",
            month: mes,
            year: año,
            periodo: f.periodo || "",
            detalle: f.detalle || "",
            neto: parseFloat(f.neto)||0,
            iva: parseFloat(f.iva)||0,
            total: parseFloat(f.total)||0,
            estado: f.estado || "Emitida",
            cae: f.cae || "",
            cae_vencimiento: f.cae_vencimiento || "",
            fechaPago: f.fecha_pago || "",
            // Fechas de servicio (vienen de Supabase como YYYY-MM-DD, las convertimos a YYYYMMDD para el PDF)
            fch_serv_desde: f.fch_serv_desde ? f.fch_serv_desde.replace(/-/g,"") : "",
            fch_serv_hasta: f.fch_serv_hasta ? f.fch_serv_hasta.replace(/-/g,"") : "",
            fch_vto_pago:   f.fch_vto_pago   ? f.fch_vto_pago.replace(/-/g,"")   : "",
            nc_id: f.nc_id || null,
            origen: f.origen || "radiofact",  // "radiofact" | "manual_arca" | "sync_arca"
            puntoVenta: f.punto_venta || 3,
            emailEnviado: f.email_enviado === true,
            emailEnviadoFecha: f.email_enviado_fecha || null,
            fecha: f.fecha_emision ? f.fecha_emision.replace(/-/g,"") : "",
          };
        }));
      }
    }
    cargarFacturas();
  },[]);

  // Cargar notas de crédito desde Supabase
  useEffect(()=>{
    async function cargarNotasCredito() {
      const {data,error} = await supabase.from("notas_credito").select("*").order("created_at",{ascending:false});
      if(!error && data) {
        setCreditNotes(data.map(nc=>({
          id: nc.id,
          factura_id: nc.factura_id,
          clientId: nc.cliente_id,
          clientName: nc.client_name || "",
          tipoNC: nc.tipo_comprobante,  // 3=NCA, 8=NCB
          numero: nc.numero_comprobante ? `${nc.tipo_comprobante===3?"NCA":"NCB"}-0003-${String(nc.numero_comprobante).padStart(8,"0")}` : "",
          numero_comprobante: nc.numero_comprobante,
          neto: parseFloat(nc.neto)||0,
          iva: parseFloat(nc.iva)||0,
          total: parseFloat(nc.total)||0,
          motivo: nc.motivo || "",
          factura_original_numero: nc.factura_original_numero || "",
          factura_original_fecha: nc.factura_original_fecha || "",
          cae: nc.cae || "",
          cae_vencimiento: nc.cae_vencimiento || "",
          fecha_emision: nc.fecha_emision || "",
          estado: nc.estado || "Emitida",
        })));
      }
    }
    cargarNotasCredito();
  },[]);

  // Guardar factura en Supabase
  const guardarFacturaSupabase = async (inv, clientId) => {
    const tipoComp = inv.tipoFactura === "A" ? 1 : 6;
    const payload = {
      contrato_id: inv.contractId || null,
      cliente_id: clientId || inv.clientId || null,
      client_name: inv.clientName,
      client_email: inv.clientEmail || "",
      periodo: inv.periodo,
      detalle: inv.detalle,
      neto: inv.neto,
      iva: inv.iva,
      total: inv.total,
      numero_comprobante: inv.numero ? parseInt(inv.numero.split("-")[2]) : null,
      tipo_comprobante: tipoComp,
      cae: inv.cae,
      cae_vencimiento: inv.cae_vencimiento || null,
      estado: inv.estado || "Emitida",
      fecha_emision: inv.fecha ? `${inv.fecha.slice(0,4)}-${inv.fecha.slice(4,6)}-${inv.fecha.slice(6,8)}` : todayStr(),
      punto_venta: inv.puntoVenta || 3,  // 3 = RadioFact, 1/2 = ARCA Web manual
      origen: inv.origen || "radiofact",  // "radiofact" | "manual_arca" | "sync_arca"
      tipo_doc_cliente: 80,
      cuit_cliente: inv.clientCuit || "",
      moneda: "PES",
      cotizacion: 1,
      resultado: "A",
      // Fechas de servicio (formato date YYYY-MM-DD para Supabase)
      fch_serv_desde: inv.fch_serv_desde ? `${inv.fch_serv_desde.slice(0,4)}-${inv.fch_serv_desde.slice(4,6)}-${inv.fch_serv_desde.slice(6,8)}` : null,
      fch_serv_hasta: inv.fch_serv_hasta ? `${inv.fch_serv_hasta.slice(0,4)}-${inv.fch_serv_hasta.slice(4,6)}-${inv.fch_serv_hasta.slice(6,8)}` : null,
      fch_vto_pago:   inv.fch_vto_pago   ? `${inv.fch_vto_pago.slice(0,4)}-${inv.fch_vto_pago.slice(4,6)}-${inv.fch_vto_pago.slice(6,8)}` : null,
    };
    console.log("Guardando factura en Supabase:", payload);
    const {data, error} = await supabase.from("facturas").insert(payload).select();
    if(error) {
      console.error("Error Supabase al guardar factura:", error);
      return null;
    }
    console.log("Factura guardada OK:", data);
    // Devolver el UUID real generado por Supabase para reemplazar el id local
    return data && data[0] ? data[0].id : null;
  };

  const descargarPDF = async (inv) => {
    try {
      const client = clients.find(c => c.id === inv.clientId);
      const res = await fetch(`${BACKEND_URL}/pdf-factura`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: inv.numero,
          clientName: inv.clientName,
          clientCuit: client?.cuit || "-",
          clientDomicilio: client?.domicilio || "-",
          clientCondicionIVA: client?.condicionIVA || "",
          periodo: inv.periodo,
          detalle: inv.detalle,
          neto: inv.neto,
          iva: inv.iva,
          total: inv.total,
          cae: inv.cae,
          cae_vencimiento: inv.cae_vencimiento,
          fecha: inv.fecha || new Date().toISOString().slice(0,10).replace(/-/g,""),
          tipoFactura: inv.tipoFactura,
          empresa: "LA VANGUARDIA NOTICIAS",
          empresaCuit: "30-71644424-0",
          empresaDomicilio: "Gobernador Gregores 1370, Caleta Olivia",
          // Fechas de servicio para el PDF (en formato YYYYMMDD)
          fch_serv_desde: inv.fch_serv_desde || "",
          fch_serv_hasta: inv.fch_serv_hasta || "",
          fch_vto_pago:   inv.fch_vto_pago   || "",
        }),
      });
      if (!res.ok) throw new Error("Error generando PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Factura-${inv.numero}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {
      alert("Error descargando PDF: " + e.message);
    }
  };

  // ── DESCARGAR PDF DE UNA NOTA DE CRÉDITO ─────────────────────────────────
  const descargarPDFNotaCredito = async (nc, factura) => {
    try {
      const client = clients.find(c => c.id === nc.clientId);
      const tipoFacturaLetra = nc.tipoNC === 3 ? "A" : "B";
      const res = await fetch(`${BACKEND_URL}/pdf-nota-credito`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: nc.numero,
          clientName: nc.clientName,
          clientCuit: client?.cuit || "-",
          clientDomicilio: client?.domicilio || "-",
          clientCondicionIVA: client?.condicionIVA || "",
          periodo: factura?.periodo || "",
          detalle: "",
          neto: nc.neto,
          iva: nc.iva,
          total: nc.total,
          cae: nc.cae,
          cae_vencimiento: nc.cae_vencimiento,
          fecha: nc.fecha_emision ? nc.fecha_emision.replace(/-/g,"") : "",
          tipoFactura: tipoFacturaLetra,
          empresa: "LA VANGUARDIA NOTICIAS",
          empresaCuit: "30-71644424-0",
          empresaDomicilio: "Gobernador Gregores 1370, Caleta Olivia",
          esNotaCredito: true,
          facturaAsoc: factura ? {
            numero: factura.numero,
            fecha: factura.fecha || "",
            cae: factura.cae,
          } : null,
          motivoNC: nc.motivo,
        }),
      });
      if (!res.ok) throw new Error("Error generando PDF de NC");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NotaCredito-${nc.numero}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch(e) {
      alert("Error descargando PDF de NC: " + e.message);
    }
  };

  // ── GUARDAR NC EN SUPABASE ───────────────────────────────────────────────
  const guardarNotaCreditoSupabase = async (nc) => {
    const payload = {
      factura_id: nc.factura_id || null,
      cliente_id: nc.clientId || null,
      client_name: nc.clientName,
      tipo_comprobante: nc.tipoNC,
      numero_comprobante: nc.numero_comprobante,
      neto: nc.neto,
      iva: nc.iva,
      total: nc.total,
      motivo: nc.motivo || "",
      factura_original_numero: nc.factura_original_numero || "",
      factura_original_fecha: nc.factura_original_fecha || "",
      cae: nc.cae,
      cae_vencimiento: nc.cae_vencimiento || null,
      fecha_emision: nc.fecha_emision || todayStr(),
      punto_venta: 3,
      estado: "Emitida",
    };
    const {data, error} = await supabase.from("notas_credito").insert(payload).select().single();
    if(error) {
      console.error("Error guardando NC:", error);
      return null;
    }
    return data;
  };

  // ── MARCAR FACTURA COMO ANULADA EN SUPABASE ──────────────────────────────
  const marcarFacturaAnulada = async (facturaId, ncId) => {
    const {error} = await supabase.from("facturas").update({
      estado: "Anulada",
      nc_id: ncId,
    }).eq("id", facturaId);
    if(error) console.error("Error marcando factura como Anulada:", error);
  };

  // ── MARCAR EMAIL COMO ENVIADO EN SUPABASE ─────────────────────────────────
  // Persiste el flag email_enviado = true + timestamp para que sobreviva recargas.
  // Devuelve true si se actualizó correctamente, false si falló (no bloquea el flujo).
  const marcarEmailEnviadoSupabase = async (facturaId) => {
    if (!facturaId) return false;
    // No intentar updatear si el ID es local (no UUID) — pasa cuando recién se emitió y aún no se hizo refresh
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(facturaId)) {
      console.warn("ID de factura no es UUID válido, salteando update Supabase:", facturaId);
      return false;
    }
    const ahora = new Date().toISOString();
    const { error } = await supabase.from("facturas").update({
      email_enviado: true,
      email_enviado_fecha: ahora,
    }).eq("id", facturaId);
    if (error) {
      console.error("Error marcando email_enviado en Supabase:", error);
      return false;
    }
    return true;
  };

  // ── REGISTRAR EMAIL ENVIADO EN HISTORIAL ─────────────────────────────────
  // Guarda en tabla emails_enviados para auditoría/trazabilidad.
  const registrarEmailEnHistorial = async ({ cliente_id, factura_id, destinatarios, asunto, cuerpo, tipo, exito, error_msg }) => {
    // Validar que factura_id sea UUID válido (no id local del tipo "inv-12345-...")
    const facturaIdValida = factura_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(factura_id) ? factura_id : null;
    const clienteIdValido = cliente_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cliente_id) ? cliente_id : null;
    const { error } = await supabase.from("emails_enviados").insert({
      cliente_id: clienteIdValido,
      factura_id: facturaIdValida,
      destinatarios: Array.isArray(destinatarios) ? destinatarios : [destinatarios],
      asunto,
      cuerpo,
      tipo: tipo || "libre",
      exito: exito !== false,
      error_msg: error_msg || null,
    });
    if (error) {
      console.error("Error registrando email en historial:", error);
      return false;
    }
    return true;
  };

  // ── ACTUALIZAR EMAILS DEL CLIENTE ─────────────────────────────────────────
  // Actualiza email principal y/o emails adicionales en Supabase + state local.
  const actualizarEmailsCliente = async (clienteId, emailPrincipal, emailsAdicionales) => {
    if (!clienteId) return false;
    const { error } = await supabase.from("clientes").update({
      email: emailPrincipal,
      emails_adicionales: emailsAdicionales || null,
    }).eq("id", clienteId);
    if (error) {
      console.error("Error actualizando emails del cliente:", error);
      return false;
    }
    setClients(prev => prev.map(c => c.id === clienteId ? { ...c, email: emailPrincipal, emailsAdicionales: emailsAdicionales || "" } : c));
    return true;
  };

  // ── EMITIR NOTA DE CRÉDITO (proceso completo) ────────────────────────────
  // Esta es la función que se llama desde CreditNotes Y desde el botón "Anular con NC"
  // del listado de facturas. Devuelve true si todo salió bien, false si falló.
  const emitirNotaCredito = async (factura, motivo) => {
    if (!factura || !factura.cae) {
      alert("La factura debe estar emitida con CAE para poder anularla.");
      return false;
    }
    const cliente = clients.find(c => c.id === factura.clientId);
    if (!cliente) {
      alert("No se encontró el cliente de la factura.");
      return false;
    }

    // Registrar la operación ANTES de llamar a ARCA (idempotencia + auditoría)
    const factura_original_tipo = factura.tipoFactura === "A" ? 1 : 6;
    const factura_original_numero = parseInt(factura.numero.split("-")[2]);
    const factura_original_fecha = factura.fecha || ""; // YYYYMMDD

    const requestPayload = {
      cuit_cliente: parseInt(cliente.cuit.replace(/-/g, "")),
      tipo_doc: 80,
      punto_venta: 3,
      monto_neto: factura.neto,
      monto_iva: factura.iva,
      monto_total: factura.total,
      concepto: 1,
      factura_original_tipo,
      factura_original_pv: 3,
      factura_original_numero,
      factura_original_fecha,
      // Datos de auditoría / contexto
      motivo,
      factura_id: factura.id,
      cliente_nombre: cliente.razonSocial,
    };

    const opReg = await registrarOperacionArca("nota_credito", requestPayload);

    try {
      const res = await fetch(`${BACKEND_URL}/nota-credito`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      const data = await res.json();
      await completarOperacionArca(opReg.id, data, !!data.exito);

      if (!data.exito) {
        alert(`❌ Error al emitir NC: ${data.error}`);
        return false;
      }

      // Guardar la NC en Supabase
      const ncObj = {
        factura_id: factura.id,
        clientId: factura.clientId,
        clientName: factura.clientName,
        tipoNC: data.datos.tipo_nc,
        numero_comprobante: data.datos.numero,
        neto: factura.neto,
        iva: factura.iva,
        total: factura.total,
        motivo,
        factura_original_numero: factura.numero,
        factura_original_fecha: factura.fecha
          ? `${factura.fecha.slice(0,4)}-${factura.fecha.slice(4,6)}-${factura.fecha.slice(6,8)}`
          : null,
        cae: data.datos.cae,
        cae_vencimiento: data.datos.cae_vencimiento,
        fecha_emision: data.datos.fecha
          ? `${data.datos.fecha.slice(0,4)}-${data.datos.fecha.slice(4,6)}-${data.datos.fecha.slice(6,8)}`
          : todayStr(),
      };
      const ncSaved = await guardarNotaCreditoSupabase(ncObj);
      if (!ncSaved) {
        alert("⚠️ La NC se emitió en ARCA pero hubo un error al guardarla en el sistema. CAE: " + data.datos.cae);
        return false;
      }

      // Marcar la factura original como Anulada
      await marcarFacturaAnulada(factura.id, ncSaved.id);

      // Actualizar estados locales
      const ncCompleta = {
        ...ncObj,
        id: ncSaved.id,
        numero: `${data.datos.tipo_nc===3?"NCA":"NCB"}-0003-${String(data.datos.numero).padStart(8,"0")}`,
      };
      setCreditNotes(prev => [ncCompleta, ...prev]);
      setInvoices(prev => prev.map(i =>
        i.id === factura.id ? { ...i, estado: "Anulada", nc_id: ncSaved.id } : i
      ));

      alert(`✅ NC emitida correctamente.\nCAE: ${data.datos.cae}\nNúmero: ${ncCompleta.numero}`);
      return true;

    } catch(e) {
      await completarOperacionArca(opReg.id, { error: e.message }, false);
      alert("❌ Error de conexión al emitir NC: " + e.message);
      return false;
    }
  };

  const save = useCallback(async(data)=>{
    try{ localStorage.setItem("radiofact-v3", JSON.stringify(data)); }catch(e){}
  },[]);

  // Carga inicial: users/contracts/config desde localStorage, gastos desde Supabase
  useEffect(()=>{
    try{
      const raw = localStorage.getItem("radiofact-v3");
      if(raw){
        const d = JSON.parse(raw);
        if(d.users) setUsers(d.users);
        if(d.contracts) setContracts(d.contracts);
        // d.expenses ya no se restaura — ahora vienen de Supabase
        if(d.config) setConfig(d.config);
      }
      const savedUser = localStorage.getItem("radiofact-session");
      if(savedUser) setCurrentUser(JSON.parse(savedUser));
    }catch(e){}

    // Cargar gastos desde Supabase
    supabase.from("gastos").select("*").order("fecha", { ascending: false }).then(({ data, error }) => {
      if(error){ console.error("Error cargando gastos:", error); return; }
      if(data) setExpenses(data.map(g => ({
        id:              g.id,
        descripcion:     g.descripcion || "",
        categoria:       g.categoria || "Otros",
        monto:           parseFloat(g.monto) || 0,
        fecha:           g.fecha || "",
        proveedor:       g.proveedor || "",
        comprobante:     g.comprobante || "",
        url_comprobante: g.url_comprobante || "",
        pagado:          g.pagado !== false,
        notas:           g.notas || "",
      })));
    });
  },[]);

  useEffect(()=>{
    if(!currentUser) return;
    save({users,contracts,config}); // expenses ya no va a localStorage
  },[users,contracts,config]);

  const handleLogin = ()=>{
    const u = users.find(u=>u.email===loginForm.email&&u.password===loginForm.password&&u.active);
    if(u){
      setCurrentUser(u);
      setLoginError("");
      localStorage.setItem("radiofact-session", JSON.stringify(u));
    }
    else setLoginError("Email o contraseña incorrectos.");
  };

  if(!currentUser) return <LoginScreen form={loginForm} setForm={setLoginForm} onLogin={handleLogin} error={loginError}/>;

  const canEdit = currentUser.role!=="operator";
  const unread = notifications.filter(n=>!n.read).length;

  const pages = [
    {id:"dashboard",label:"Dashboard",icon:Icons.dashboard},
    {id:"clients",label:"Clientes",icon:Icons.clients},
    {id:"contracts",label:"Contratos",icon:Icons.contracts},
    {id:"billing",label:"Facturación",icon:Icons.billing},
    {id:"factura-directa",label:"Factura Directa",icon:Icons.pdf},
    {id:"notas-credito",label:"Notas de Crédito",icon:Icons.creditNote},
    {id:"expenses",label:"Gastos",icon:Icons.expenses},
    {id:"finance",label:"Finanzas",icon:Icons.finance},
    {id:"reports",label:"Reportes",icon:Icons.download},
    ...(currentUser.role==="webmaster"?[{id:"users",label:"Usuarios",icon:Icons.users}]:[]),
    {id:"settings",label:"Configuración",icon:Icons.settings},
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{fontFamily:"Inter,system-ui,sans-serif"}}>
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="text-sm font-bold text-blue-700">📻 RadioFact</div>
          <div className="text-xs text-gray-400 mt-0.5">Sistema de Gestión</div>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {pages.map(p=>(
            <button key={p.id} onClick={()=>setPage(p.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${page===p.id?"bg-blue-50 text-blue-700":"text-gray-600 hover:bg-gray-50"}`}>
              <Icon d={p.icon} size={15}/>{p.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{currentUser.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate">{currentUser.name}</div>
              <div className="text-xs text-gray-400 capitalize">{currentUser.role}</div>
            </div>
          </div>
          <button onClick={()=>{setCurrentUser(null);localStorage.removeItem("radiofact-session");}} className="w-full flex items-center gap-2 text-xs text-gray-500 hover:text-red-600 px-1 py-1">
            <Icon d={Icons.logout} size={13}/>Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="font-semibold text-gray-800 text-sm">{pages.find(p=>p.id===page)?.label}</h1>
          <button onClick={()=>setPage("billing")} className="relative p-1">
            <Icon d={Icons.bell} size={19} className="text-gray-500 hover:text-blue-600"/>
            {unread>0&&<span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unread}</span>}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          {page==="dashboard"&&<Dashboard clients={clients} contracts={contracts} invoices={invoices} expenses={expenses} notifications={notifications} setPage={setPage}/>}
          {page==="clients"&&<Clients clients={clients} setClients={setClients} contracts={contracts} invoices={invoices} currentUser={currentUser} canEdit={canEdit} registrarEmailEnHistorial={registrarEmailEnHistorial}/>}
          {page==="contracts"&&<Contracts contracts={contracts} setContracts={setContracts} clients={clients} invoices={invoices} currentUser={currentUser} canEdit={canEdit}/>}
          {/* FIX 1: agregado guardarFacturaSupabase como prop */}
          {page==="billing"&&<Billing clients={clients} contracts={contracts} setContracts={setContracts} invoices={invoices} setInvoices={setInvoices} notifications={notifications} setNotifications={setNotifications} config={config} canEdit={canEdit} descargarPDF={descargarPDF} guardarFacturaSupabase={guardarFacturaSupabase} emitirNotaCredito={emitirNotaCredito} registrarEmailEnHistorial={registrarEmailEnHistorial} marcarEmailEnviadoSupabase={marcarEmailEnviadoSupabase} actualizarEmailsCliente={actualizarEmailsCliente}/>}
          {page==="factura-directa"&&<FacturaDirecta clients={clients} setClients={setClients} invoices={invoices} setInvoices={setInvoices} canEdit={canEdit} descargarPDF={descargarPDF} guardarFacturaSupabase={guardarFacturaSupabase}/>}
          {page==="notas-credito"&&<CreditNotes
            creditNotes={creditNotes}
            invoices={invoices}
            clients={clients}
            canEdit={canEdit}
            onEmitir={emitirNotaCredito}
            onDescargarPDF={descargarPDFNotaCredito}
            onEnviarEmail={(nc, factura) => {
              const cli = clients.find(c=>c.id===nc.clientId);
              if (!cli?.email) {
                alert("El cliente no tiene email cargado en la ficha del cliente.");
                return;
              }
              setEmailNCModal({ nc, factura, cliente: cli });
            }}
          />}
          {page==="expenses"&&<Expenses expenses={expenses} setExpenses={setExpenses} currentUser={currentUser} canEdit={canEdit}/>}
          {page==="finance"&&<Finance clients={clients} invoices={invoices} expenses={expenses}/>}
          {page==="reports"&&<Reports clients={clients} contracts={contracts} invoices={invoices} expenses={expenses}/>}
          {page==="users"&&currentUser.role==="webmaster"&&<Users users={users} setUsers={setUsers} currentUser={currentUser}/>}
          {page==="settings"&&<Settings config={config} setConfig={setConfig} canEdit={canEdit}/>}
          {emailNCModal && (
            <EmailNCModal
              nc={emailNCModal.nc}
              factura={emailNCModal.factura}
              cliente={emailNCModal.cliente}
              config={config}
              onClose={()=>setEmailNCModal(null)}
              onSent={()=>setEmailNCModal(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function LoginScreen({form,setForm,onLogin,error}){
  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📻</div>
          <h1 className="text-xl font-bold text-gray-800">RadioFact</h1>
          <p className="text-sm text-gray-400">Sistema de Gestión Publicitaria</p>
        </div>
        <div className="space-y-4">
          <Field label="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} type="email" placeholder="usuario@empresa.com"/>
          <Field label="Contraseña" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} type="password" placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&onLogin()}/>
          {error&&<p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button onClick={onLogin} className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700">Ingresar</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({clients,contracts,invoices,expenses,notifications,setPage}){
  const today=new Date();
  const m=today.getMonth()+1,y=today.getFullYear();
  const mi=invoices.filter(i=>i.month===m&&i.year===y);
  const me=expenses.filter(e=>{const d=new Date(e.fecha);return d.getMonth()+1===m&&d.getFullYear()===y;});
  // Totales descontando facturas anuladas (NC)
  const tot = totalizarFacturas(mi);
  const facturado = tot.total;
  const ivaDelMes = tot.iva;
  const iibbDelMes = tot.iibb;
  const cobrado = mi.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0);
  const adeudado = facturado - cobrado;
  const totalGastos=me.reduce((s,e)=>s+e.monto,0);
  const resultado=cobrado-totalGastos;
  const pendingNotifs=notifications.filter(n=>!n.read);
  return(
    <div className="space-y-5">
      {pendingNotifs.length>0&&(
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Icon d={Icons.alert} size={18} className="text-amber-600 mt-0.5 flex-shrink-0"/>
          <div className="flex-1">
            <p className="font-semibold text-amber-800 text-sm">⚠️ Alertas pendientes</p>
            {pendingNotifs.map(n=><p key={n.id} className="text-amber-700 text-xs mt-0.5">{n.message}</p>)}
          </div>
          <button onClick={()=>setPage("billing")} className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 flex-shrink-0">Revisar</button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-7">
        {[
          {label:"Clientes",value:clients.filter(c=>c.active).length,sub:"activos"},
          {label:"Contratos",value:contracts.filter(c=>c.active).length,sub:"vigentes"},
          {label:"Facturado",value:fmtMoney(facturado),sub:MONTHS[m-1]},
          {label:"Cobrado",value:fmtMoney(cobrado),sub:"este mes"},
          {label:"Adeudado",value:fmtMoney(adeudado),sub:"pendiente"},
          {label:"IVA del mes",value:fmtMoney(ivaDelMes),sub:"débito fiscal"},
          {label:"IIBB 3%",value:fmtMoney(iibbDelMes),sub:"a pagar (informativo)"},
        ].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-3">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className="font-bold text-gray-800 text-sm mt-0.5 leading-tight">{s.value}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className={`rounded-xl border p-4 ${resultado>=0?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
        <p className="text-xs font-semibold text-gray-500 mb-2">Resultado {MONTHS[m-1]} {y}</p>
        <div className="flex gap-6">
          <div><p className="text-xs text-gray-400">Cobrado</p><p className="font-bold text-green-700">{fmtMoney(cobrado)}</p></div>
          <div><p className="text-xs text-gray-400">Gastos</p><p className="font-bold text-red-600">{fmtMoney(totalGastos)}</p></div>
          <div><p className="text-xs text-gray-400">Resultado neto</p><p className={`font-bold text-lg ${resultado>=0?"text-green-700":"text-red-600"}`}>{fmtMoney(resultado)}</p></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm mb-3">Últimas facturas</h3>
          {[...invoices].reverse().slice(0,5).map(inv=>(
            <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div><p className="text-xs font-medium truncate max-w-28">{inv.clientName}</p><p className="text-xs text-gray-400">{MONTHS[(inv.month||1)-1]} {inv.year}</p></div>
              <div className="text-right"><p className="text-xs font-semibold">{fmtMoney(inv.total)}</p><EstadoBadge estado={inv.estado}/></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm mb-3">Últimos gastos</h3>
          {expenses.length===0?<p className="text-xs text-gray-400 py-4 text-center">Sin gastos</p>:
            [...expenses].reverse().slice(0,5).map(ex=>(
              <div key={ex.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div><p className="text-xs font-medium">{ex.descripcion}</p><p className="text-xs text-gray-400">{ex.categoria}</p></div>
                <p className="text-xs font-semibold text-red-600">{fmtMoney(ex.monto)}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function Clients({clients,setClients,contracts,invoices,currentUser,canEdit,registrarEmailEnHistorial}){
  const [modal,setModal]=useState(null);
  const [search,setSearch]=useState("");
  const [confirmDelete, setConfirmDelete] = useState(null); // { cliente, deps, blocked }
  const [deleting, setDeleting] = useState(false);
  const [emailLibreModal, setEmailLibreModal] = useState(null);
  const isWebmaster = currentUser?.role === "webmaster";

  const empty={razonSocial:"",alias:"",cuit:"",domicilio:"",condicionIVA:"Responsable Inscripto",tipoFactura:"A",email:"",emailsAdicionales:"",telefono:"",active:true};
  const filtered=clients.filter(c=>
    c.razonSocial.toLowerCase().includes(search.toLowerCase()) ||
    (c.alias||"").toLowerCase().includes(search.toLowerCase()) ||
    c.cuit.includes(search)
  );
  const save=async(data)=>{
    const supabaseData = {
      razon_social: data.razonSocial,
      alias: data.alias || null,
      cuit: data.cuit,
      domicilio: data.domicilio,
      condicion_iva: data.condicionIVA,
      tipo_factura: data.tipoFactura,
      email: data.email,
      emails_adicionales: data.emailsAdicionales || null,
      telefono: data.telefono || "",
      activo: data.active !== false,
    };
    if(data.id && !data.id.startsWith("c-")) {
      await supabase.from("clientes").update(supabaseData).eq("id", data.id);
      setClients(prev=>prev.map(c=>c.id===data.id?data:c));
    } else {
      const {data:newClient} = await supabase.from("clientes").insert(supabaseData).select().single();
      if(newClient) setClients(prev=>[...prev,{...data,id:newClient.id}]);
      else setClients(prev=>[...prev,{...data,id:`c-${Date.now()}`}]);
    }
    setModal(null);
  };

  // Pedir confirmación de borrado, calculando dependencias
  const askDelete = (cli) => {
    const ctsActivos = contracts.filter(ct => ct.clientId === cli.id);
    const facsAsociadas = (invoices || []).filter(inv => inv.clientId === cli.id);
    let advertencia = null;
    let blocked = false;
    if (facsAsociadas.length > 0) {
      blocked = true;
      advertencia = `Este cliente tiene ${facsAsociadas.length} factura(s) emitida(s). NO se puede borrar (queda registro fiscal). Solo se puede DESACTIVAR desde el lápiz de edición.`;
    } else if (ctsActivos.length > 0) {
      blocked = true;
      advertencia = `Este cliente tiene ${ctsActivos.length} contrato(s) asociado(s). Borrá los contratos primero, o desactivá el cliente en lugar de borrarlo.`;
    }
    setConfirmDelete({ cli, blocked, advertencia });
  };

  const doDelete = async () => {
    if (!confirmDelete || confirmDelete.blocked) return;
    setDeleting(true);
    const { cli } = confirmDelete;
    if (cli.id && !cli.id.startsWith("c-")) {
      const { error } = await supabase.from("clientes").delete().eq("id", cli.id);
      if (error) {
        alert("Error al borrar en Supabase: " + error.message);
        setDeleting(false);
        return;
      }
    }
    setClients(prev => prev.filter(c => c.id !== cli.id));
    setDeleting(false);
    setConfirmDelete(null);
  };
  return(
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/>
        {canEdit&&<button onClick={()=>setModal(empty)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Icon d={Icons.plus} size={14}/>Nuevo cliente</button>}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{["Razón Social","CUIT","Condición IVA","Tipo","Email","Contratos","Estado",""].map(h=><th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(c=>(
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 text-sm">
                  <div className="font-medium">{c.razonSocial}</div>
                  {c.alias && <div className="text-xs text-gray-400 truncate">{c.alias}</div>}
                </td>
                <td className="px-3 py-2.5 text-gray-500 font-mono text-xs">{c.cuit}</td>
                <td className="px-3 py-2.5 text-gray-500 text-xs">{c.condicionIVA}</td>
                <td className="px-3 py-2.5"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Fac.{c.tipoFactura}</span></td>
                <td className="px-3 py-2.5 text-gray-500 text-xs">{c.email}</td>
                <td className="px-3 py-2.5 text-center"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{contracts.filter(ct=>ct.clientId===c.id&&ct.active).length}</span></td>
                <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs ${c.active?"bg-green-50 text-green-700":"bg-gray-100 text-gray-400"}`}>{c.active?"Activo":"Inactivo"}</span></td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {c.email && canEdit && <button onClick={()=>setEmailLibreModal(c)} className="text-gray-400 hover:text-blue-600" title={`Enviar email a ${c.razonSocial}`}><Icon d={Icons.mail} size={14}/></button>}
                    {canEdit&&<button onClick={()=>setModal(c)} className="text-gray-400 hover:text-blue-600" title="Editar"><Icon d={Icons.edit} size={14}/></button>}
                    {isWebmaster&&<button onClick={()=>askDelete(c)} className="text-gray-400 hover:text-red-600" title="Borrar"><Icon d={Icons.trash} size={14}/></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div className="text-center py-8 text-gray-400 text-sm">Sin clientes</div>}
      </div>
      {modal&&<ClientModal data={modal} onSave={save} onClose={()=>setModal(null)}/>}
      {emailLibreModal && (
        <EmailLibreModal
          cliente={emailLibreModal}
          onClose={() => setEmailLibreModal(null)}
          registrarEnHistorial={registrarEmailEnHistorial}
          onEnviado={() => alert("✅ Email enviado correctamente")}
        />
      )}
      {confirmDelete && (
        <ConfirmDeleteModal
          titulo={confirmDelete.blocked ? "No se puede borrar" : "¿Borrar cliente?"}
          mensaje={
            confirmDelete.blocked
              ? "Este cliente tiene datos asociados que impiden el borrado."
              : `Vas a borrar definitivamente a "${confirmDelete.cli.razonSocial}". Esta acción no se puede deshacer.`
          }
          advertencia={confirmDelete.advertencia}
          requireTyping={!confirmDelete.blocked}
          loading={deleting}
          onCancel={() => { if (!deleting) setConfirmDelete(null); }}
          onConfirm={confirmDelete.blocked ? () => setConfirmDelete(null) : doDelete}
        />
      )}
    </div>
  );
}

// Mapea la descripción de condición IVA que devuelve ARCA al valor que usa el sistema
function mapCondicionIVA(desc) {
  const d = (desc || "").toLowerCase();
  if (d.includes("responsable inscripto") || d.includes("resp. inscripto")) return "Responsable Inscripto";
  if (d.includes("monotribut")) return "Monotributista";
  if (d.includes("exento") || d.includes("exenta")) return "Exento";
  if (d.includes("consumidor")) return "Consumidor Final";
  return desc; // devolver tal cual si no matchea
}

function ClientModal({data,onSave,onClose}){
  const [form,setForm]=useState(data);
  const [padronLoading,setPadronLoading]=useState(false);
  const [padronError,setPadronError]=useState("");
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));

  const consultarPadron = async () => {
    const cuitLimpio = (form.cuit||"").replace(/[-\s]/g,"");
    if(cuitLimpio.length < 10){ setPadronError("CUIT inválido"); return; }
    setPadronLoading(true); setPadronError("");
    try {
      const res = await fetch(`${BACKEND_URL}/padron-a5`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({cuit: cuitLimpio})
      });
      const data = await res.json();
      if(data.exito){
        setForm(p=>({
          ...p,
          razonSocial: data.razon_social || p.razonSocial,
          domicilio:   data.domicilio   || p.domicilio,
          condicionIVA: data.condicion_iva && data.condicion_iva !== "No determinada"
            ? mapCondicionIVA(data.condicion_iva)
            : p.condicionIVA,
        }));
      } else {
        setPadronError(data.error || "Error consultando ARCA");
      }
    } catch(e){ setPadronError("Error de conexión con el backend"); }
    finally{ setPadronLoading(false); }
  };

  return(
    <Modal title={form.id?"Editar cliente":"Nuevo cliente"} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Razón Social" value={form.razonSocial} onChange={f("razonSocial")}/></div>
        <div className="col-span-2">
          <Field label="Alias / Nombre comercial (opcional)" value={form.alias||""} onChange={f("alias")}/>
          <p className="text-xs text-gray-400 mt-1">Solo para uso interno. No aparece en la factura ni se envía a ARCA. Útil cuando el cliente tiene un nombre comercial distinto al fiscal.</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">CUIT</label>
          <div className="flex gap-2 mt-1">
            <input value={form.cuit} onChange={f("cuit")} placeholder="30-12345678-9"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
            <button type="button" onClick={consultarPadron} disabled={padronLoading}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
              title="Autocompletar razón social, domicilio y condición IVA desde el padrón de ARCA">
              {padronLoading ? "⏳" : "🔍 ARCA"}
            </button>
          </div>
          {padronError && <p className="text-xs text-red-500 mt-1">{padronError}</p>}
        </div>
        <Field label="Teléfono" value={form.telefono} onChange={f("telefono")}/>
        <div className="col-span-2"><Field label="Domicilio" value={form.domicilio} onChange={f("domicilio")}/></div>
        <div>
          <label className="text-xs font-medium text-gray-600">Condición IVA</label>
          <select value={form.condicionIVA} onChange={f("condicionIVA")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            {["Responsable Inscripto","Monotributista","Exento","Consumidor Final"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Tipo Factura</label>
          <select value={form.tipoFactura} onChange={f("tipoFactura")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            <option>A</option><option>B</option>
          </select>
        </div>
        <div className="col-span-2"><Field label="Email principal" value={form.email} onChange={f("email")} type="email"/></div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600">Emails adicionales (opcional)</label>
          <input
            type="text"
            value={form.emailsAdicionales || ""}
            onChange={f("emailsAdicionales")}
            placeholder="contador@empresa.com, administracion@empresa.com"
            className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Separá con coma o punto y coma. Se enviarán las facturas a todos estos emails además del principal.</p>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))} id="cl-act"/>
          <label htmlFor="cl-act" className="text-sm text-gray-600">Cliente activo</label>
        </div>
      </div>
      <ModalFooter onClose={onClose} onSave={()=>onSave(form)}/>
    </Modal>
  );
}

function Contracts({contracts,setContracts,clients,invoices,currentUser,canEdit}){
  const [modal,setModal]=useState(null);
  const [filterClient,setFilterClient]=useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const isWebmaster = currentUser?.role === "webmaster";

  const empty={clientId:clients[0]?.id||"",descripcion:"",montoNeto:"",fechaInicio:todayStr(),fechaFin:"",duracionMeses:12,diaFacturacion:1,textoOpcional:"",diaVencimientoPago:0,active:true};
  const filtered=contracts.filter(ct=>!filterClient||ct.clientId===filterClient);
  const save=async(data)=>{
    const neto=parseFloat(data.montoNeto)||0;
    const iva=Math.round(neto*0.105*100)/100;
    const d={...data,montoNeto:neto,iva,total:Math.round((neto+iva)*100)/100};
    
    // Guardar en Supabase
    const payload = {
      cliente_id: d.clientId,
      descripcion: d.descripcion,
      monto: neto,
      iva: iva,
      fecha_inicio: d.fechaInicio,
      fecha_fin: d.fechaFin || null,
      duracion_meses: parseInt(d.duracionMeses),
      dia_facturacion: parseInt(d.diaFacturacion),
      texto_opcional: d.textoOpcional || "",
      dia_vencimiento_pago: parseInt(d.diaVencimientoPago) || 0,
      activo: d.active !== false,
    };
    
    // Verificar si es un UUID real de Supabase (36 chars con guiones) o un ID local
    const esUUID = d.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d.id);
    
    if(esUUID) {
      // Actualizar en Supabase
      const {error} = await supabase.from("contratos").update(payload).eq("id", d.id);
      if(error) console.error("Error actualizando contrato:", error);
      setContracts(prev=>prev.map(c=>c.id===d.id?d:c));
    } else {
      // Insertar en Supabase (contrato nuevo o con ID local)
      const {data:newCt, error} = await supabase.from("contratos").insert(payload).select().single();
      if(error) console.error("Error insertando contrato:", error);
      if(newCt) {
        // Reemplazar el contrato local con el de Supabase
        setContracts(prev=>prev.map(c=>c.id===d.id?{...d,id:newCt.id}:c).filter((c,i,arr)=>arr.findIndex(x=>x.id===c.id)===i));
        if(!d.id) setContracts(prev=>[...prev,{...d,id:newCt.id}]);
      }
    }
    setModal(null);
  };

  // Pedir confirmación de borrado, calculando facturas asociadas
  const askDelete = (ct, e) => {
    if (e) { e.stopPropagation(); }
    const facsAsociadas = (invoices || []).filter(inv => inv.contractId === ct.id);
    let advertencia = null;
    let blocked = false;
    if (facsAsociadas.length > 0) {
      blocked = true;
      advertencia = `Este contrato tiene ${facsAsociadas.length} factura(s) emitida(s). NO se puede borrar (queda registro fiscal). Solo se puede DESACTIVAR desde el lápiz de edición.`;
    }
    setConfirmDelete({ ct, blocked, advertencia });
  };

  const doDelete = async () => {
    if (!confirmDelete || confirmDelete.blocked) return;
    setDeleting(true);
    const { ct } = confirmDelete;
    const esUUID = ct.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ct.id);
    if (esUUID) {
      const { error } = await supabase.from("contratos").delete().eq("id", ct.id);
      if (error) {
        alert("Error al borrar en Supabase: " + error.message);
        setDeleting(false);
        return;
      }
    }
    setContracts(prev => prev.filter(c => c.id !== ct.id));
    setDeleting(false);
    setConfirmDelete(null);
  };

  return(
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select value={filterClient} onChange={e=>setFilterClient(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          <option value="">Todos los clientes</option>
          {clients.map(c=><option key={c.id} value={c.id}>{fmtClientName(c)}</option>)}
        </select>
        {canEdit&&<button onClick={()=>setModal(empty)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 ml-auto"><Icon d={Icons.plus} size={14}/>Nuevo contrato</button>}
      </div>
      <div className="space-y-3">
        {filtered.map(ct=>{
          const client=clients.find(c=>c.id===ct.clientId);
          const end=new Date(ct.fechaInicio);
          end.setMonth(end.getMonth()+Number(ct.duracionMeses));
          const diff=Math.round((end-new Date())/(1000*60*60*24));
          return(
            <div key={ct.id} onClick={()=>canEdit&&setModal(ct)} className={`bg-white rounded-xl border border-gray-200 p-4 ${canEdit?"cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all":""}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">{client?.razonSocial}</span>
                    {client?.alias && <span className="text-xs text-gray-400">— {client.alias}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${ct.active?"bg-green-50 text-green-700":"bg-gray-100 text-gray-400"}`}>{ct.active?"Activo":"Inactivo"}</span>
                    {diff<60&&diff>0&&<span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Vence en {diff}d</span>}
                    {diff<=0&&<span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Vencido</span>}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{ct.descripcion}</p>
                  <div className="flex gap-4 text-xs text-gray-400 flex-wrap">
                    <span>Inicio: {fmtDate(ct.fechaInicio)}</span>
                    <span>Vence: {fmtDate(end.toISOString().split("T")[0])}</span>
                    <span>{ct.duracionMeses} meses · Día {ct.diaFacturacion}</span>
                    {ct.textoOpcional&&<span className="text-blue-500">{ct.textoOpcional}</span>}
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-xs text-gray-400">Neto: {fmtMoney(ct.montoNeto)}</p>
                  <p className="text-xs text-orange-500">IVA: {fmtMoney(ct.iva)}</p>
                  <p className="font-bold text-sm text-blue-700">{fmtMoney(ct.total)}</p>
                  <div className="flex items-center gap-2 justify-end mt-1">
                    {canEdit&&<Icon d={Icons.edit} size={14} className="text-gray-300"/>}
                    {isWebmaster&&(
                      <button
                        onClick={(e)=>askDelete(ct, e)}
                        className="text-gray-300 hover:text-red-600"
                        title="Borrar contrato"
                      ><Icon d={Icons.trash} size={14}/></button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-gray-200">Sin contratos</div>}
      </div>
      {modal&&<ContractModal data={modal} clients={clients} onSave={save} onClose={()=>setModal(null)}/>}
      {confirmDelete && (
        <ConfirmDeleteModal
          titulo={confirmDelete.blocked ? "No se puede borrar" : "¿Borrar contrato?"}
          mensaje={
            confirmDelete.blocked
              ? "Este contrato tiene datos asociados que impiden el borrado."
              : `Vas a borrar definitivamente este contrato. Esta acción no se puede deshacer.`
          }
          advertencia={confirmDelete.advertencia}
          requireTyping={!confirmDelete.blocked}
          loading={deleting}
          onCancel={() => { if (!deleting) setConfirmDelete(null); }}
          onConfirm={confirmDelete.blocked ? () => setConfirmDelete(null) : doDelete}
        />
      )}
    </div>
  );
}

function ContractModal({data,clients,onSave,onClose}){
  // Inicializar fechaFin si no viene seteada (calculada desde fechaInicio + duracionMeses)
  const initialForm = (() => {
    const f = { ...data };
    if (!f.fechaFin && f.fechaInicio && f.duracionMeses) {
      f.fechaFin = sumarMeses(f.fechaInicio, parseInt(f.duracionMeses) || 12);
    }
    return f;
  })();
  const [form,setForm]=useState(initialForm);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));

  // Cuando cambia la fecha de inicio: recalcular fecha fin manteniendo la duración actual
  const onFechaInicioChange = (e) => {
    const nv = e.target.value;
    setForm(p => {
      const meses = parseInt(p.duracionMeses) || 12;
      return { ...p, fechaInicio: nv, fechaFin: sumarMeses(nv, meses) };
    });
  };
  // Cuando cambia la duración: recalcular fecha fin manteniendo el inicio
  const onDuracionChange = (e) => {
    const meses = parseInt(e.target.value) || 0;
    setForm(p => ({ ...p, duracionMeses: meses, fechaFin: meses > 0 ? sumarMeses(p.fechaInicio, meses) : p.fechaFin }));
  };
  // Cuando cambia la fecha fin: recalcular duración manteniendo el inicio
  const onFechaFinChange = (e) => {
    const nv = e.target.value;
    setForm(p => ({ ...p, fechaFin: nv, duracionMeses: calcularMesesEntre(p.fechaInicio, nv) }));
  };

  const neto=parseFloat(form.montoNeto)||0;
  const iva=Math.round(neto*0.105*100)/100;
  return(
    <Modal title={form.id?"Editar contrato":"Nuevo contrato"} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600">Cliente</label>
          <select value={form.clientId} onChange={f("clientId")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            {clients.map(c=><option key={c.id} value={c.id}>{fmtClientName(c)}</option>)}
          </select>
        </div>
        <div className="col-span-2"><Field label="Descripción del servicio" value={form.descripcion} onChange={f("descripcion")}/></div>
        <Field label="Monto neto mensual ($)" value={form.montoNeto} onChange={f("montoNeto")} type="number"/>
        <div>
          <label className="text-xs font-medium text-gray-600">IVA 10.5% (auto)</label>
          <input readOnly value={fmtMoney(iva)} className="w-full mt-1 px-3 py-2 border border-gray-100 bg-gray-50 rounded-lg text-sm text-gray-500"/>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600">Total mensual</label>
          <input readOnly value={fmtMoney(neto+iva)} className="w-full mt-1 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-sm font-bold text-blue-700"/>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Fecha inicio</label>
          <input type="date" value={form.fechaInicio||""} onChange={onFechaInicioChange} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Fecha fin</label>
          <input type="date" value={form.fechaFin||""} onChange={onFechaFinChange} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600">Duración (meses)</label>
          <input type="number" min="1" value={form.duracionMeses||""} onChange={onDuracionChange} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          <p className="text-xs text-gray-400 mt-1">Inicio, Fin y Duración están sincronizados: si cambiás uno, los otros se ajustan automáticamente.</p>
        </div>
        <Field label="Día de facturación" value={form.diaFacturacion} onChange={f("diaFacturacion")} type="number"/>
        <Field label="Texto opcional (OC, expediente...)" value={form.textoOpcional} onChange={f("textoOpcional")}/>
        <div>
          <label className="text-xs font-medium text-gray-600">Días de vto. de pago</label>
          <input type="number" value={form.diaVencimientoPago||0} onChange={f("diaVencimientoPago")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          <p className="text-xs text-gray-400 mt-1">Días desde el fin del servicio. 0 = mismo día (al vto). Ej: 10 = vence 10 días después.</p>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))} id="ct-act"/>
          <label htmlFor="ct-act" className="text-sm text-gray-600">Contrato activo</label>
        </div>
      </div>
      <ModalFooter onClose={onClose} onSave={()=>onSave(form)}/>
    </Modal>
  );
}

// FIX 2: agregado guardarFacturaSupabase a la firma del componente Billing
// ── SINCRONIZACIÓN AUTOMÁTICA CON ARCA ─────────────────────────────────────
// Consulta el último número autorizado por ARCA en un PV+Tipo y compara con
// lo que tenemos guardado. Trae los faltantes uno por uno.
function SyncArcaModal({ clients, invoices, onClose, onImportar }) {
  const [puntoVenta, setPuntoVenta] = useState(1);
  const [tipoFactura, setTipoFactura] = useState("A");
  const [fechaDesde, setFechaDesde] = useState("");  // opcional, vacío = sin filtro
  const [estado, setEstado] = useState("idle"); // idle | consultando | listo | preview | importando | done
  const [info, setInfo] = useState(null); // { ultimoArca, ultimoLocal, faltantes: [] }
  const [error, setError] = useState("");
  const [trayendo, setTrayendo] = useState(null);
  const [importadas, setImportadas] = useState([]);
  const [previewDatos, setPreviewDatos] = useState([]);  // datos pre-cargados de cada faltante
  const [cargandoPreview, setCargandoPreview] = useState(false);
  const [seleccionados, setSeleccionados] = useState(new Set());  // qué importar

  // Mapeo tipo factura A/B/C -> código ARCA 1/6/11
  const tipoCmpCode = (t) => t === "A" ? 1 : (t === "B" ? 6 : 11);

  const consultarFaltantes = async () => {
    setEstado("consultando");
    setError("");
    setInfo(null);
    try {
      // Último número en ARCA
      const res = await fetch(`${BACKEND_URL}/arca-ultimo-numero`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ punto_venta: puntoVenta, tipo_factura: tipoCmpCode(tipoFactura) }),
      });
      const data = await res.json();
      if (!data.exito) {
        setError(data.error || "Error consultando ARCA");
        setEstado("idle");
        return;
      }
      const ultimoArca = data.ultimo_numero;

      // IMPORTANTE: consideramos TODAS las facturas guardadas, incluso las anuladas.
      // En ARCA, una factura anulada con NC sigue ocupando su número en la secuencia.
      // Si vos tenés guardada A-3-7 (aunque esté anulada con NC), no es "faltante".
      const localPVTipo = invoices.filter(i =>
        i.puntoVenta === puntoVenta &&
        i.tipoFactura === tipoFactura
      );
      const numerosLocales = new Set(localPVTipo.map(i => parseInt((i.numero || "").split("-")[2]) || 0));
      const ultimoLocal = numerosLocales.size > 0 ? Math.max(...numerosLocales) : 0;

      // Calcular faltantes (todos los números entre 1 y ultimoArca que NO están en local)
      const faltantes = [];
      for (let n = 1; n <= ultimoArca; n++) {
        if (!numerosLocales.has(n)) faltantes.push(n);
      }

      setInfo({ ultimoArca, ultimoLocal, faltantes });
      setEstado("listo");
    } catch (e) {
      setError("Error de conexión: " + e.message);
      setEstado("idle");
    }
  };

  // Trae los datos de cada faltante para que el usuario pueda revisar antes de importar
  const cargarPreview = async () => {
    if (!info || info.faltantes.length === 0) return;
    setCargandoPreview(true);
    setEstado("preview");
    const datos = [];
    for (const num of info.faltantes) {
      try {
        const res = await fetch(`${BACKEND_URL}/arca-traer-factura`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            punto_venta: puntoVenta,
            tipo_factura: tipoCmpCode(tipoFactura),
            numero: num,
          }),
        });
        const data = await res.json();
        if (data.exito) {
          // Buscar cliente por CUIT
          const cuitArca = String(data.datos.cuit_cliente);
          const cliente = clients.find(c => (c.cuit || "").replace(/-/g, "") === cuitArca);
          datos.push({
            numero: num,
            datos: data.datos,
            cliente,
            seleccionado: false, // por defecto NADA seleccionado, vos decidís qué importar
          });
        } else {
          datos.push({ numero: num, error: data.error, seleccionado: false });
        }
      } catch (e) {
        datos.push({ numero: num, error: e.message, seleccionado: false });
      }
      setPreviewDatos([...datos]);  // actualizar progresivamente
      await new Promise(r => setTimeout(r, 150));
    }
    setCargandoPreview(false);
    // Filtrar por rango de fecha si se especificó
    if (fechaDesde) {
      const fechaDesdeArca = fechaDesde.replace(/-/g, "");
      const filtrados = datos.filter(d => !d.error && d.datos.fecha >= fechaDesdeArca);
      setSeleccionados(new Set(filtrados.map(d => d.numero)));
    }
  };

  const toggleSeleccion = (num) => {
    setSeleccionados(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(num)) nuevo.delete(num);
      else nuevo.add(num);
      return nuevo;
    });
  };

  const seleccionarTodo = () => {
    setSeleccionados(new Set(previewDatos.filter(d => !d.error).map(d => d.numero)));
  };
  const deseleccionarTodo = () => setSeleccionados(new Set());

  const importarSeleccionadas = async () => {
    if (seleccionados.size === 0) return;
    setEstado("importando");
    setImportadas([]);
    const importadasOk = [];
    for (const item of previewDatos) {
      if (!seleccionados.has(item.numero) || item.error) continue;
      setTrayendo(item.numero);
      try {
        const cuitArca = String(item.datos.cuit_cliente);
        const cuitConGuiones = cuitArca.length === 11
          ? `${cuitArca.slice(0,2)}-${cuitArca.slice(2,10)}-${cuitArca.slice(10)}`
          : cuitArca;

        const numFmt = String(item.numero).padStart(8, "0");
        const numeroCompleto = `${tipoFactura}-${String(puntoVenta).padStart(4, "0")}-${numFmt}`;
        const fecha = item.datos.fecha;
        const mes = parseInt(fecha.slice(4, 6));
        const anio = parseInt(fecha.slice(0, 4));

        const inv = {
          id: `inv-sync-${Date.now()}-${item.numero}`,
          contractId: null,
          clientId: item.cliente?.id || null,
          clientName: item.cliente?.razonSocial || `(CUIT ${cuitConGuiones})`,
          clientEmail: item.cliente?.email || "",
          clientCuit: item.cliente?.cuit || cuitConGuiones,
          tipoFactura,
          numero: numeroCompleto,
          puntoVenta,
          month: mes,
          year: anio,
          periodo: item.datos.fch_serv_desde && item.datos.fch_serv_hasta
            ? `${item.datos.fch_serv_desde.slice(6,8)}/${item.datos.fch_serv_desde.slice(4,6)}/${item.datos.fch_serv_desde.slice(0,4)} al ${item.datos.fch_serv_hasta.slice(6,8)}/${item.datos.fch_serv_hasta.slice(4,6)}/${item.datos.fch_serv_hasta.slice(0,4)}`
            : `${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][mes-1]} ${anio}`,
          detalle: "Importado desde ARCA Web",
          neto: item.datos.importe_neto,
          iva: item.datos.importe_iva,
          total: item.datos.importe_total,
          estado: "Emitida",
          cae: item.datos.cae,
          cae_vencimiento: item.datos.cae_vencimiento || "",
          fecha,
          fechaPago: "",
          emailEnviado: false,
          origen: "sync_arca",
          fch_serv_desde: item.datos.fch_serv_desde || "",
          fch_serv_hasta: item.datos.fch_serv_hasta || "",
          fch_vto_pago: item.datos.fch_vto_pago || "",
          emitida: new Date().toISOString(),
        };
        const ok = await onImportar(inv);
        importadasOk.push({ num: item.numero, cliente: inv.clientName, total: inv.total, ok });
      } catch (e) {
        importadasOk.push({ num: item.numero, ok: false, error: e.message });
      }
      setImportadas([...importadasOk]);
      await new Promise(r => setTimeout(r, 200));
    }
    setTrayendo(null);
    setEstado("done");
  };

  const fmtFechaArca = (f) => f && f.length === 8 ? `${f.slice(6,8)}/${f.slice(4,6)}/${f.slice(0,4)}` : "—";

  return (
    <Modal title="Sincronizar facturas con ARCA" onClose={estado === "importando" || cargandoPreview ? () => {} : onClose} wide>
      <div className="space-y-3">
        <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
          ℹ️ Consulta a ARCA y trae las facturas emitidas que aún no están en RadioFact. <strong>Vas a poder revisar cada factura antes de importarla.</strong>
        </div>

        {(estado === "idle" || estado === "consultando") && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Punto de venta</label>
                <select value={puntoVenta} onChange={e=>setPuntoVenta(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                  <option value="1">0001</option>
                  <option value="2">0002</option>
                  <option value="3">0003 (RadioFact)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Tipo factura</label>
                <select value={tipoFactura} onChange={e=>setTipoFactura(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                  <option value="A">A (cód. 01)</option>
                  <option value="B">B (cód. 06)</option>
                  <option value="C">C (cód. 11)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Desde fecha (opcional)</label>
                <input type="date" value={fechaDesde} onChange={e=>setFechaDesde(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
              </div>
            </div>
            <p className="text-xs text-gray-500">Si poné fecha "desde", al cargar el preview pre-selecciona solo facturas posteriores a esa fecha.</p>
            <button
              onClick={consultarFaltantes}
              disabled={estado === "consultando"}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {estado === "consultando" ? "⏳ Consultando ARCA..." : "🔍 Consultar últimos comprobantes"}
            </button>
          </>
        )}

        {estado === "listo" && info && (
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
              <p>📊 <strong>Último número en ARCA</strong> (PV {puntoVenta}, tipo {tipoFactura}): <span className="font-mono font-bold">{info.ultimoArca}</span></p>
              <p>💾 <strong>Último guardado en RadioFact</strong>: <span className="font-mono font-bold">{info.ultimoLocal}</span></p>
              <p className={info.faltantes.length > 0 ? "text-amber-700 font-semibold" : "text-green-700 font-semibold"}>
                {info.faltantes.length > 0
                  ? `⚠️ Faltan ${info.faltantes.length} comprobante(s) en RadioFact: ${info.faltantes.slice(0, 10).join(", ")}${info.faltantes.length > 10 ? "..." : ""}`
                  : "✅ Todo sincronizado"}
              </p>
            </div>
            {info.faltantes.length > 0 && (
              <button
                onClick={cargarPreview}
                className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"
              >
                👁️ Ver preview detallado de los {info.faltantes.length} comprobante(s)
              </button>
            )}
            <button
              onClick={() => { setEstado("idle"); setInfo(null); setPreviewDatos([]); setSeleccionados(new Set()); }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
            >
              Volver
            </button>
          </div>
        )}

        {estado === "preview" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold">
                {cargandoPreview ? `⏳ Cargando preview... (${previewDatos.length}/${info.faltantes.length})` : `✅ Revisá y elegí qué importar (${seleccionados.size} seleccionada/s de ${previewDatos.filter(d=>!d.error).length})`}
              </span>
              {!cargandoPreview && (
                <div className="flex gap-2">
                  <button onClick={seleccionarTodo} className="text-blue-600 hover:underline">Seleccionar todo</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={deseleccionarTodo} className="text-gray-600 hover:underline">Ninguna</button>
                </div>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-2 py-1.5 text-left">✓</th>
                    <th className="px-2 py-1.5 text-left">Nº</th>
                    <th className="px-2 py-1.5 text-left">Fecha</th>
                    <th className="px-2 py-1.5 text-left">Cliente</th>
                    <th className="px-2 py-1.5 text-right">Total</th>
                    <th className="px-2 py-1.5 text-left">CAE</th>
                  </tr>
                </thead>
                <tbody>
                  {previewDatos.map(item => (
                    <tr key={item.numero} className={`border-b border-gray-100 ${item.error ? "bg-red-50" : seleccionados.has(item.numero) ? "bg-blue-50" : ""}`}>
                      <td className="px-2 py-1.5">
                        {item.error ? (
                          <span className="text-red-500">❌</span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={seleccionados.has(item.numero)}
                            onChange={() => toggleSeleccion(item.numero)}
                          />
                        )}
                      </td>
                      <td className="px-2 py-1.5 font-mono">{item.numero}</td>
                      <td className="px-2 py-1.5">
                        {item.error ? "—" : fmtFechaArca(item.datos.fecha)}
                      </td>
                      <td className="px-2 py-1.5">
                        {item.error ? (
                          <span className="text-red-600 text-[10px]">{item.error}</span>
                        ) : item.cliente ? (
                          item.cliente.razonSocial
                        ) : (
                          <span className="text-amber-600">CUIT no registrado</span>
                        )}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium">{!item.error ? fmtMoney(item.datos.importe_total) : "—"}</td>
                      <td className="px-2 py-1.5 font-mono text-[10px]">{!item.error ? (item.datos.cae || "").slice(0, 12) + "..." : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setEstado("listo"); setPreviewDatos([]); setSeleccionados(new Set()); }}
                disabled={cargandoPreview}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Volver
              </button>
              <button
                onClick={importarSeleccionadas}
                disabled={cargandoPreview || seleccionados.size === 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                📥 Importar {seleccionados.size} seleccionada(s)
              </button>
            </div>
          </div>
        )}

        {estado === "importando" && (
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
              <p>⏳ Importando comprobantes... {trayendo && <strong>(trayendo Nº {trayendo})</strong>}</p>
              <p className="text-gray-500 mt-1">Procesados: {importadas.length} de {seleccionados.size}</p>
            </div>
          </div>
        )}

        {estado === "done" && (
          <div className="space-y-2">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs">
              <p className="font-bold text-green-700">✅ Sincronización completa</p>
              <p>Importadas con éxito: {importadas.filter(i=>i.ok).length}</p>
              {importadas.filter(i=>!i.ok).length > 0 && (
                <p className="text-red-700">Errores: {importadas.filter(i=>!i.ok).length}</p>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 text-xs">
              {importadas.map((r, i) => (
                <div key={i} className={`flex justify-between py-1 border-b border-gray-100 ${r.ok ? "" : "text-red-600"}`}>
                  <span className="font-mono">N°{r.num}</span>
                  {r.ok ? (
                    <>
                      <span>{r.cliente}</span>
                      <span className="font-bold">{fmtMoney(r.total)}</span>
                    </>
                  ) : (
                    <span>❌ {r.error}</span>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Cerrar
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      </div>
    </Modal>
  );
}

// ── CARGA MANUAL DE FACTURA EXTERNA (emitida en ARCA Web) ─────────────────
// Para facturas que se emiten directamente en arca.gob.ar (PV 1, 2, etc.)
// y necesitamos sumarlas a los totales de RadioFact sin re-emitir.
function FacturaManualModal({ clients, onClose, onSave }) {
  const hoy = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    clientId: "",
    puntoVenta: 1,
    numero: "",
    tipoFactura: "A",
    fecha: hoy,
    fch_serv_desde: "",
    fch_serv_hasta: "",
    fch_vto_pago: "",
    descripcion: "",
    neto: "",
    iva: "",
    cae: "",
    cae_vencimiento: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const neto = parseFloat(form.neto) || 0;
  const iva = parseFloat(form.iva) || 0;
  const total = neto + iva;
  // IVA sugerido = 10.5% del neto
  const ivaSugerido = Math.round(neto * 0.105 * 100) / 100;

  const handleSave = async () => {
    if (!form.clientId) { setError("Elegí el cliente"); return; }
    if (!form.numero) { setError("Falta el número de factura"); return; }
    if (!form.cae) { setError("Falta el CAE"); return; }
    if (!form.fecha) { setError("Falta la fecha de emisión"); return; }
    if (neto <= 0) { setError("El neto debe ser mayor a 0"); return; }

    const cliente = clients.find(c => c.id === form.clientId);
    if (!cliente) { setError("Cliente no encontrado"); return; }

    setSaving(true);
    setError("");
    try {
      const numFmt = String(form.numero).padStart(8, "0");
      const numeroCompleto = `${form.tipoFactura}-${String(form.puntoVenta).padStart(4, "0")}-${numFmt}`;
      const fechaArca = form.fecha.replace(/-/g, "");
      const mes = parseInt(form.fecha.slice(5, 7));
      const anio = parseInt(form.fecha.slice(0, 4));

      // Construir periodo legible para el listado
      let periodoTexto;
      if (form.fch_serv_desde && form.fch_serv_hasta) {
        const f1 = form.fch_serv_desde.split("-").reverse().join("/");
        const f2 = form.fch_serv_hasta.split("-").reverse().join("/");
        periodoTexto = `${f1} al ${f2}`;
      } else {
        periodoTexto = `${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"][mes-1]} ${anio}`;
      }

      const inv = {
        id: `inv-manual-${Date.now()}`,
        contractId: null,
        clientId: form.clientId,
        clientName: cliente.razonSocial,
        clientEmail: cliente.email,
        clientCuit: cliente.cuit,
        tipoFactura: form.tipoFactura,
        numero: numeroCompleto,
        puntoVenta: parseInt(form.puntoVenta),
        month: mes,
        year: anio,
        periodo: periodoTexto,
        detalle: form.descripcion || "Factura emitida manualmente desde ARCA Web",
        neto,
        iva,
        total,
        estado: "Emitida",
        cae: form.cae,
        cae_vencimiento: form.cae_vencimiento ? form.cae_vencimiento.replace(/-/g, "") : "",
        fecha: fechaArca,
        fechaPago: "",
        emailEnviado: false,
        origen: "manual_arca",
        fch_serv_desde: form.fch_serv_desde ? form.fch_serv_desde.replace(/-/g, "") : "",
        fch_serv_hasta: form.fch_serv_hasta ? form.fch_serv_hasta.replace(/-/g, "") : "",
        fch_vto_pago: form.fch_vto_pago ? form.fch_vto_pago.replace(/-/g, "") : "",
        emitida: new Date().toISOString(),
      };

      const ok = await onSave(inv);
      if (ok) onClose();
      else setError("Error al guardar. Revisá la consola.");
    } catch (e) {
      setError("Error: " + e.message);
    }
    setSaving(false);
  };

  return (
    <Modal title="Cargar factura manual (ARCA Web)" onClose={onClose} wide>
      <div className="space-y-3">
        <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
          ℹ️ Usá esto para sumar a los totales una factura que ya emitiste en arca.gob.ar (no se vuelve a enviar a ARCA).
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600">Cliente *</label>
            <select value={form.clientId} onChange={f("clientId")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
              <option value="">— elegir cliente —</option>
              {clients.filter(c => c.active).map(c => (
                <option key={c.id} value={c.id}>{c.razonSocial}{c.alias ? ` (${c.alias})` : ""}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Tipo factura *</label>
            <select value={form.tipoFactura} onChange={f("tipoFactura")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Punto de venta *</label>
            <select value={form.puntoVenta} onChange={f("puntoVenta")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
              <option value="1">0001</option>
              <option value="2">0002</option>
              <option value="3">0003 (RadioFact)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Número *</label>
            <input type="number" value={form.numero} onChange={f("numero")} placeholder="ej: 25" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Fecha emisión *</label>
            <input type="date" value={form.fecha} onChange={f("fecha")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          </div>

          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600">Descripción / detalle</label>
            <input type="text" value={form.descripcion} onChange={f("descripcion")} placeholder="Servicios de publicidad..." className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Servicio desde</label>
            <input type="date" value={form.fch_serv_desde} onChange={f("fch_serv_desde")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Servicio hasta</label>
            <input type="date" value={form.fch_serv_hasta} onChange={f("fch_serv_hasta")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Vto. de pago</label>
            <input type="date" value={form.fch_vto_pago} onChange={f("fch_vto_pago")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Neto *</label>
            <input type="number" step="0.01" value={form.neto} onChange={f("neto")} placeholder="0.00" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              IVA <button type="button" onClick={() => setForm(p => ({ ...p, iva: ivaSugerido }))} className="text-blue-600 hover:underline ml-1 text-xs">(usar 10.5%)</button>
            </label>
            <input type="number" step="0.01" value={form.iva} onChange={f("iva")} placeholder="0.00" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          </div>

          <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
            <p className="text-xs text-gray-600">Total calculado:</p>
            <p className="font-bold text-blue-700 text-base">{fmtMoney(total)}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">CAE *</label>
            <input type="text" value={form.cae} onChange={f("cae")} placeholder="86184011..." className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none font-mono"/>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Vto. CAE</label>
            <input type="date" value={form.cae_vencimiento} onChange={f("cae_vencimiento")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"/>
          </div>
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} disabled={saving} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50">Cancelar</button>
        <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Guardando..." : "Guardar factura"}
        </button>
      </div>
    </Modal>
  );
}

function Billing({clients,contracts,setContracts,invoices,setInvoices,notifications,setNotifications,config,canEdit,descargarPDF,guardarFacturaSupabase,emitirNotaCredito,registrarEmailEnHistorial,marcarEmailEnviadoSupabase,actualizarEmailsCliente}){
  const today=new Date();
  const [selMonth,setSelMonth]=useState(today.getMonth()+1);
  const [selYear,setSelYear]=useState(today.getFullYear());
  const [reviewModal,setReviewModal]=useState(null);
  const [emailModal,setEmailModal]=useState(null);
  const [ncModal,setNcModal]=useState(null);
  const [manualModal,setManualModal]=useState(false);
  const [syncModal,setSyncModal]=useState(false);
  const [editContractModal,setEditContractModal]=useState(null);

  // Guardar cambios en contrato (replica la lógica de Contracts.save)
  const saveContractFromBilling = async (d) => {
    const monto = parseFloat(d.montoNeto) || 0;
    const iva = Math.round(monto * 0.105 * 100) / 100;
    const payload = {
      cliente_id: d.clientId,
      descripcion: d.descripcion,
      monto: monto,
      iva: iva,
      fecha_inicio: d.fechaInicio,
      fecha_fin: d.fechaFin || null,
      duracion_meses: parseInt(d.duracionMeses),
      dia_facturacion: parseInt(d.diaFacturacion),
      texto_opcional: d.textoOpcional || "",
      dia_vencimiento_pago: parseInt(d.diaVencimientoPago) || 0,
      activo: d.active !== false,
    };
    const datoCompleto = { ...d, montoNeto: monto, iva, total: monto + iva };
    const esUUID = d.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d.id);
    if(esUUID) {
      const {error} = await supabase.from("contratos").update(payload).eq("id", d.id);
      if(error) console.error("Error actualizando contrato:", error);
      setContracts(prev=>prev.map(c=>c.id===d.id?datoCompleto:c));
    }
    setEditContractModal(null);
  };

  // Toggle rápido activar/desactivar contrato
  const toggleActiveContract = async (ct) => {
    const nuevo = { ...ct, active: !ct.active };
    const esUUID = ct.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ct.id);
    if(esUUID) {
      const {error} = await supabase.from("contratos").update({ activo: nuevo.active }).eq("id", ct.id);
      if(error) {
        alert("Error al cambiar estado del contrato: " + error.message);
        return;
      }
    }
    setContracts(prev => prev.map(c => c.id === ct.id ? nuevo : c));
  };
  const [filtroCliente,setFiltroCliente]=useState("");
  const [filtroEstado,setFiltroEstado]=useState("");
  const [ocultarAnuladas,setOcultarAnuladas]=useState(true);
  const [filtroEmail,setFiltroEmail]=useState("");
  const [filtroBusqueda,setFiltroBusqueda]=useState("");
  const billMonth=selMonth;
  const billYear=selYear;
  const pendingContracts=contracts.filter(ct=>{
    if(!ct.active) return false;
    // Ignorar facturas anuladas — el contrato vuelve a contar como "sin facturar"
    return !invoices.find(inv=>
      inv.contractId===ct.id &&
      inv.month===billMonth &&
      inv.year===billYear &&
      inv.estado !== "Anulada"
    );
  });
  const monthInvoicesBase=invoices.filter(i=>i.month===billMonth&&i.year===billYear);
  const monthInvoices=monthInvoicesBase.filter(i=>{
    if(ocultarAnuladas && i.estado === "Anulada") return false;
    if(filtroCliente && i.clientId!==filtroCliente) return false;
    if(filtroEstado && i.estado!==filtroEstado) return false;
    if(filtroEmail==="enviado" && !i.emailEnviado) return false;
    if(filtroEmail==="no_enviado" && i.emailEnviado) return false;
    if(filtroBusqueda && !i.numero?.toLowerCase().includes(filtroBusqueda.toLowerCase()) && !i.clientName?.toLowerCase().includes(filtroBusqueda.toLowerCase())) return false;
    return true;
  });
  // Totales del mes EXCLUYENDO facturas anuladas con NC
  const totalesMes = totalizarFacturas(monthInvoices);
  const totNeto = totalesMes.neto;
  const totIva = totalesMes.iva;
  const totTotal = totalesMes.total;
  const totIibb = totalesMes.iibb;

  // ── DESCARGAR REPORTE MENSUAL EN CSV ─────────────────────────────────────
  const descargarReporteCSV = () => {
    if (monthInvoices.length === 0) {
      alert("No hay facturas en el filtro actual para exportar.");
      return;
    }
    // Función auxiliar: escapa un valor para CSV (comillas dobles, comas, saltos de línea)
    const csvEscape = (val) => {
      if (val === null || val === undefined) return "";
      const s = String(val);
      if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    const headers = [
      "N° Factura", "Fecha", "Período", "Cliente", "Alias", "CUIT",
      "Concepto / Detalle", "Neto", "IVA 10.5%", "Total",
      "Estado", "CAE", "Vto. CAE", "Fecha Pago",
    ];
    const rows = monthInvoices.map(inv => {
      const cli = clients.find(c => c.id === inv.clientId);
      // Convertir fecha YYYYMMDD → DD/MM/YYYY
      let fechaFmt = "";
      if (inv.fecha && inv.fecha.length === 8) {
        fechaFmt = `${inv.fecha.slice(6,8)}/${inv.fecha.slice(4,6)}/${inv.fecha.slice(0,4)}`;
      }
      let vtoFmt = "";
      if (inv.cae_vencimiento && inv.cae_vencimiento.length === 8) {
        vtoFmt = `${inv.cae_vencimiento.slice(6,8)}/${inv.cae_vencimiento.slice(4,6)}/${inv.cae_vencimiento.slice(0,4)}`;
      }
      return [
        inv.numero || "",
        fechaFmt,
        inv.periodo || "",
        inv.clientName || "",
        cli?.alias || "",
        cli?.cuit || inv.clientCuit || "",
        inv.detalle || "",
        inv.neto?.toFixed(2) || "0",
        inv.iva?.toFixed(2) || "0",
        inv.total?.toFixed(2) || "0",
        inv.estado || "",
        inv.cae || "",
        vtoFmt,
        inv.fechaPago || "",
      ];
    });
    // Filas de totales al final
    const totalRow = [
      "TOTALES (excluye anuladas)", "", "", `${totalesMes.cantidad} factura(s)`, "", "", "",
      totNeto.toFixed(2), totIva.toFixed(2), totTotal.toFixed(2),
      "", "", "", "",
    ];
    const iibbRow = [
      "IIBB 3% sobre neto", "", "", "(informativo, no fiscal)", "", "", "",
      totIibb.toFixed(2), "", "",
      "", "", "", "",
    ];
    // Armado del CSV con BOM para que Excel respete los acentos
    const BOM = "\uFEFF";
    const csv = BOM + [headers, ...rows, [], totalRow, iibbRow]
      .map(row => row.map(csvEscape).join(","))
      .join("\r\n");
    // Descargar
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const nombreMes = MONTHS[billMonth - 1] || "mes";
    link.href = url;
    link.download = `facturas-${nombreMes}-${billYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const buildInvoice=(ct,extraText="",fechasArca=null)=>{
    const client=clients.find(c=>c.id===ct.clientId);
    const num=String(invoices.length+1).padStart(8,"0");
    // El "periodo" se guarda como rango de fechas (formato legible, para listados/filtros)
    let periodoTexto;
    if (fechasArca && fechasArca.fch_serv_desde && fechasArca.fch_serv_hasta) {
      const f1 = `${fechasArca.fch_serv_desde.slice(6,8)}/${fechasArca.fch_serv_desde.slice(4,6)}/${fechasArca.fch_serv_desde.slice(0,4)}`;
      const f2 = `${fechasArca.fch_serv_hasta.slice(6,8)}/${fechasArca.fch_serv_hasta.slice(4,6)}/${fechasArca.fch_serv_hasta.slice(0,4)}`;
      periodoTexto = `${f1} al ${f2}`;
    } else {
      periodoTexto = `${MONTHS[billMonth-1]} ${billYear}`;
    }
    // El DETALLE no lleva fechas: solo descripción + texto opcional + texto extra del Review.
    // Las fechas van en su línea aparte del PDF (Período Facturado Desde/Hasta).
    const partes = [ct.descripcion];
    if (ct.textoOpcional) partes.push(ct.textoOpcional);
    if (extraText) partes.push(extraText);
    const detail = partes.filter(Boolean).join(" — ");
    return{
      id:`inv-${Date.now()}-${Math.random()}`,
      contractId:ct.id,clientId:ct.clientId,
      clientName:client?.razonSocial,
      clientEmail:client?.email,
      tipoFactura:client?.tipoFactura,
      numero:`${client?.tipoFactura}-0001-${num}`,
      month:billMonth,year:billYear,
      periodo:periodoTexto,
      detalle:detail,
      neto:ct.montoNeto,iva:ct.iva,total:ct.total,
      estado:"Emitida",cae:"",fechaPago:"",emailEnviado:false,
      emitida:new Date().toISOString(),
      // Guardar las fechas de servicio para que puedan usarse al regenerar PDF
      fch_serv_desde: fechasArca?.fch_serv_desde || "",
      fch_serv_hasta: fechasArca?.fch_serv_hasta || "",
      fch_vto_pago:   fechasArca?.fch_vto_pago   || "",
    };
  };
  const approveAndEmit = async (contractIds, texts = {}, fechasArca = {}, keepOpen = false) => {
    const results = [];
    for (const ctId of contractIds) {
      const ct = contracts.find(c => c.id === ctId);
      const client = clients.find(c => c.id === ct.clientId);
      const cuitLimpio = client.cuit.replace(/-/g, "");
      const tipoFactura = client.tipoFactura === "A" ? 1 : 6;

      // Fechas calculadas/editadas en el ReviewModal (formato YYYYMMDD)
      const fch = fechasArca[ctId] || {};

      // Registrar la operación ANTES de llamar a ARCA (auditoría + UUID por intento)
      const requestPayload = {
        cuit_cliente: parseInt(cuitLimpio),
        tipo_doc: 80,
        tipo_factura: tipoFactura,
        punto_venta: 3,
        monto_neto: ct.montoNeto,
        monto_iva: ct.iva,
        monto_total: ct.total,
        concepto: 2,
        mes: billMonth,
        anio: billYear,
        // Fechas explícitas del servicio (si vinieron del ReviewModal):
        fch_serv_desde: fch.fch_serv_desde || undefined,
        fch_serv_hasta: fch.fch_serv_hasta || undefined,
        fch_vto_pago:   fch.fch_vto_pago   || undefined,
        cliente: client.razonSocial,
        contrato_id: ct.id,
      };
      const opReg = await registrarOperacionArca("factura_masiva", requestPayload);

      try {
        let data;
        if(DEBUG_MODE) {
          const fakeNum = Math.floor(Math.random()*900)+100;
          data = { exito: true, datos: { cae: `DEBUG${Date.now()}`, cae_vencimiento: "20260430", numero: fakeNum, fecha: todayStr().replace(/-/g,"") }};
          console.log("🔧 DEBUG MODE: Factura simulada, no se envió a ARCA");
        } else {
          const res = await fetch(`${BACKEND_URL}/facturar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestPayload),
          });
          data = await res.json();
        }
        await completarOperacionArca(opReg.id, data, !!data.exito);
        const inv = buildInvoice(ct, texts[ctId] || "", fch);
        if (data.exito) {
          inv.cae = data.datos.cae;
          inv.cae_vencimiento = data.datos.cae_vencimiento;
          inv.numero = `${client.tipoFactura}-0003-${String(data.datos.numero).padStart(8,"0")}`;
          inv.estado = "Emitida";
          inv.fecha = data.datos.fecha;
          inv.clientCuit = client.cuit;
          await guardarFacturaSupabase(inv, ct.clientId).then(uuid => {
            if (uuid) inv.id = uuid;
          });
        } else {
          inv.estado = "Borrador";
          inv.error = data.error;
          alert(`⚠️ Error en factura de ${client.razonSocial}: ${data.error}`);
        }
        results.push(inv);
      } catch (e) {
        await completarOperacionArca(opReg.id, { error: e.message }, false);
        const inv = buildInvoice(ct, texts[ctId] || "", fch);
        inv.estado = "Borrador";
        results.push(inv);
        alert(`❌ Error de conexión para ${client?.razonSocial}`);
      }
    }
    setInvoices(prev => [...prev, ...results]);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (!keepOpen) setReviewModal(null);
    return results;
  };

  // Emitir UNA factura individual desde el preview del ReviewModal.
  // Devuelve true si la emisión fue exitosa (CAE obtenido), false si falló.
  const emitirFacturaIndividual = async (ct, textoOpcional, fechasArca) => {
    const texts = { [ct.id]: textoOpcional };
    const fechasObj = { [ct.id]: fechasArca };
    const results = await approveAndEmit([ct.id], texts, fechasObj, true);  // true = keepOpen
    return results && results.length > 0 && results[0].estado === "Emitida";
  };

  const updateInvoice=(id,data)=>setInvoices(prev=>prev.map(i=>i.id===id?{...i,...data}:i));

  return(
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select value={selMonth} onChange={e=>setSelMonth(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
        </select>
        <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          {[2024,2025,2026].map(y=><option key={y}>{y}</option>)}
        </select>
        <span className="text-xs text-gray-500">Período: <strong>{MONTHS[billMonth-1]} {billYear}</strong></span>
        <div className="ml-auto flex gap-2">

          {canEdit && (
            <button
              onClick={()=>setManualModal(true)}
              className="flex items-center gap-2 bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
              title="Cargar manualmente una factura emitida en arca.gob.ar (PV 0001 / 0002)"
            >
              <Icon d={Icons.add} size={14}/>Cargar factura manual
            </button>
          )}
          {monthInvoices.length>0&&(
            <button
              onClick={descargarReporteCSV}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700"
              title="Descargar reporte mensual en CSV (se abre con Excel)"
            >
              <Icon d={Icons.download} size={14}/>Descargar reporte
            </button>
          )}
        </div>
      </div>
      {monthInvoices.length>0&&(
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {label:"Neto",value:fmtMoney(totNeto),cls:"bg-gray-50 border-gray-200",txt:"text-gray-700",sub:totalesMes.cantidad>0?`${totalesMes.cantidad} factura(s) activas`:""},
            {label:"IVA 10.5%",value:fmtMoney(totIva),cls:"bg-orange-50 border-orange-200",txt:"text-orange-700",sub:"débito fiscal"},
            {label:"Total",value:fmtMoney(totTotal),cls:"bg-blue-50 border-blue-200",txt:"text-blue-700",sub:"facturado neto de NC"},
            {label:"IIBB 3%",value:fmtMoney(totIibb),cls:"bg-purple-50 border-purple-200",txt:"text-purple-700",sub:"a pagar (informativo)"},
          ].map(s=>(
            <div key={s.label} className={`rounded-xl border p-3 ${s.cls}`}>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`font-bold text-base ${s.txt}`}>{s.value}</p>
              {s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
            </div>
          ))}
        </div>
      )}
      {pendingContracts.length>0&&canEdit&&(
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icon d={Icons.alert} size={18} className="text-amber-600 flex-shrink-0"/>
            <div>
              <p className="font-semibold text-amber-800 text-sm">{pendingContracts.length} contrato(s) sin facturar</p>
              <p className="text-xs text-amber-600">{MONTHS[billMonth-1]} {billYear}</p>
            </div>
          </div>
          <button onClick={()=>setReviewModal(pendingContracts)} className="bg-amber-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-amber-700 flex-shrink-0">Revisar y aprobar</button>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold text-sm">Facturas — {MONTHS[billMonth-1]} {billYear}</h3>
          <span className="text-xs text-gray-400">{monthInvoices.length} de {monthInvoicesBase.length} facturas</span>
        </div>
        <div className="px-4 py-2 border-b border-gray-100 flex flex-wrap gap-2">
          <input value={filtroBusqueda} onChange={e=>setFiltroBusqueda(e.target.value)} placeholder="Buscar número o cliente..." className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none flex-1 min-w-32"/>
          <select value={filtroCliente} onChange={e=>setFiltroCliente(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none">
            <option value="">Todos los clientes</option>
            {clients.filter(c=>c.active).map(c=><option key={c.id} value={c.id}>{fmtClientName(c)}</option>)}
          </select>
          <select value={filtroEstado} onChange={e=>setFiltroEstado(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none">
            <option value="">Todos los estados</option>
            <option value="Emitida">Emitida</option>
            <option value="Pagada">Pagada</option>
            <option value="Borrador">Borrador</option>
          </select>
          <select value={filtroEmail} onChange={e=>setFiltroEmail(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none">
            <option value="">Todos los emails</option>
            <option value="enviado">Email enviado</option>
            <option value="no_enviado">Sin enviar</option>
          </select>
          <label className="flex items-center gap-1.5 px-2 py-1.5 text-xs cursor-pointer select-none hover:bg-gray-50 rounded-lg" title="Mostrar/ocultar facturas anuladas con NC">
            <input
              type="checkbox"
              checked={ocultarAnuladas}
              onChange={e=>setOcultarAnuladas(e.target.checked)}
              className="cursor-pointer"
            />
            <span className="text-gray-600">Ocultar anuladas</span>
            {ocultarAnuladas && monthInvoicesBase.filter(i=>i.estado==="Anulada").length>0 && (
              <span className="text-gray-400">({monthInvoicesBase.filter(i=>i.estado==="Anulada").length})</span>
            )}
          </label>
          {(filtroCliente||filtroEstado||filtroEmail||filtroBusqueda)&&<button onClick={()=>{setFiltroCliente("");setFiltroEstado("");setFiltroEmail("");setFiltroBusqueda("");}} className="px-2 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg">✕ Limpiar</button>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Fecha","Número","Cliente","Neto","IVA","Total","Estado","CAE","PDF","","NC"].map(h=><th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {monthInvoices.map(inv=>(
                <tr key={inv.id} className={`border-b border-gray-50 hover:bg-gray-50 ${inv.estado === "Anulada" ? "opacity-60 line-through" : ""}`}>
                  <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">{inv.fecha ? `${inv.fecha.slice(6,8)}/${inv.fecha.slice(4,6)}/${inv.fecha.slice(0,4)}` : fmtDate(inv.month && inv.year ? `${inv.year}-${String(inv.month).padStart(2,"0")}-01` : "")}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span>{inv.numero}</span>
                      {inv.origen === "manual_arca" && (
                        <span className="bg-purple-100 text-purple-700 text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded uppercase" title="Cargada manualmente desde ARCA Web">Manual ARCA</span>
                      )}
                      {inv.origen === "sync_arca" && (
                        <span className="bg-indigo-100 text-indigo-700 text-[9px] font-sans font-semibold px-1.5 py-0.5 rounded uppercase" title="Sincronizada desde ARCA">Sync ARCA</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-xs">
                    <div className="font-medium">{inv.clientName}</div>
                    {(() => {
                      const cli = clients.find(c => c.id === inv.clientId);
                      return cli?.alias ? <div className="text-xs text-gray-400">{cli.alias}</div> : null;
                    })()}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-gray-600">{fmtMoney(inv.neto)}</td>
                  <td className="px-3 py-2.5 text-xs text-orange-600 font-medium">{fmtMoney(inv.iva)}</td>
                  <td className="px-3 py-2.5 text-xs font-bold">{fmtMoney(inv.total)}</td>
                  <td className="px-3 py-2.5">
                    {canEdit?(
                      <select value={inv.estado} onChange={e=>updateInvoice(inv.id,{estado:e.target.value,...(e.target.value==="Pagada"?{fechaPago:todayStr()}:{fechaPago:""})})}
                        className={`text-xs border rounded px-1.5 py-1 font-medium focus:outline-none cursor-pointer ${inv.estado==="Pagada"?"border-green-300 bg-green-50 text-green-700":inv.estado==="Emitida"?"border-blue-300 bg-blue-50 text-blue-700":"border-gray-200 bg-gray-50 text-gray-600"}`}>
                        <option value="Borrador">Borrador</option>
                        <option value="Emitida">Emitida</option>
                        <option value="Pagada">Pagada</option>
                      </select>
                    ):<EstadoBadge estado={inv.estado}/>}
                  </td>
                  <td className="px-3 py-2.5">
                    {inv.cae?<span className="font-mono text-xs text-gray-400">{inv.cae.slice(0,8)}...</span>:
                      canEdit&&<input placeholder="CAE" value={inv.cae||""} onChange={e=>updateInvoice(inv.id,{cae:e.target.value})} className="text-xs border border-gray-200 rounded px-1.5 py-1 w-24 focus:outline-none"/>}
                  </td>
                  <td className="px-3 py-2.5">
                    {inv.cae && (
                      <button onClick={()=>descargarPDF(inv)} title="Descargar PDF" className="text-red-400 hover:text-red-600">
                        <Icon d={Icons.pdf} size={14}/>
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={()=>setEmailModal(inv)}
                      title={inv.emailEnviado ? `Email enviado${inv.emailEnviadoFecha?` el ${new Date(inv.emailEnviadoFecha).toLocaleDateString("es-AR")} ${new Date(inv.emailEnviadoFecha).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"})}`:""}. Click para reenviar.` : "Enviar por email"}
                      className={`${inv.emailEnviado?"text-green-500":"text-gray-400 hover:text-blue-600"}`}
                    >
                      <Icon d={Icons.mail} size={14}/>
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    {canEdit && inv.cae && inv.estado === "Emitida" && !inv.nc_id && (
                      <button
                        onClick={()=>setNcModal(inv)}
                        title="Anular con nota de crédito"
                        className="text-gray-400 hover:text-red-600"
                      ><Icon d={Icons.creditNote} size={14}/></button>
                    )}
                    {inv.estado === "Anulada" && (
                      <span className="text-xs text-red-600 font-semibold no-underline" style={{textDecoration:"none"}}>NC</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {monthInvoices.length===0&&<div className="text-center py-8 text-gray-400 text-sm">Sin facturas para este período</div>}
      </div>
      {reviewModal&&<ReviewModal
        contracts={reviewModal}
        clients={clients}
        billMonth={billMonth}
        billYear={billYear}
        onApprove={approveAndEmit}
        onClose={()=>setReviewModal(null)}
        onEditContract={(ct)=>setEditContractModal(ct)}
        onToggleActive={toggleActiveContract}
        onEmitirIndividual={emitirFacturaIndividual}
      />}
      {editContractModal && (
        <ContractModal
          data={editContractModal}
          clients={clients}
          onSave={saveContractFromBilling}
          onClose={()=>setEditContractModal(null)}
        />
      )}
      {emailModal&&<EmailModal invoice={emailModal} config={config} clients={clients} onClose={()=>setEmailModal(null)} onGuardarEmailsAdicionales={actualizarEmailsCliente} onSent={async(destinatariosEnviados)=>{
        try {
          // Actualizar state local inmediatamente para feedback visual
          const ahora = new Date().toISOString();
          updateInvoice(emailModal.id,{emailEnviado:true,emailEnviadoFecha:ahora});
          // Persistir en Supabase para que sobreviva recargas
          if (marcarEmailEnviadoSupabase) await marcarEmailEnviadoSupabase(emailModal.id);
          // Registrar en historial (con guard por si la prop no llegó)
          if (registrarEmailEnHistorial) {
            await registrarEmailEnHistorial({
              cliente_id: emailModal.clientId,
              factura_id: emailModal.id,
              destinatarios: destinatariosEnviados || [emailModal.clientEmail],
              asunto: `Factura ${emailModal.numero} — ${emailModal.periodo}`,
              cuerpo: "(envío de factura con PDF adjunto)",
              tipo: "factura",
              exito: true,
            });
          }
        } catch (e) {
          console.error("Error en post-envío de factura:", e);
          // No tirar pantalla en blanco: el email se envió OK, esto es solo logging
        }
        setEmailModal(null);
      }}/>}
      {ncModal && (
        <EmitirNCModal
          factura={ncModal}
          cliente={clients.find(c=>c.id===ncModal.clientId)}
          onClose={()=>setNcModal(null)}
          onConfirm={async (motivo) => {
            const ok = await emitirNotaCredito(ncModal, motivo);
            if (ok) setNcModal(null);
          }}
        />
      )}
      {manualModal && (
        <FacturaManualModal
          clients={clients}
          onClose={()=>setManualModal(false)}
          onSave={async (inv) => {
            try {
              const uuid = await guardarFacturaSupabase(inv, inv.clientId);
              if (uuid) inv.id = uuid;
              setInvoices(prev => [inv, ...prev]);
              return true;
            } catch (e) {
              console.error("Error guardando factura manual:", e);
              return false;
            }
          }}
        />
      )}
      {syncModal && (
        <SyncArcaModal
          clients={clients}
          invoices={invoices}
          onClose={()=>setSyncModal(false)}
          onImportar={async (inv) => {
            try {
              const uuid = await guardarFacturaSupabase(inv, inv.clientId);
              if (uuid) inv.id = uuid;
              setInvoices(prev => [inv, ...prev]);
              return true;
            } catch (e) {
              console.error("Error importando factura desde ARCA:", e);
              return false;
            }
          }}
        />
      )}
    </div>
  );
}

// ── PREVIEW DE FACTURA INDIVIDUAL ANTES DE EMITIR ──────────────────────────
// Muestra un resumen visual de la factura que se va a emitir y pide confirmación final.
// Solo después de "Confirmar y emitir" se manda realmente a ARCA.
function PreviewFacturaModal({ contrato, cliente, fechas, textoOpcional, onClose, onConfirmar }) {
  const [emitiendo, setEmitiendo] = useState(false);
  const submittingRef = useRef(false);

  const handleEmitir = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setEmitiendo(true);
    try {
      await onConfirmar();
    } catch (e) {
      console.error("Error en emisión individual:", e);
      alert("Error al emitir: " + e.message);
    } finally {
      submittingRef.current = false;
      setEmitiendo(false);
    }
  };

  const fmtFechaLocal = (s) => {
    if (!s) return "—";
    const [y, m, d] = s.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="font-semibold text-base flex items-center gap-2">
            <Icon d={Icons.send} size={18} className="text-amber-600"/>
            Última revisión antes de emitir
          </h3>
          <button onClick={emitiendo ? () => {} : onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none disabled:opacity-50">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            ⚠️ Después de hacer click en "Confirmar y emitir", la factura se enviará a ARCA y obtendrá CAE. La operación es <strong>irreversible</strong>; si hay un error solo se puede anular con NC.
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <p className="text-xs text-gray-500 font-medium uppercase">Receptor</p>
            </div>
            <div className="p-3 space-y-1 text-sm">
              <p className="font-semibold">{cliente?.razonSocial}</p>
              {cliente?.alias && <p className="text-xs text-gray-500">— {cliente.alias}</p>}
              <p className="text-xs text-gray-600">CUIT: <span className="font-mono">{cliente?.cuit}</span></p>
              <p className="text-xs text-gray-600">{cliente?.condicionIVA}</p>
              <p className="text-xs text-gray-600">{cliente?.domicilio || "(sin domicilio)"}</p>
              <p className="text-xs"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">Factura {cliente?.tipoFactura}</span></p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <p className="text-xs text-gray-500 font-medium uppercase">Servicio</p>
            </div>
            <div className="p-3 space-y-1.5 text-sm">
              <p>{contrato.descripcion}</p>
              {textoOpcional && <p className="text-xs text-gray-600 italic">{textoOpcional}</p>}
              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-100 mt-2">
                <div>
                  <span className="text-gray-500 block">Servicio desde</span>
                  <span className="font-medium">{fmtFechaLocal(fechas.servicioDesde)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Servicio hasta</span>
                  <span className="font-medium">{fmtFechaLocal(fechas.servicioHasta)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Vto. de pago</span>
                  <span className="font-medium">{fmtFechaLocal(fechas.vtoPago)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <p className="text-xs text-gray-500 font-medium uppercase">Importes</p>
            </div>
            <div className="p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Neto</span>
                <span>{fmtMoney(contrato.montoNeto)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IVA 10.5%</span>
                <span className="text-orange-600">{fmtMoney(contrato.iva)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-blue-700 text-lg">{fmtMoney(contrato.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100 flex gap-2 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            disabled={emitiendo}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >Cancelar</button>
          <button
            onClick={handleEmitir}
            disabled={emitiendo}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {emitiendo ? "⏳ Emitiendo a ARCA..." : <><Icon d={Icons.send} size={14}/>Confirmar y emitir</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({contracts,clients,billMonth,billYear,onApprove,onClose,onEditContract,onToggleActive,onEmitirIndividual}){
  const [texts,setTexts]=useState({});
  const [sel,setSel]=useState(contracts.map(c=>c.id));
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewIndividual, setPreviewIndividual] = useState(null);
  // Set de contractIds ya emitidos individualmente (se ocultan del listado)
  const [yaEmitidos, setYaEmitidos] = useState(new Set());
  // Guarda sincrónica anti-doble-click
  const submittingRef = useRef(false);

  // Estado de fechas por contrato. Se inicializa con el cálculo automático.
  const [fechas, setFechas] = useState(() => {
    const o = {};
    contracts.forEach(ct => {
      o[ct.id] = calcularFechasServicio(ct, billMonth, billYear);
    });
    return o;
  });

  // Tipo de período elegido por contrato: "mes_anterior" (default), "mes_actual", "rango", "dia"
  const [tipoPeriodoSel, setTipoPeriodoSel] = useState(() => {
    const o = {};
    contracts.forEach(ct => { o[ct.id] = "mes_anterior"; });
    return o;
  });

  // Cambiar tipo de período: aplica el cálculo correspondiente a las fechas
  const cambiarTipoPeriodo = (ctId, nuevoTipo) => {
    const ct = contracts.find(c => c.id === ctId);
    if (!ct) return;
    const dvp = parseInt(ct.diaVencimientoPago) || 0;
    setTipoPeriodoSel(prev => ({ ...prev, [ctId]: nuevoTipo }));
    if (nuevoTipo === "mes_anterior") {
      setFechas(p => ({ ...p, [ctId]: fechasMesAnteriorCompleto(billMonth, billYear, dvp) }));
    } else if (nuevoTipo === "mes_actual") {
      setFechas(p => ({ ...p, [ctId]: fechasMesActualCompleto(billMonth, billYear, dvp) }));
    } else if (nuevoTipo === "dia") {
      // Día puntual: usa la fecha "desde" actual o hoy
      const dia = (fechas[ctId]?.servicioDesde) || toLocalDateStr(new Date());
      setFechas(p => ({ ...p, [ctId]: { servicioDesde: dia, servicioHasta: dia, vtoPago: maxFecha(sumarDias(dia, dvp), toLocalDateStr(new Date())) } }));
    }
    // Si es "rango", no cambia las fechas: el usuario las ajusta a mano
  };

  // Recalcular fechas cuando cambia la lista de contratos (ej: usuario edita uno desde el modal)
  useEffect(() => {
    setFechas(prev => {
      const o = { ...prev };
      contracts.forEach(ct => {
        if (!o[ct.id]) {
          o[ct.id] = calcularFechasServicio(ct, billMonth, billYear);
        }
      });
      return o;
    });
  }, [contracts, billMonth, billYear]);

  const updateFecha = (ctId, campo, valor) => {
    setFechas(prev => ({ ...prev, [ctId]: { ...prev[ctId], [campo]: valor } }));
  };

  const toggle=id=>setSel(prev=>prev.includes(id)?prev.filter(i=>i!==id):[...prev,id]);
  const selTotal=contracts.filter(c=>sel.includes(c.id)).reduce((s,c)=>s+c.total,0);

  const handleConfirm = async () => {
    if (submittingRef.current) {
      console.warn("Aprobación ya en curso, ignorando click duplicado");
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      // Pasar también las fechas editadas (en formato YYYYMMDD para ARCA)
      const fechasArca = {};
      Object.keys(fechas).forEach(id => {
        fechasArca[id] = {
          fch_serv_desde: dateStrToArca(fechas[id].servicioDesde),
          fch_serv_hasta: dateStrToArca(fechas[id].servicioHasta),
          fch_vto_pago:   dateStrToArca(fechas[id].vtoPago),
        };
      });
      await onApprove(sel, texts, fechasArca);
    } catch (e) {
      console.error("Error en approveAndEmit:", e);
      submittingRef.current = false;
      setSubmitting(false);
      alert("Error al emitir: " + e.message);
    }
  };

  const confirmItems = contracts
    .filter(c => sel.includes(c.id))
    .map(ct => {
      const cli = clients.find(c => c.id === ct.clientId);
      return {
        label: fmtClientName(cli) || "Cliente",
        monto: fmtMoney(ct.total),
      };
    });

  return(
    <Modal title="Revisión previa a facturación" onClose={submitting ? () => {} : onClose} wide>
      <div className="mb-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
        Revisá cada contrato antes de aprobar. Podés <strong>editar el contrato</strong>, ajustar las 3 fechas, <strong>emitir cada factura individualmente con preview</strong> (botón ⚡ verde) o <strong>emitir el lote completo</strong> abajo.{yaEmitidos.size>0 && <> · <strong>{yaEmitidos.size} ya emitida(s)</strong> en esta sesión.</>}
      </div>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {contracts.filter(ct=>!yaEmitidos.has(ct.id)).length === 0 && (
          <div className="text-center py-8 text-sm text-gray-500">
            ✅ Todos los contratos del lote ya fueron emitidos. Cerrá este panel.
          </div>
        )}
        {contracts.filter(ct=>!yaEmitidos.has(ct.id)).map(ct=>{
          const client=clients.find(c=>c.id===ct.clientId);
          const checked=sel.includes(ct.id);
          const fch = fechas[ct.id] || { servicioDesde:"", servicioHasta:"", vtoPago:"" };
          return(
            <div key={ct.id} className={`border rounded-lg p-3 transition-all ${!ct.active?"border-gray-300 bg-gray-50 opacity-60":checked?"border-blue-300 bg-blue-50":"border-gray-200"}`}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={checked && ct.active} disabled={submitting||!ct.active} onChange={()=>toggle(ct.id)} className="mt-1"/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{client?.razonSocial}{!ct.active && <span className="ml-2 text-xs text-red-600 font-normal">(INACTIVO)</span>}</p>
                    <span className="font-bold text-blue-700">{fmtMoney(ct.total)}</span>
                  </div>
                  {client?.alias && <p className="text-xs text-gray-400 -mt-0.5">{client.alias}</p>}
                  <p className="text-xs text-gray-500 mb-1">{ct.descripcion}</p>
                  <div className="flex gap-3 text-xs text-gray-400 mb-2 flex-wrap">
                    <span>Neto: {fmtMoney(ct.montoNeto)}</span>
                    <span>IVA: {fmtMoney(ct.iva)}</span>
                    {ct.diaVencimientoPago>0 && <span className="text-gray-500">Vto. pago +{ct.diaVencimientoPago}d</span>}
                  </div>

                  {/* SELECTOR TIPO DE PERÍODO */}
                  <div className="mb-1">
                    <label className="text-[10px] font-medium text-gray-500 block">Tipo de período</label>
                    <select
                      value={tipoPeriodoSel[ct.id] || "mes_anterior"}
                      onChange={e=>cambiarTipoPeriodo(ct.id, e.target.value)}
                      disabled={submitting}
                      className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-50"
                    >
                      <option value="mes_anterior">📅 Mes anterior completo (mes vencido)</option>
                      <option value="mes_actual">📅 Mes actual completo (mes corriente)</option>
                      <option value="rango">📆 Rango de fechas (varios días)</option>
                      <option value="dia">📌 Día puntual (un solo día)</option>
                    </select>
                  </div>

                  {/* 3 FECHAS EDITABLES */}
                  <div className="bg-white border border-gray-200 rounded-lg p-2 mb-2 grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-gray-500 block">Servicio desde</label>
                      <input type="date" value={fch.servicioDesde}
                        onChange={e=>{
                          const nv = e.target.value;
                          if (tipoPeriodoSel[ct.id] === "dia") {
                            // Día puntual: sincroniza Hasta también
                            const dvp = parseInt(ct.diaVencimientoPago)||0;
                            setFechas(p=>({...p,[ct.id]:{servicioDesde:nv,servicioHasta:nv,vtoPago:maxFecha(sumarDias(nv,dvp),toLocalDateStr(new Date()))}}));
                          } else {
                            updateFecha(ct.id,"servicioDesde",nv);
                          }
                        }}
                        disabled={submitting} className="w-full px-2 py-1 border border-gray-200 rounded text-xs"/>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-gray-500 block">Servicio hasta</label>
                      <input type="date" value={fch.servicioHasta}
                        onChange={e=>updateFecha(ct.id,"servicioHasta",e.target.value)}
                        disabled={submitting||tipoPeriodoSel[ct.id]==="dia"}
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs disabled:bg-gray-50"/>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-gray-500 block">Vto. de pago</label>
                      <input type="date" value={fch.vtoPago} onChange={e=>updateFecha(ct.id,"vtoPago",e.target.value)} disabled={submitting} className="w-full px-2 py-1 border border-gray-200 rounded text-xs"/>
                    </div>
                  </div>

                  <input value={texts[ct.id]||ct.textoOpcional||""} onChange={e=>setTexts(p=>({...p,[ct.id]:e.target.value}))}
                    disabled={submitting}
                    placeholder="Texto adicional (OC, expediente...)"
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-300 disabled:bg-gray-50 mb-1"/>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="flex gap-1.5 flex-wrap">
                    <button type="button" onClick={()=>onEditContract && onEditContract(ct)} disabled={submitting} className="text-[11px] px-2 py-1 text-blue-600 hover:bg-blue-50 rounded border border-blue-200 disabled:opacity-50">✏️ Editar contrato</button>
                    <button type="button" onClick={()=>onToggleActive && onToggleActive(ct)} disabled={submitting} className={`text-[11px] px-2 py-1 rounded border disabled:opacity-50 ${ct.active?"text-amber-600 hover:bg-amber-50 border-amber-200":"text-green-600 hover:bg-green-50 border-green-200"}`}>{ct.active?"⏸️ Desactivar":"▶️ Activar"}</button>
                    {ct.active && (
                      <button
                        type="button"
                        onClick={()=>setPreviewIndividual(ct.id)}
                        disabled={submitting}
                        className="text-[11px] px-2 py-1 text-green-700 hover:bg-green-50 rounded border border-green-300 font-medium disabled:opacity-50"
                        title="Emitir solo esta factura (con preview)"
                      >⚡ Emitir esta</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">{sel.length}/{contracts.filter(c=>c.active).length} · <span className="font-semibold text-blue-700">{fmtMoney(selTotal)}</span></div>
        <div className="flex gap-2">
          <button onClick={onClose} disabled={submitting} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50">Cancelar</button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={sel.length===0 || submitting}
            className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>⏳ Emitiendo {sel.length} factura(s)... no toques nada</>
            ) : (
              <><Icon d={Icons.check} size={14}/>Emitir {sel.length} factura(s)</>
            )}
          </button>
        </div>
      </div>

      {showConfirm && (
        <ConfirmEmisionModal
          titulo={`¿Emitir ${sel.length} factura(s) a ARCA?`}
          resumen={{
            "Cantidad": `${sel.length} factura(s)`,
            "Total a facturar": fmtMoney(selTotal),
          }}
          items={confirmItems}
          loading={submitting}
          onCancel={() => { if (!submitting) setShowConfirm(false); }}
          onConfirm={handleConfirm}
        />
      )}
      {previewIndividual && (() => {
        const ct = contracts.find(c => c.id === previewIndividual);
        if (!ct) return null;
        const cliente = clients.find(c => c.id === ct.clientId);
        const fch = fechas[ct.id] || { servicioDesde:"", servicioHasta:"", vtoPago:"" };
        const txt = texts[ct.id] || ct.textoOpcional || "";
        return (
          <PreviewFacturaModal
            contrato={ct}
            cliente={cliente}
            fechas={fch}
            textoOpcional={txt}
            onClose={() => setPreviewIndividual(null)}
            onConfirmar={async () => {
              const fechasArca = {
                fch_serv_desde: dateStrToArca(fch.servicioDesde),
                fch_serv_hasta: dateStrToArca(fch.servicioHasta),
                fch_vto_pago:   dateStrToArca(fch.vtoPago),
              };
              const ok = await onEmitirIndividual(ct, txt, fechasArca);
              if (ok) {
                setPreviewIndividual(null);
                // Sacar de selección y marcar como ya emitido (oculto del listado)
                setSel(prev => prev.filter(id => id !== ct.id));
                setYaEmitidos(prev => new Set([...prev, ct.id]));
              }
            }}
          />
        );
      })()}
    </Modal>
  );
}

// ── ENVÍO DE EMAIL LIBRE (sin PDF) ────────────────────────────────────────
// Para comunicaciones generales: avisos, cambios de cuenta, aumentos, etc.
// El destinatario y los emails adicionales se autocompletan desde la ficha del cliente.
function EmailLibreModal({ cliente, onClose, onEnviado, registrarEnHistorial }) {
  const destinatariosIniciales = (() => {
    const lista = [];
    if (cliente?.email) lista.push(cliente.email);
    if (cliente?.emailsAdicionales) {
      cliente.emailsAdicionales.split(/[,;]/).map(s=>s.trim()).filter(Boolean).forEach(e => {
        if (!lista.includes(e)) lista.push(e);
      });
    }
    return lista.join(", ");
  })();
  const [destinatarios,setDestinatarios] = useState(destinatariosIniciales);
  const [asunto,setAsunto] = useState("");
  const [cuerpo,setCuerpo] = useState("");
  const [sending,setSending] = useState(false);
  const [error,setError] = useState("");

  const send = async () => {
    const dests = destinatarios.split(/[,;]/).map(s=>s.trim()).filter(Boolean);
    if (dests.length === 0) { setError("Ingresá al menos un email"); return; }
    const invalidos = dests.filter(e => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (invalidos.length > 0) { setError("Email inválido: " + invalidos.join(", ")); return; }
    if (!asunto.trim()) { setError("Falta el asunto"); return; }
    if (!cuerpo.trim()) { setError("Falta el cuerpo del mensaje"); return; }

    setSending(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/enviar-email-libre`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinatarios: dests,
          asunto,
          cuerpo,
          fromName: "LA VANGUARDIA NOTICIAS",
        }),
      });
      const data = await res.json();
      if (data.exito) {
        // Registrar en historial
        if (registrarEnHistorial) {
          await registrarEnHistorial({
            cliente_id: cliente?.id || null,
            destinatarios: dests,
            asunto,
            cuerpo,
            tipo: "libre",
            exito: true,
          });
        }
        onEnviado && onEnviado();
        onClose();
      } else {
        setError(data.error || "Error al enviar");
        if (registrarEnHistorial) {
          await registrarEnHistorial({
            cliente_id: cliente?.id || null,
            destinatarios: dests,
            asunto,
            cuerpo,
            tipo: "libre",
            exito: false,
            error_msg: data.error || "Error desconocido",
          });
        }
      }
    } catch (e) {
      setError("Error de conexión: " + e.message);
    }
    setSending(false);
  };

  return (
    <Modal title={`Enviar email a ${cliente?.razonSocial || "cliente"}`} onClose={onClose} wide>
      <div className="space-y-3">
        <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
          ℹ️ Email general sin PDF adjunto (para avisos, cambios de cuenta, etc).
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Para: <span className="font-normal text-gray-400">(separar con coma o punto y coma)</span>
          </label>
          <input
            type="text"
            value={destinatarios}
            onChange={e => setDestinatarios(e.target.value)}
            placeholder="cliente@empresa.com, contador@empresa.com"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Asunto</label>
          <input
            type="text"
            value={asunto}
            onChange={e => setAsunto(e.target.value)}
            placeholder="Ej: Aviso de cambio de cuenta bancaria"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Mensaje</label>
          <textarea
            value={cuerpo}
            onChange={e => setCuerpo(e.target.value)}
            rows={9}
            placeholder="Estimado/a,&#10;&#10;Le informamos que..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none"
          />
        </div>
        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} disabled={sending} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg disabled:opacity-50">Cancelar</button>
        <button onClick={send} disabled={sending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
          {sending ? "⏳ Enviando..." : <><Icon d={Icons.send} size={14}/>Enviar</>}
        </button>
      </div>
    </Modal>
  );
}

function EmailModal({invoice,config,clients,onClose,onSent,onGuardarEmailsAdicionales}){
  const body=config.emailTemplate.replace("{cliente}",invoice.clientName).replace("{numero}",invoice.numero).replace("{periodo}",invoice.periodo).replace("{total}",fmtMoney(invoice.total)).replace("{empresa}",config.empresa);
  const client = clients?.find(c=>c.id===invoice.clientId);
  // Construir destinatarios iniciales: email principal + emails adicionales del cliente
  const destinatariosIniciales = (() => {
    const lista = [];
    if (client?.email) lista.push(client.email);
    if (client?.emailsAdicionales) {
      client.emailsAdicionales.split(/[,;]/).map(s=>s.trim()).filter(Boolean).forEach(e => {
        if (!lista.includes(e)) lista.push(e);
      });
    }
    if (lista.length === 0 && invoice.clientEmail) lista.push(invoice.clientEmail);
    return lista.join(", ");
  })();
  const [destinatarios,setDestinatarios]=useState(destinatariosIniciales);
  const [msg,setMsg]=useState(body);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState("");

  // Detectar si los emails actuales son distintos de los guardados en el cliente
  const emailsCambiados = (() => {
    const actuales = destinatarios.split(/[,;]/).map(s=>s.trim()).filter(Boolean).sort().join("|");
    const guardados = (() => {
      const lista = [];
      if (client?.email) lista.push(client.email);
      if (client?.emailsAdicionales) lista.push(...client.emailsAdicionales.split(/[,;]/).map(s=>s.trim()).filter(Boolean));
      return lista.sort().join("|");
    })();
    return actuales !== guardados && actuales.length > 0;
  })();

  const send=async()=>{
    const dests = destinatarios.split(/[,;]/).map(s=>s.trim()).filter(Boolean);
    if (dests.length === 0) { setError("Ingresá al menos un email"); return; }
    // Validación básica de formato
    const invalidos = dests.filter(e => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (invalidos.length > 0) { setError("Email inválido: " + invalidos.join(", ")); return; }
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/enviar-email`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          numero: invoice.numero,
          clientName: invoice.clientName,
          clientCuit: client?.cuit || invoice.clientCuit || "-",
          clientDomicilio: client?.domicilio || "-",
          clientCondicionIVA: client?.condicionIVA || "",
          periodo: invoice.periodo,
          detalle: invoice.detalle,
          neto: invoice.neto,
          iva: invoice.iva,
          total: invoice.total,
          cae: invoice.cae,
          cae_vencimiento: invoice.cae_vencimiento,
          fecha: invoice.fecha,
          tipoFactura: invoice.tipoFactura,
          empresa: config.empresa || "LA VANGUARDIA NOTICIAS",
          empresaCuit: config.cuit || "30-71644424-0",
          empresaDomicilio: config.domicilio || "Gobernador Gregores 1370, Caleta Olivia",
          fch_serv_desde: invoice.fch_serv_desde || "",
          fch_serv_hasta: invoice.fch_serv_hasta || "",
          fch_vto_pago:   invoice.fch_vto_pago   || "",
          emailDestino: dests,
          emailAsunto: `Factura ${invoice.numero} — ${invoice.periodo}`,
          emailCuerpo: msg,
        }),
      });
      const data = await res.json();
      if(data.exito){
        // Si los emails cambiaron, ofrecer guardarlos en la ficha del cliente
        if (emailsCambiados && client && onGuardarEmailsAdicionales) {
          const guardar = window.confirm(
            `¿Querés guardar estos emails en la ficha de ${client.razonSocial} para usarlos automáticamente la próxima vez?\n\n` +
            dests.join("\n")
          );
          if (guardar) {
            // El primer email se guarda como principal; los demás como adicionales
            await onGuardarEmailsAdicionales(client.id, dests[0], dests.slice(1).join(", "));
          }
        }
        onSent(dests);
      }
      else { setError(data.error || "Error al enviar"); }
    } catch(e) {
      setError("Error de conexión: " + e.message);
    }
    setSending(false);
  };
  return(
    <Modal title="Enviar factura por email" onClose={onClose} wide>
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-2">
          <div>
            <label className="font-bold text-gray-700 block mb-1">Para: <span className="font-normal text-gray-400">(separar con coma o punto y coma para múltiples)</span></label>
            <input
              type="text"
              value={destinatarios}
              onChange={e=>setDestinatarios(e.target.value)}
              placeholder="cliente@empresa.com, contador@empresa.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
            />
          </div>
          <p><strong>Asunto:</strong> Factura {invoice.numero} — {invoice.periodo}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Cuerpo del mensaje</label>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={7} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none"/>
        </div>
        <div className="p-2 bg-blue-50 rounded text-xs text-blue-600">📎 PDF adjunto automáticamente</div>
        {error&&<p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancelar</button>
        <button onClick={send} disabled={sending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          {sending?"Enviando...":<><Icon d={Icons.send} size={14}/>Enviar</>}
        </button>
      </div>
    </Modal>
  );
}

// ── MODAL DE ENVÍO DE NC POR EMAIL ──────────────────────────────────────────
function EmailNCModal({ nc, factura, cliente, config, onClose, onSent }) {
  const tipoLetra = nc.tipoNC === 3 ? "A" : "B";
  const cuerpoDefault =
    `Estimado/a ${nc.clientName},\n\n` +
    `Adjunto encontrará la nota de crédito ${nc.numero}, ` +
    `que anula la factura ${nc.factura_original_numero}.\n\n` +
    `Motivo: ${nc.motivo || "—"}\n\n` +
    `Quedamos a su disposición.\n\n` +
    `Saludos,\n${config.empresa || "LA VANGUARDIA NOTICIAS"}`;
  const [msg, setMsg] = useState(cuerpoDefault);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    if (!cliente?.email) { setError("El cliente no tiene email cargado."); return; }
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/enviar-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: nc.numero,
          clientName: nc.clientName,
          clientCuit: cliente?.cuit || "-",
          clientDomicilio: cliente?.domicilio || "-",
          clientCondicionIVA: cliente?.condicionIVA || "",
          periodo: factura?.periodo || "",
          detalle: "",
          neto: nc.neto,
          iva: nc.iva,
          total: nc.total,
          cae: nc.cae,
          cae_vencimiento: nc.cae_vencimiento,
          fecha: nc.fecha_emision ? nc.fecha_emision.replace(/-/g,"") : "",
          tipoFactura: tipoLetra,
          empresa: config.empresa || "LA VANGUARDIA NOTICIAS",
          empresaCuit: config.cuit || "30-71644424-0",
          empresaDomicilio: config.domicilio || "Gobernador Gregores 1370, Caleta Olivia",
          esNotaCredito: true,
          facturaAsoc: factura ? {
            numero: factura.numero,
            fecha: factura.fecha || "",
            cae: factura.cae,
          } : null,
          motivoNC: nc.motivo,
          emailDestino: cliente.email,
          emailAsunto: `Nota de Crédito ${nc.numero} — Anula factura ${nc.factura_original_numero}`,
          emailCuerpo: msg,
        }),
      });
      const data = await res.json();
      if (data.exito) onSent();
      else setError(data.error || "Error al enviar");
    } catch(e) {
      setError("Error de conexión: " + e.message);
    }
    setSending(false);
  };

  return (
    <Modal title="Enviar nota de crédito por email" onClose={onClose} wide>
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
          <p><strong>Para:</strong> {cliente?.email}</p>
          <p><strong>Asunto:</strong> Nota de Crédito {nc.numero} — Anula factura {nc.factura_original_numero}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Cuerpo del mensaje</label>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={8} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none"/>
        </div>
        <div className="p-2 bg-blue-50 rounded text-xs text-blue-600">📎 PDF de la NC adjunto automáticamente</div>
        {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancelar</button>
        <button onClick={send} disabled={sending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          {sending ? "Enviando..." : <><Icon d={Icons.send} size={14}/>Enviar</>}
        </button>
      </div>
    </Modal>
  );
}

function Expenses({expenses,setExpenses,currentUser,canEdit}){
  const [modal,setModal]=useState(null);
  const [fMonth,setFMonth]=useState(String(new Date().getMonth()+1));
  const [fYear,setFYear]=useState(String(new Date().getFullYear()));
  const [fCat,setFCat]=useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const isWebmaster = currentUser?.role === "webmaster";

  const empty={descripcion:"",categoria:"Proveedores",monto:"",fecha:todayStr(),proveedor:"",comprobante:"",url_comprobante:"",pagado:true,notas:""};
  const filtered=expenses.filter(e=>{const d=new Date(e.fecha);return(!fMonth||d.getMonth()+1===Number(fMonth))&&(!fYear||d.getFullYear()===Number(fYear))&&(!fCat||e.categoria===fCat);});
  const [saving, setSaving] = useState(false);
  const save = async (data) => {
    setSaving(true);
    const d = { ...data, monto: parseFloat(data.monto) || 0 };
    const payload = {
      descripcion:      d.descripcion,
      categoria:        d.categoria,
      monto:            d.monto,
      fecha:            d.fecha,
      proveedor:        d.proveedor || null,
      comprobante:      d.comprobante || null,
      url_comprobante:  d.url_comprobante || null,
      pagado:           d.pagado !== false,
      notas:            d.notas || null,
    };
    const esUUID = d.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d.id);
    if (esUUID) {
      const { error } = await supabase.from("gastos").update(payload).eq("id", d.id);
      if (error) { alert("Error guardando gasto: " + error.message); setSaving(false); return; }
      setExpenses(prev => prev.map(e => e.id === d.id ? { ...d, ...payload } : e));
    } else {
      const { data: inserted, error } = await supabase.from("gastos").insert([payload]).select().single();
      if (error) { alert("Error guardando gasto: " + error.message); setSaving(false); return; }
      setExpenses(prev => [...prev, { ...payload, id: inserted.id }]);
    }
    setModal(null);
    setSaving(false);
  };

  // Borrar gasto individual
  const askDeleteOne = (gasto) => {
    setConfirmDelete({
      tipo: "uno",
      titulo: "¿Borrar este gasto?",
      mensaje: `Vas a borrar el gasto: "${gasto.descripcion}" por ${fmtMoney(gasto.monto)}.`,
      action: async () => {
        const esUUID = gasto.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(gasto.id);
        if (esUUID) {
          const { error } = await supabase.from("gastos").delete().eq("id", gasto.id);
          if (error) { alert("Error borrando gasto: " + error.message); return; }
        }
        setExpenses(prev => prev.filter(e => e.id !== gasto.id));
        setConfirmDelete(null);
      },
    });
  };

  // Borrar todos los gastos del filtro actual (solo webmaster)
  const askDeleteAll = () => {
    if (filtered.length === 0) {
      alert("No hay gastos en el filtro actual para borrar.");
      return;
    }
    const periodo = fMonth ? `${MONTHS[Number(fMonth)-1]} ${fYear}` : `año ${fYear}`;
    setConfirmDelete({
      tipo: "todos",
      titulo: `¿Borrar TODOS los gastos de ${periodo}?`,
      mensaje: `Vas a borrar ${filtered.length} gasto(s) por un total de ${fmtMoney(totFiltered)}.`,
      advertencia: "Esta acción es irreversible. No queda copia en ningún lado.",
      action: async () => {
        const idsUUID = filtered.map(e => e.id).filter(id =>
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
        );
        if (idsUUID.length > 0) {
          const { error } = await supabase.from("gastos").delete().in("id", idsUUID);
          if (error) { alert("Error borrando gastos: " + error.message); return; }
        }
        const idsABorrar = new Set(filtered.map(e => e.id));
        setExpenses(prev => prev.filter(e => !idsABorrar.has(e.id)));
        setConfirmDelete(null);
      },
    });
  };

  const totFiltered=filtered.reduce((s,e)=>s+e.monto,0);
  const byCat=EXPENSE_CATS.map(cat=>({cat,total:filtered.filter(e=>e.categoria===cat).reduce((s,e)=>s+e.monto,0)})).filter(x=>x.total>0).sort((a,b)=>b.total-a.total);
  return(
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select value={fMonth} onChange={e=>setFMonth(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          <option value="">Todos los meses</option>
          {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
        </select>
        <select value={fYear} onChange={e=>setFYear(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          {[2024,2025,2026].map(y=><option key={y}>{y}</option>)}
        </select>
        <select value={fCat} onChange={e=>setFCat(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          <option value="">Todas las categorías</option>
          {EXPENSE_CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        {canEdit&&<button onClick={()=>setModal(empty)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 ml-auto"><Icon d={Icons.plus} size={14}/>Nuevo gasto</button>}
        {isWebmaster&&filtered.length>0&&(
          <button
            onClick={askDeleteAll}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-100"
            title="Borrar todos los gastos visibles en el filtro actual"
          >
            <Icon d={Icons.trash} size={14}/>Borrar todos del filtro
          </button>
        )}
      </div>
      {byCat.length>0&&(
        <div className="grid grid-cols-4 gap-3">
          {byCat.map(x=>(<div key={x.cat} className="bg-white rounded-xl border border-gray-200 p-3"><p className="text-xs text-gray-400">{x.cat}</p><p className="font-bold text-sm text-red-600">{fmtMoney(x.total)}</p></div>))}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3"><p className="text-xs text-red-500 font-medium">TOTAL</p><p className="font-bold text-sm text-red-700">{fmtMoney(totFiltered)}</p></div>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{["Fecha","Descripción","Categoría","Proveedor","Comprobante","Monto","Estado",""].map(h=><th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map(e=>(
              <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">{fmtDate(e.fecha)}</td>
                <td className="px-3 py-2.5 text-xs font-medium">{e.descripcion}</td>
                <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{e.categoria}</span></td>
                <td className="px-3 py-2.5 text-xs text-gray-500">{e.proveedor||"—"}</td>
                <td className="px-3 py-2.5 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>{e.comprobante||"—"}</span>
                    {e.url_comprobante && (
                      <a href={e.url_comprobante} target="_blank" rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700" title="Ver comprobante">
                        🔗
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-xs font-semibold text-red-600">{fmtMoney(e.monto)}</td>
                <td className="px-3 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full ${e.pagado?"bg-green-50 text-green-700":"bg-amber-50 text-amber-700"}`}>{e.pagado?"Pagado":"Pendiente"}</span></td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    {canEdit&&<button onClick={()=>setModal(e)} className="text-gray-400 hover:text-blue-600" title="Editar"><Icon d={Icons.edit} size={14}/></button>}
                    {canEdit&&<button onClick={()=>askDeleteOne(e)} className="text-gray-400 hover:text-red-600" title="Borrar"><Icon d={Icons.trash} size={14}/></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div className="text-center py-8 text-gray-400 text-sm">Sin gastos</div>}
      </div>
      {modal&&<ExpenseModal data={modal} onSave={save} onClose={()=>setModal(null)}/>}
      {confirmDelete && (
        <ConfirmDeleteModal
          titulo={confirmDelete.titulo}
          mensaje={confirmDelete.mensaje}
          advertencia={confirmDelete.advertencia}
          requireTyping={confirmDelete.tipo === "todos"}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmDelete.action}
        />
      )}
    </div>
  );
}

function ExpenseModal({data,onSave,onClose}){
  const [form,setForm]=useState(data);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  return(
    <Modal title={form.id?"Editar gasto":"Nuevo gasto"} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Descripción" value={form.descripcion} onChange={f("descripcion")}/></div>
        <div>
          <label className="text-xs font-medium text-gray-600">Categoría</label>
          <select value={form.categoria} onChange={f("categoria")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            {EXPENSE_CATS.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <Field label="Monto ($)" value={form.monto} onChange={f("monto")} type="number"/>
        <Field label="Fecha" value={form.fecha} onChange={f("fecha")} type="date"/>
        <Field label="Proveedor / Beneficiario" value={form.proveedor} onChange={f("proveedor")}/>
        <Field label="N° Comprobante" value={form.comprobante} onChange={f("comprobante")}/>
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600">Link al comprobante (Drive, foto, etc.)</label>
          <div className="flex gap-2 mt-1">
            <input
              type="url"
              value={form.url_comprobante || ""}
              onChange={f("url_comprobante")}
              placeholder="https://drive.google.com/..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            />
            {form.url_comprobante && (
              <a href={form.url_comprobante} target="_blank" rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm hover:bg-blue-100"
                title="Abrir link">
                🔗 Ver
              </a>
            )}
          </div>
        </div>
        <div className="col-span-2"><Field label="Notas" value={form.notas} onChange={f("notas")}/></div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={form.pagado} onChange={e=>setForm(p=>({...p,pagado:e.target.checked}))} id="ex-pag"/>
          <label htmlFor="ex-pag" className="text-sm text-gray-600">Pagado</label>
        </div>
      </div>
      <ModalFooter onClose={onClose} onSave={()=>onSave(form)}/>
    </Modal>
  );
}

// ── MÓDULO NOTAS DE CRÉDITO ─────────────────────────────────────────────────
function CreditNotes({creditNotes, invoices, clients, canEdit, onEmitir, onDescargarPDF, onEnviarEmail}) {
  const [search, setSearch] = useState("");
  const [emitirModal, setEmitirModal] = useState(null); // factura seleccionada para emitir NC

  // Solo facturas EMITIDAS (no anuladas, no borrador) pueden recibir NC
  const facturasDisponibles = invoices.filter(i =>
    i.estado === "Emitida" && i.cae && !i.nc_id &&
    (!search ||
      i.numero?.toLowerCase().includes(search.toLowerCase()) ||
      i.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      i.cae?.includes(search))
  );

  // NCs ya emitidas, ordenadas por fecha desc
  const ncOrdenadas = [...creditNotes].sort((a,b) => (b.fecha_emision||"").localeCompare(a.fecha_emision||""));

  const fmtFechaISO = (iso) => {
    if (!iso) return "";
    const partes = iso.split("-");
    if (partes.length < 3) return iso;
    return `${partes[2].slice(0,2)}/${partes[1]}/${partes[0]}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <Icon d={Icons.creditNote} size={18} className="text-blue-600"/>
          Emitir nota de crédito
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Buscá la factura a anular por número, nombre del cliente o CAE. Solo se muestran facturas Emitidas que aún no fueron anuladas.
        </p>
        <input
          type="text"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          placeholder="Ej: B-0003-00000019, El coloso, 86183749..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 mb-3"
        />
        {search && facturasDisponibles.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No se encontraron facturas que coincidan.</p>
        )}
        {search && facturasDisponibles.length > 0 && (
          <div className="border border-gray-200 rounded-lg max-h-72 overflow-y-auto">
            {facturasDisponibles.slice(0,20).map(f => {
              const cli = clients.find(c => c.id === f.clientId);
              return (
                <div key={f.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs">{f.numero}</span>
                      <span className="text-xs text-gray-400">{f.periodo}</span>
                    </div>
                    <div className="text-sm truncate">{f.clientName}{cli?.alias ? ` — ${cli.alias}` : ""}</div>
                    <div className="text-xs text-gray-400">CAE: {f.cae}</div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="font-bold text-sm">{fmtMoney(f.total)}</div>
                    {canEdit && (
                      <button
                        onClick={()=>setEmitirModal(f)}
                        className="mt-1 px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                      >
                        Anular con NC
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {facturasDisponibles.length > 20 && (
              <div className="text-xs text-gray-400 text-center py-2">Mostrando primeras 20. Refiná la búsqueda para ver más.</div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Notas de crédito emitidas</h3>
          <span className="text-xs text-gray-400">{ncOrdenadas.length} NC</span>
        </div>
        {ncOrdenadas.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Aún no se emitieron notas de crédito.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Fecha","Número NC","Cliente","Factura anulada","Motivo","Total","CAE","PDF"].map(h=>(
                    <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ncOrdenadas.map(nc => {
                  const facturaOriginal = invoices.find(i => i.id === nc.factura_id);
                  return (
                    <tr key={nc.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-xs text-gray-500">{fmtFechaISO(nc.fecha_emision)}</td>
                      <td className="px-3 py-2.5 font-mono text-xs">{nc.numero}</td>
                      <td className="px-3 py-2.5 text-xs font-medium">{nc.clientName}</td>
                      <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{nc.factura_original_numero || "-"}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600 max-w-xs truncate" title={nc.motivo}>{nc.motivo || "-"}</td>
                      <td className="px-3 py-2.5 text-xs font-bold">{fmtMoney(nc.total)}</td>
                      <td className="px-3 py-2.5 font-mono text-xs text-gray-400">{nc.cae?.slice(0,10)}...</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={()=>onDescargarPDF(nc, facturaOriginal)}
                            className="text-gray-400 hover:text-red-600"
                            title="Descargar PDF"
                          ><Icon d={Icons.pdf} size={14}/></button>
                          <button
                            onClick={()=>onEnviarEmail(nc, facturaOriginal)}
                            className="text-gray-400 hover:text-blue-600"
                            title="Enviar por email"
                          ><Icon d={Icons.send} size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {emitirModal && (
        <EmitirNCModal
          factura={emitirModal}
          cliente={clients.find(c=>c.id===emitirModal.clientId)}
          onClose={()=>setEmitirModal(null)}
          onConfirm={async (motivo) => {
            const ok = await onEmitir(emitirModal, motivo);
            if (ok) {
              setEmitirModal(null);
              setSearch("");
            }
          }}
        />
      )}
    </div>
  );
}

// ── MODAL DE EMISIÓN DE NC ───────────────────────────────────────────────────
function EmitirNCModal({ factura, cliente, onClose, onConfirm }) {
  const [motivo, setMotivo] = useState("Errores en datos de facturación. Se reemite corregida.");
  const [confirmando, setConfirmando] = useState(false);
  const submittingRef = useRef(false);

  const motivosFrecuentes = [
    "Errores en datos de facturación. Se reemite corregida.",
    "Período facturado incorrecto. Se reemite corregida.",
    "Error en datos del cliente (domicilio/CUIT/razón social).",
    "Duplicación por error de emisión.",
    "Cancelación del servicio a pedido del cliente.",
    "Error en el monto facturado.",
    "Otro (especificar abajo)",
  ];

  const handleConfirm = async () => {
    if (submittingRef.current) return;
    if (!motivo.trim()) {
      alert("El motivo de la NC es obligatorio.");
      return;
    }
    submittingRef.current = true;
    setConfirmando(true);
    try {
      await onConfirm(motivo.trim());
    } finally {
      submittingRef.current = false;
      setConfirmando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <Icon d={Icons.creditNote} size={20} className="text-red-600"/>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">Emitir nota de crédito</h3>
            <p className="text-xs text-gray-500 mt-1">La NC anula totalmente la factura. La acción es irreversible y queda registrada en ARCA.</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1 border border-gray-200">
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Factura a anular:</span>
            <span className="font-mono font-medium">{factura.numero}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Cliente:</span>
            <span className="font-medium text-right">{factura.clientName}{cliente?.alias ? ` — ${cliente.alias}` : ""}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Período:</span>
            <span>{factura.periodo}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Total:</span>
            <span className="font-bold">{fmtMoney(factura.total)}</span>
          </div>
          <div className="flex justify-between gap-3 text-xs text-gray-400">
            <span>CAE original:</span>
            <span className="font-mono">{factura.cae}</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Motivo de la NC *</label>
          <select
            value={motivosFrecuentes.includes(motivo) ? motivo : "Otro (especificar abajo)"}
            onChange={e=>{
              if (e.target.value === "Otro (especificar abajo)") setMotivo("");
              else setMotivo(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 mb-2"
          >
            {motivosFrecuentes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            type="text"
            value={motivo}
            onChange={e=>setMotivo(e.target.value)}
            placeholder="Detalle del motivo..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
          <p className="text-xs text-gray-400 mt-1">Queda registrado en el sistema y se incluye en el PDF de la NC.</p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={confirmando}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >Cancelar</button>
          <button
            onClick={handleConfirm}
            disabled={confirmando || !motivo.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmando ? "⏳ Emitiendo NC..." : "Confirmar y emitir NC"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Reports({clients,contracts,invoices,expenses}){
  const today=new Date();
  const [fMonth,setFMonth]=useState(String(today.getMonth()+1));
  const [fYear,setFYear]=useState(String(today.getFullYear()));
  const [activeTab,setActiveTab]=useState("facturas");
  const filtInv=invoices.filter(i=>(!fMonth||i.month===Number(fMonth))&&(!fYear||i.year===Number(fYear)));
  const filtExp=expenses.filter(e=>{const d=new Date(e.fecha);return(!fMonth||d.getMonth()+1===Number(fMonth))&&(!fYear||d.getFullYear()===Number(fYear));});
  // Totales descontando facturas anuladas con NC
  const totRep = totalizarFacturas(filtInv);
  const totNeto = totRep.neto;
  const totIva = totRep.iva;
  const totFact = totRep.total;
  const totIibb = totRep.iibb;
  const totCob=filtInv.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0);
  const totAd=totFact-totCob;
  const totGastos=filtExp.reduce((s,e)=>s+e.monto,0);
  const resultado=totCob-totGastos;
  const byClient=clients.map(c=>{
    const ci=filtInv.filter(i=>i.clientId===c.id);
    const t = totalizarFacturas(ci);
    return{...c,neto:t.neto,iva:t.iva,total:t.total,iibb:t.iibb,cobrado:ci.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0),cantidad:t.cantidad,facturas:ci};
  }).filter(c=>c.total>0);
  const periodoLabel=fMonth?`${MONTHS[Number(fMonth)-1]} ${fYear}`:`Todo ${fYear}`;

  const exportExcel=()=>{
    const BOM="\uFEFF",sep=";",nl="\r\n";
    const row=(...cols)=>cols.map(c=>String(c??"-").replace(/;/g,",")).join(sep);
    let csv=BOM;
    csv+=row(`REPORTE MENSUAL DE FACTURACIÓN — ${periodoLabel.toUpperCase()}`)+nl;
    csv+=row(`Generado: ${new Date().toLocaleDateString("es-AR")}`)+nl+nl;
    csv+=row("RESUMEN GENERAL")+nl;
    csv+=row("Concepto","Monto")+nl;
    csv+=row("Neto facturado",totNeto)+nl;
    csv+=row("IVA 10.5%",totIva)+nl;
    csv+=row("Total facturado",totFact)+nl;
    csv+=row("Total cobrado",totCob)+nl;
    csv+=row("Total adeudado",totAd)+nl;
    csv+=row("Total gastos",totGastos)+nl;
    csv+=row("RESULTADO NETO",resultado)+nl+nl;
    csv+=row("DETALLE DE FACTURAS")+nl;
    csv+=row("Número","Cliente","Alias","CUIT","Tipo","Período","Neto","IVA 10.5%","Total","Estado","CAE","Fecha Pago")+nl;
    filtInv.forEach(inv=>{const client=clients.find(c=>c.id===inv.clientId);csv+=row(inv.numero,inv.clientName,client?.alias||"",client?.cuit||"",inv.tipoFactura,inv.periodo,inv.neto,inv.iva,inv.total,inv.estado,inv.cae||"",inv.fechaPago||"")+nl;});
    csv+=row("","","","","","TOTALES",totNeto,totIva,totFact)+nl+nl;
    csv+=row("RESUMEN POR CLIENTE")+nl;
    csv+=row("Cliente","Alias","CUIT","Tipo","Facturas","Neto","IVA","Total","Cobrado","Saldo")+nl;
    byClient.forEach(c=>{csv+=row(c.razonSocial,c.alias||"",c.cuit,c.tipoFactura,c.cantidad,c.neto,c.iva,c.total,c.cobrado,c.total-c.cobrado)+nl;});
    csv+=nl+row("DETALLE DE GASTOS")+nl;
    csv+=row("Fecha","Descripción","Categoría","Proveedor","Comprobante","Monto","Estado")+nl;
    filtExp.forEach(e=>{csv+=row(e.fecha,e.descripcion,e.categoria,e.proveedor||"",e.comprobante||"",e.monto,e.pagado?"Pagado":"Pendiente")+nl;});
    csv+=row("","","","","TOTAL GASTOS",totGastos)+nl;
    const base64=btoa(unescape(encodeURIComponent(csv)));
    const a=document.createElement("a");
    a.href=`data:text/csv;charset=utf-8;base64,${base64}`;
    a.download=`RadioFact_Reporte_${periodoLabel.replace(" ","_")}.csv`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);
  };

  const tabs=[{id:"facturas",label:"Facturas"},{id:"clientes",label:"Por cliente"},{id:"gastos",label:"Gastos"},{id:"iva",label:"Resumen IVA"}];
  return(
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select value={fMonth} onChange={e=>setFMonth(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          <option value="">Todo el año</option>
          {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
        </select>
        <select value={fYear} onChange={e=>setFYear(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          {[2024,2025,2026].map(y=><option key={y}>{y}</option>)}
        </select>
        <span className="text-xs text-gray-500 font-medium flex-1">📄 {periodoLabel}</span>
        <button onClick={exportExcel} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
          <Icon d={Icons.download} size={15}/>Descargar Excel
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          {label:"Total facturado",value:fmtMoney(totFact),color:"blue"},
          {label:"Total cobrado",value:fmtMoney(totCob),color:"green"},
          {label:"IVA débito fiscal",value:fmtMoney(totIva),color:"orange"},
          {label:"Resultado neto",value:fmtMoney(resultado),color:resultado>=0?"green":"red"},
        ].map(s=>(
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`font-bold text-base mt-0.5 ${s.color==="blue"?"text-blue-700":s.color==="orange"?"text-orange-600":s.color==="green"?"text-green-700":"text-red-600"}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${activeTab===t.id?"border-b-2 border-blue-600 text-blue-700":"text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
        {activeTab==="facturas"&&(
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["N° Factura","Cliente","Tipo","Período","Neto","IVA 10.5%","Total","Estado","Pago"].map(h=><th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtInv.length===0?<tr><td colSpan={9} className="text-center py-8 text-gray-400 text-sm">Sin facturas</td></tr>:
                  filtInv.map(inv=>(
                    <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-2.5 font-mono text-xs">{inv.numero}</td>
                      <td className="px-3 py-2.5 text-xs">
                        <div className="font-medium">{inv.clientName}</div>
                        {(() => {
                          const cli = clients.find(c => c.id === inv.clientId);
                          return cli?.alias ? <div className="text-xs text-gray-400">{cli.alias}</div> : null;
                        })()}
                      </td>
                      <td className="px-3 py-2.5"><span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-bold">{inv.tipoFactura}</span></td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">{inv.periodo}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600">{fmtMoney(inv.neto)}</td>
                      <td className="px-3 py-2.5 text-xs text-orange-600 font-medium">{fmtMoney(inv.iva)}</td>
                      <td className="px-3 py-2.5 text-xs font-bold">{fmtMoney(inv.total)}</td>
                      <td className="px-3 py-2.5"><EstadoBadge estado={inv.estado}/></td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">{inv.fechaPago?fmtDate(inv.fechaPago):"—"}</td>
                    </tr>
                  ))}
              </tbody>
              {filtInv.length>0&&<tfoot className="bg-gray-50 border-t-2 border-gray-300"><tr><td colSpan={4} className="px-3 py-2.5 text-xs font-bold">TOTALES</td><td className="px-3 py-2.5 text-xs font-bold">{fmtMoney(totNeto)}</td><td className="px-3 py-2.5 text-xs font-bold text-orange-700">{fmtMoney(totIva)}</td><td className="px-3 py-2.5 text-xs font-bold text-blue-700">{fmtMoney(totFact)}</td><td colSpan={2}></td></tr></tfoot>}
            </table>
          </div>
        )}
        {activeTab==="clientes"&&(
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["Cliente","CUIT","Tipo","Facturas","Neto","IVA 10.5%","Total","Cobrado","Saldo"].map(h=><th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody>
                {byClient.length===0?<tr><td colSpan={9} className="text-center py-8 text-gray-400 text-sm">Sin datos</td></tr>:
                  byClient.map(c=>(
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-sm">
                        <div className="font-medium">{c.razonSocial}</div>
                        {c.alias && <div className="text-xs text-gray-400 truncate">{c.alias}</div>}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-gray-500">{c.cuit}</td>
                      <td className="px-3 py-2.5"><span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-bold">{c.tipoFactura}</span></td>
                      <td className="px-3 py-2.5 text-xs text-center">{c.cantidad}</td>
                      <td className="px-3 py-2.5 text-xs text-gray-600">{fmtMoney(c.neto)}</td>
                      <td className="px-3 py-2.5 text-xs text-orange-600 font-medium">{fmtMoney(c.iva)}</td>
                      <td className="px-3 py-2.5 text-xs font-bold">{fmtMoney(c.total)}</td>
                      <td className="px-3 py-2.5 text-xs text-green-700">{fmtMoney(c.cobrado)}</td>
                      <td className="px-3 py-2.5 text-xs font-semibold text-red-600">{c.total-c.cobrado>0?fmtMoney(c.total-c.cobrado):"—"}</td>
                    </tr>
                  ))}
              </tbody>
              {byClient.length>0&&<tfoot className="bg-gray-50 border-t-2 border-gray-300"><tr><td colSpan={4} className="px-3 py-2.5 text-xs font-bold">TOTALES</td><td className="px-3 py-2.5 text-xs font-bold">{fmtMoney(totNeto)}</td><td className="px-3 py-2.5 text-xs font-bold text-orange-700">{fmtMoney(totIva)}</td><td className="px-3 py-2.5 text-xs font-bold text-blue-700">{fmtMoney(totFact)}</td><td className="px-3 py-2.5 text-xs font-bold text-green-700">{fmtMoney(totCob)}</td><td className="px-3 py-2.5 text-xs font-bold text-red-600">{totAd>0?fmtMoney(totAd):"—"}</td></tr></tfoot>}
            </table>
          </div>
        )}
        {activeTab==="gastos"&&(
          <div>
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-3">Por categoría</p>
              <div className="grid grid-cols-3 gap-3">
                {EXPENSE_CATS.map(cat=>{
                  const tot=filtExp.filter(e=>e.categoria===cat).reduce((s,e)=>s+e.monto,0);
                  if(!tot) return null;
                  const pct=totGastos>0?Math.round(tot/totGastos*100):0;
                  return(<div key={cat} className="bg-gray-50 rounded-lg p-3"><div className="flex justify-between mb-1"><span className="text-xs text-gray-500">{cat}</span><span className="text-xs text-gray-400">{pct}%</span></div><p className="font-bold text-sm text-red-600">{fmtMoney(tot)}</p><div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-red-400 rounded-full" style={{width:`${pct}%`}}/></div></div>);
                })}
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["Fecha","Descripción","Categoría","Proveedor","Comprobante","Monto","Estado"].map(h=><th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtExp.length===0?<tr><td colSpan={7} className="text-center py-8 text-gray-400 text-sm">Sin gastos</td></tr>:
                  filtExp.map(e=>(
                    <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-xs text-gray-500 whitespace-nowrap">{fmtDate(e.fecha)}</td>
                      <td className="px-3 py-2.5 text-xs font-medium">{e.descripcion}</td>
                      <td className="px-3 py-2.5"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{e.categoria}</span></td>
                      <td className="px-3 py-2.5 text-xs text-gray-500">{e.proveedor||"—"}</td>
                      <td className="px-3 py-2.5 text-xs font-mono text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>{e.comprobante||"—"}</span>
                    {e.url_comprobante && (
                      <a href={e.url_comprobante} target="_blank" rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700" title="Ver comprobante">
                        🔗
                      </a>
                    )}
                  </div>
                </td>
                      <td className="px-3 py-2.5 text-xs font-semibold text-red-600">{fmtMoney(e.monto)}</td>
                      <td className="px-3 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full ${e.pagado?"bg-green-50 text-green-700":"bg-amber-50 text-amber-700"}`}>{e.pagado?"Pagado":"Pendiente"}</span></td>
                    </tr>
                  ))}
              </tbody>
              {filtExp.length>0&&<tfoot className="bg-gray-50 border-t-2 border-gray-300"><tr><td colSpan={5} className="px-3 py-2.5 text-xs font-bold">TOTAL GASTOS</td><td className="px-3 py-2.5 text-xs font-bold text-red-700">{fmtMoney(totGastos)}</td><td></td></tr></tfoot>}
            </table>
          </div>
        )}
        {activeTab==="iva"&&(
          <div className="p-5 space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
              <h3 className="font-semibold text-orange-800 mb-4">📊 Resumen IVA — {periodoLabel}</h3>
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div><p className="text-xs text-orange-500 mb-1">Base imponible (neto)</p><p className="text-2xl font-bold text-orange-900">{fmtMoney(totNeto)}</p></div>
                <div><p className="text-xs text-orange-500 mb-1">IVA 10.5% débito fiscal</p><p className="text-2xl font-bold text-orange-900">{fmtMoney(totIva)}</p></div>
                <div><p className="text-xs text-orange-500 mb-1">Total con IVA</p><p className="text-2xl font-bold text-orange-900">{fmtMoney(totFact)}</p></div>
              </div>
              <p className="text-xs text-orange-400">* Entregá este resumen a tu contador para la DDJJ mensual.</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border border-gray-200">
                <tr>{["Cliente","Tipo Fac.","Neto","IVA 10.5%","Total"].map(h=><th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody>
                {byClient.map(c=>(
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5 text-sm">
                      <div className="font-medium">{c.razonSocial}</div>
                      {c.alias && <div className="text-xs text-gray-400">{c.alias}</div>}
                    </td>
                    <td className="px-3 py-2.5"><span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs font-bold">{c.tipoFactura}</span></td>
                    <td className="px-3 py-2.5 text-xs text-gray-600">{fmtMoney(c.neto)}</td>
                    <td className="px-3 py-2.5 text-xs font-bold text-orange-600">{fmtMoney(c.iva)}</td>
                    <td className="px-3 py-2.5 text-xs font-bold">{fmtMoney(c.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-orange-50 border-t-2 border-orange-300">
                <tr><td colSpan={2} className="px-3 py-2.5 text-xs font-bold text-orange-800">TOTAL</td><td className="px-3 py-2.5 text-xs font-bold text-orange-800">{fmtMoney(totNeto)}</td><td className="px-3 py-2.5 text-xs font-bold text-orange-800">{fmtMoney(totIva)}</td><td className="px-3 py-2.5 text-xs font-bold text-orange-800">{fmtMoney(totFact)}</td></tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Finance({clients,invoices,expenses}){
  const today=new Date();
  const [fMonth,setFMonth]=useState(String(today.getMonth()+1));
  const [fYear,setFYear]=useState(String(today.getFullYear()));
  const filtInv=invoices.filter(i=>(!fMonth||i.month===Number(fMonth))&&(!fYear||i.year===Number(fYear)));
  const filtExp=expenses.filter(e=>{const d=new Date(e.fecha);return(!fMonth||d.getMonth()+1===Number(fMonth))&&(!fYear||d.getFullYear()===Number(fYear));});
  // Totales descontando facturas anuladas con NC
  const totFin = totalizarFacturas(filtInv);
  const totNeto = totFin.neto;
  const totIva = totFin.iva;
  const totFact = totFin.total;
  const totIibb = totFin.iibb;
  const totCob=filtInv.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0);
  const totAd=totFact-totCob;
  const totGastos=filtExp.reduce((s,e)=>s+e.monto,0);
  const resultado=totCob-totGastos;
  const byClient=clients.map(c=>{
    const ci=filtInv.filter(i=>i.clientId===c.id);
    const t = totalizarFacturas(ci);
    return{...c,facturado:t.total,cobrado:ci.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0),neto:t.neto,iva:t.iva,facturas:ci};
  }).filter(c=>c.facturado>0);
  const morosos=byClient.filter(c=>c.cobrado<c.facturado);
  return(
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select value={fMonth} onChange={e=>setFMonth(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          <option value="">Todos los meses</option>
          {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
        </select>
        <select value={fYear} onChange={e=>setFYear(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          {[2024,2025,2026].map(y=><option key={y}>{y}</option>)}
        </select>
        {fMonth&&<span className="text-xs font-medium text-gray-500">{MONTHS[Number(fMonth)-1]} {fYear}</span>}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {label:"Neto facturado",value:fmtMoney(totNeto),sub:"sin IVA",bl:"border-l-blue-500",tv:"text-blue-700"},
          {label:"IVA 10.5% — débito fiscal",value:fmtMoney(totIva),sub:"a declarar",bl:"border-l-orange-500",tv:"text-orange-600"},
          {label:"Total cobrado",value:fmtMoney(totCob),sub:`${filtInv.filter(i=>i.estado==="Pagada").length} facturas`,bl:"border-l-green-500",tv:"text-green-700"},
          {label:"Total adeudado",value:fmtMoney(totAd),sub:`${filtInv.filter(i=>i.estado!=="Pagada").length} facturas`,bl:"border-l-red-500",tv:"text-red-600"},
        ].map(s=>(
          <div key={s.label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${s.bl} p-4`}>
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.tv}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <h3 className="font-semibold text-sm text-orange-800 mb-3">📊 Resumen IVA{fMonth?` — ${MONTHS[Number(fMonth)-1]} ${fYear}`:""}</h3>
        <div className="grid grid-cols-3 gap-6">
          <div><p className="text-xs text-orange-500">Base imponible</p><p className="font-bold text-orange-900 text-xl">{fmtMoney(totNeto)}</p></div>
          <div><p className="text-xs text-orange-500">IVA 10.5%</p><p className="font-bold text-orange-900 text-xl">{fmtMoney(totIva)}</p></div>
          <div><p className="text-xs text-orange-500">Total con IVA</p><p className="font-bold text-orange-900 text-xl">{fmtMoney(totFact)}</p></div>
        </div>
      </div>
      <div className={`rounded-xl border p-4 ${resultado>=0?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
        <h3 className={`font-semibold text-sm mb-3 ${resultado>=0?"text-green-800":"text-red-800"}`}>{resultado>=0?"✅ Resultado positivo":"⚠️ Resultado negativo"}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div><p className="text-xs text-gray-500">Cobrado</p><p className="font-bold text-green-700 text-lg">{fmtMoney(totCob)}</p></div>
          <div><p className="text-xs text-gray-500">Gastos</p><p className="font-bold text-red-600 text-lg">{fmtMoney(totGastos)}</p></div>
          <div><p className="text-xs text-gray-500">Resultado</p><p className={`font-bold text-2xl ${resultado>=0?"text-green-700":"text-red-700"}`}>{fmtMoney(resultado)}</p></div>
        </div>
      </div>
      {morosos.length>0&&(
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-sm mb-3 text-red-600 flex items-center gap-2"><Icon d={Icons.alert} size={15}/>Saldos pendientes</h3>
          {morosos.map(c=>(
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium">{c.razonSocial}{c.alias ? ` — ${c.alias}` : ""}</p>
                <p className="text-xs text-gray-400">{c.facturas.filter(i=>i.estado!=="Pagada").length} factura(s) impaga(s)</p>
              </div>
              <span className="font-bold text-red-600">{fmtMoney(c.facturado-c.cobrado)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100"><h3 className="font-semibold text-sm">Detalle por cliente</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{["Cliente","Facturas","Neto","IVA 10.5%","Total","Cobrado","Saldo"].map(h=><th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
          </thead>
          <tbody>
            {byClient.map(c=>(
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{c.razonSocial}</div>
                  {c.alias && <div className="text-xs text-gray-400">{c.alias}</div>}
                </td>
                <td className="px-4 py-3 text-xs text-center text-gray-500">{c.facturas.length}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{fmtMoney(c.neto)}</td>
                <td className="px-4 py-3 text-xs font-medium text-orange-600">{fmtMoney(c.iva)}</td>
                <td className="px-4 py-3 text-xs font-semibold">{fmtMoney(c.facturado)}</td>
                <td className="px-4 py-3 text-xs text-green-700">{fmtMoney(c.cobrado)}</td>
                <td className="px-4 py-3 text-xs font-semibold text-red-600">{c.facturado-c.cobrado>0?fmtMoney(c.facturado-c.cobrado):"—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {byClient.length===0&&<div className="text-center py-8 text-gray-400 text-sm">Sin datos</div>}
      </div>
    </div>
  );
}

function Users({users,setUsers,currentUser}){
  const [modal,setModal]=useState(null);
  const empty={name:"",email:"",password:"",role:"operator",active:true};
  const save=(data)=>{
    if(data.id) setUsers(prev=>prev.map(u=>u.id===data.id?data:u));
    else setUsers(prev=>[...prev,{...data,id:`u-${Date.now()}`}]);
    setModal(null);
  };
  const ROLE_COLORS={webmaster:"bg-purple-50 text-purple-700",admin:"bg-blue-50 text-blue-700",operator:"bg-gray-100 text-gray-600"};
  const ROLE_LABELS={webmaster:"Webmaster",admin:"Administrador",operator:"Operador"};
  return(
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={()=>setModal(empty)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"><Icon d={Icons.plus} size={14}/>Nuevo usuario</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>{["Nombre","Email","Rol","Estado",""].map(h=><th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">{h}</th>)}</tr>
          </thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.active?"bg-green-50 text-green-700":"bg-gray-100 text-gray-400"}`}>{u.active?"Activo":"Inactivo"}</span></td>
                <td className="px-4 py-3">{u.id!==currentUser.id&&<button onClick={()=>setModal(u)} className="text-gray-400 hover:text-blue-600"><Icon d={Icons.edit} size={14}/></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal&&(
        <Modal title={modal.id?"Editar usuario":"Nuevo usuario"} onClose={()=>setModal(null)}>
          <div className="space-y-3">
            <Field label="Nombre" value={modal.name} onChange={e=>setModal(p=>({...p,name:e.target.value}))}/>
            <Field label="Email" value={modal.email} onChange={e=>setModal(p=>({...p,email:e.target.value}))} type="email"/>
            <Field label="Contraseña" value={modal.password} onChange={e=>setModal(p=>({...p,password:e.target.value}))} type="password"/>
            <div>
              <label className="text-xs font-medium text-gray-600">Rol</label>
              <select value={modal.role} onChange={e=>setModal(p=>({...p,role:e.target.value}))} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                <option value="webmaster">Webmaster</option>
                <option value="admin">Administrador</option>
                <option value="operator">Operador</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={modal.active} onChange={e=>setModal(p=>({...p,active:e.target.checked}))} id="u-act"/>
              <label htmlFor="u-act" className="text-sm text-gray-600">Usuario activo</label>
            </div>
            <ModalFooter onClose={()=>setModal(null)} onSave={()=>save(modal)}/>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Settings({config,setConfig,canEdit}){
  const [form,setForm]=useState(config);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  return(
    <div className="max-w-2xl space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-sm border-b border-gray-100 pb-2">Datos de la empresa</h3>
        <Field label="Razón Social" value={form.empresa} onChange={f("empresa")}/>
        <Field label="CUIT" value={form.cuit} onChange={f("cuit")}/>
        <Field label="Domicilio" value={form.domicilio} onChange={f("domicilio")}/>
        <Field label="Email" value={form.email} onChange={f("email")}/>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-sm border-b border-gray-100 pb-2">Facturación</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Día de facturación global" value={form.diaFacturacion} onChange={f("diaFacturacion")} type="number"/>
          <Field label="Días de gracia" value={form.diasGracia} onChange={f("diasGracia")} type="number"/>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h3 className="font-semibold text-sm border-b border-gray-100 pb-2">Plantilla de email</h3>
        <p className="text-xs text-gray-400">Variables: {"{cliente}"} {"{numero}"} {"{periodo}"} {"{total}"} {"{empresa}"}</p>
        <textarea value={form.emailTemplate} onChange={f("emailTemplate")} rows={7} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none"/>
      </div>
      {canEdit&&<button onClick={()=>setConfig(form)} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Guardar configuración</button>}
    </div>
  );
}

function Modal({title,onClose,children,wide=false}){
  return(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-xl ${wide?"w-full max-w-2xl":"w-full max-w-md"} max-h-screen overflow-y-auto`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Icon d={Icons.x} size={18}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({onClose,onSave}){
  return(
    <div className="flex justify-end gap-2 mt-4">
      <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancelar</button>
      <button onClick={onSave} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
    </div>
  );
}

function Field({label,value,onChange,type="text",placeholder="",onKeyDown}){
  return(
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input value={value} onChange={onChange} type={type} placeholder={placeholder} onKeyDown={onKeyDown}
        className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"/>
    </div>
  );
}

function EstadoBadge({estado}){
  const colors={Borrador:"bg-gray-100 text-gray-600",Emitida:"bg-blue-50 text-blue-700",Pagada:"bg-green-50 text-green-700"};
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[estado]||"bg-gray-100 text-gray-600"}`}>{estado}</span>;
}

// FIX 3: corregido el JSX de FacturaDirecta - {form.email && ...} movido dentro del div space-y-2
function FacturaDirecta({clients, setClients, invoices, setInvoices, canEdit, descargarPDF, guardarFacturaSupabase}) {
  const hoy = new Date();
  const todayISO = hoy.toISOString().split("T")[0];
  const empty = {
    razonSocial:"", cuit:"", domicilio:"", condicionIVA:"Responsable Inscripto", tipoFactura:"B", email:"",
    detalle:"", montoNeto:"", concepto:2,
    clienteId:"nuevo",
    tipoPeriodo:"mes",
    mes: hoy.getMonth() + 1,
    anio: hoy.getFullYear(),
    fechaDesde: todayISO,
    fechaHasta: todayISO,
    fechaDia: todayISO,
  };
  const [form, setForm] = useState(empty);
  const [emitiendo, setEmitiendo] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [emailTexto, setEmailTexto] = useState("");
  const [enviandoEmail, setEnviandoEmail] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // Guarda sincrónica: si ya hay una emisión en curso, ignora clicks adicionales.
  // Esto cubre el gap entre el click y el setState del React (que es asíncrono).
  const submittingRef = useRef(false);

  const neto = parseFloat(form.montoNeto)||0;
  const iva = Math.round(neto*0.105*100)/100;
  const total = Math.round((neto+iva)*100)/100;

  const f = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const clienteSeleccionado = clients.find(c=>c.id===form.clienteId);

  const handleClienteChange = (id) => {
    if(id==="nuevo") {
      setForm(p=>({...p,clienteId:"nuevo",razonSocial:"",cuit:"",domicilio:"",condicionIVA:"Responsable Inscripto",tipoFactura:"B",email:""}));
    } else {
      const c = clients.find(cl=>cl.id===id);
      if(c) setForm(p=>({...p,clienteId:id,razonSocial:c.razonSocial,cuit:c.cuit,domicilio:c.domicilio,condicionIVA:c.condicionIVA,tipoFactura:c.tipoFactura,email:c.email}));
    }
  };

  const enviarEmail = async () => {
    if(!resultado?.inv) return;
    const emailDestino = resultado.clientEmail;
    if(!emailDestino) { alert("Este cliente no tiene email cargado"); return; }
    setEnviandoEmail(true);
    try {
      const inv = resultado.inv;
      const res = await fetch(`${BACKEND_URL}/enviar-email`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          numero: inv.numero,
          clientName: inv.clientName,
          clientCuit: resultado.clientCuitGuardado || inv.clientCuit || "-",
          clientDomicilio: resultado.clientDomicilioGuardado || "-",
          clientCondicionIVA: form.condicionIVA || "",
          periodo: inv.periodo,
          detalle: inv.detalle,
          neto: inv.neto,
          iva: inv.iva,
          total: inv.total,
          cae: inv.cae,
          cae_vencimiento: inv.cae_vencimiento,
          fecha: inv.fecha,
          tipoFactura: inv.tipoFactura,
          empresa: "LA VANGUARDIA NOTICIAS",
          empresaCuit: "30-71644424-0",
          empresaDomicilio: "Gobernador Gregores 1370, Caleta Olivia",
          emailDestino: emailDestino,
          emailAsunto: `Factura ${inv.numero} — ${inv.periodo}`,
          emailCuerpo: emailTexto,
        }),
      });
      const data = await res.json();
      if(data.exito) setEmailEnviado(true);
      else alert("Error al enviar: " + data.error);
    } catch(e) {
      alert("Error de conexión: " + e.message);
    }
    setEnviandoEmail(false);
  };

  const emitir = async () => {
    if(!form.razonSocial||!form.cuit||!form.detalle||!form.montoNeto) {
      alert("Completá todos los campos obligatorios");
      return;
    }
    // Guarda anti-doble-click: si ya estamos emitiendo, ignorar.
    if (submittingRef.current) {
      console.warn("Emisión ya en curso, ignorando click duplicado");
      return;
    }
    submittingRef.current = true;
    setEmitiendo(true);
    setResultado(null);

    // Registrar la operación en Supabase ANTES de llamar a ARCA.
    // Esto deja un log de auditoría y un UUID por intento.
    const cuitLimpio = form.cuit.replace(/-/g,"");
    const tipoFactura = form.tipoFactura==="A" ? 1 : 6;
    const requestPayload = {
      cuit_cliente: parseInt(cuitLimpio),
      tipo_doc: 80,
      tipo_factura: tipoFactura,
      punto_venta: 3,
      monto_neto: neto,
      monto_iva: iva,
      monto_total: total,
      concepto: parseInt(form.concepto),
      mes: form.tipoPeriodo === "mes" ? parseInt(form.mes) : null,
      anio: form.tipoPeriodo === "mes" ? parseInt(form.anio) : null,
      fch_serv_desde: form.tipoPeriodo === "rango" ? form.fechaDesde.replace(/-/g,"") : form.tipoPeriodo === "dia" ? form.fechaDia.replace(/-/g,"") : null,
      fch_serv_hasta: form.tipoPeriodo === "rango" ? form.fechaHasta.replace(/-/g,"") : form.tipoPeriodo === "dia" ? form.fechaDia.replace(/-/g,"") : null,
      cliente: form.razonSocial,
      detalle: form.detalle,
    };
    const opReg = await registrarOperacionArca("factura_directa", requestPayload);

    try {
      let data;
      if(DEBUG_MODE) {
        const fakeNum = Math.floor(Math.random()*900)+100;
        data = { exito: true, datos: { cae: `DEBUG${Date.now()}`, cae_vencimiento: "20260430", numero: fakeNum, fecha: todayStr().replace(/-/g,"") }};
        console.log("🔧 DEBUG MODE: Factura simulada, no se envió a ARCA");
      } else {
        const res = await fetch(`${BACKEND_URL}/facturar`, {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify(requestPayload),
        });
        data = await res.json();
      }

      // Marcar la operación como completada en Supabase
      await completarOperacionArca(opReg.id, data, !!data.exito);

      if(data.exito) {
        let clientId = form.clienteId !== "nuevo" ? form.clienteId : null;
        if(form.clienteId==="nuevo") {
          const {data:newClient, error:clientError} = await supabase.from("clientes").insert({
            razon_social: form.razonSocial,
            cuit: form.cuit,
            domicilio: form.domicilio || "",
            condicion_iva: form.condicionIVA,
            tipo_factura: form.tipoFactura,
            email: form.email || "",
            telefono: "",
            activo: true,
          }).select().single();
          if(clientError) console.error("Error al guardar cliente:", clientError);
          if(newClient) {
            clientId = newClient.id;
            setClients(prev=>[...prev,{
              id:newClient.id,razonSocial:form.razonSocial,cuit:form.cuit,
              domicilio:form.domicilio||"",condicionIVA:form.condicionIVA,
              tipoFactura:form.tipoFactura,email:form.email||"",
              telefono:"",active:true
            }]);
            console.log("Cliente guardado en Supabase:", newClient.id);
          }
        }

        const inv = {
          id: `inv-directa-${Date.now()}`,
          contractId: null,
          clientId: clientId,
          clientName: form.razonSocial,
          clientEmail: form.email,
          clientCuit: form.cuit,
          tipoFactura: form.tipoFactura,
          numero: `${form.tipoFactura}-0003-${String(data.datos.numero).padStart(8,"0")}`,
          month: new Date().getMonth()+1,
          year: new Date().getFullYear(),
          periodo: `${MONTHS[new Date().getMonth()]} ${new Date().getFullYear()}`,
          detalle: form.detalle,
          neto, iva, total,
          estado: "Emitida",
          cae: data.datos.cae,
          cae_vencimiento: data.datos.cae_vencimiento,
          fecha: data.datos.fecha,
          fechaPago: "",
          emailEnviado: false,
        };

        await guardarFacturaSupabase(inv, clientId).then(uuid => {
          if (uuid) inv.id = uuid;
        });
        setInvoices(prev=>[inv,...prev]);
        // Guardamos email y cuit ANTES de limpiar el form
        const clientEmail = form.email;
        const clientCuitGuardado = form.cuit;
        const clientDomicilioGuardado = form.domicilio;
        setEmailTexto(`Estimado/a ${form.razonSocial},\n\nAdjunto encontrará la factura ${inv.numero} correspondiente a:\n${form.detalle}\n\nNeto: ${fmtMoney(neto)}\nIVA 10.5%: ${fmtMoney(iva)}\nTotal: ${fmtMoney(total)}\n\nCAE: ${data.datos.cae}\n\nQuedamos a su disposición.\n\nLA VANGUARDIA NOTICIAS`);
        setEmailEnviado(false);
        // Guardamos email en resultado para poder usarlo después de limpiar el form
        setResultado({exito:true, inv, clientEmail, clientCuitGuardado, clientDomicilioGuardado});
        setForm(empty);
      } else {
        setResultado({exito:false, error:data.error});
      }
    } catch(e) {
      setResultado({exito:false, error:e.message});
      await completarOperacionArca(opReg.id, { error: e.message }, false);
    }
    setEmitiendo(false);
    submittingRef.current = false;
    setShowConfirm(false);
  };

  return(
    <div className="max-w-2xl space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-semibold text-sm border-b border-gray-100 pb-2">📋 Datos del receptor</h3>
        <div>
          <label className="text-xs font-medium text-gray-600">Cliente existente o nuevo</label>
          <select value={form.clienteId} onChange={e=>handleClienteChange(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            <option value="nuevo">➕ Nuevo cliente</option>
            {clients.filter(c=>c.active!==false).map(c=>(
              <option key={c.id} value={c.id}>
                {c.razonSocial}{c.alias ? ` — ${c.alias}` : ""} — {c.cuit}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Field label="Razón Social *" value={form.razonSocial} onChange={f("razonSocial")}/></div>
          <Field label="CUIT *" value={form.cuit} onChange={f("cuit")} placeholder="30-12345678-9"/>
          <Field label="Email" value={form.email} onChange={f("email")} type="email"/>
          <div className="col-span-2"><Field label="Domicilio" value={form.domicilio} onChange={f("domicilio")}/></div>
          <div>
            <label className="text-xs font-medium text-gray-600">Condición IVA</label>
            <select value={form.condicionIVA} onChange={f("condicionIVA")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
              {["Responsable Inscripto","Monotributista","Exento","Consumidor Final"].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Tipo Factura</label>
            <select value={form.tipoFactura} onChange={f("tipoFactura")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
              <option value="A">Factura A (Responsable Inscripto)</option>
              <option value="B">Factura B (Consumidor / Mono)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-semibold text-sm border-b border-gray-100 pb-2">💰 Datos de la factura</h3>
        <div>
          <label className="text-xs font-medium text-gray-600">Tipo de período</label>
          <select value={form.tipoPeriodo} onChange={f("tipoPeriodo")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            <option value="mes">Mes completo</option>
            <option value="rango">Rango de fechas</option>
            <option value="dia">Día puntual</option>
          </select>
        </div>
        {form.tipoPeriodo === "mes" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Mes</label>
              <select value={form.mes} onChange={f("mes")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                {MONTHS.map((m,i)=><option key={i} value={i+1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Año</label>
              <select value={form.anio} onChange={f("anio")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
                {[2024,2025,2026,2027].map(y=><option key={y}>{y}</option>)}
              </select>
            </div>
          </div>
        )}
        {form.tipoPeriodo === "rango" && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha desde" value={form.fechaDesde} onChange={f("fechaDesde")} type="date"/>
            <Field label="Fecha hasta" value={form.fechaHasta} onChange={f("fechaHasta")} type="date"/>
          </div>
        )}
        {form.tipoPeriodo === "dia" && (
          <Field label="Fecha del servicio" value={form.fechaDia} onChange={f("fechaDia")} type="date"/>
        )}
        <div>
          <label className="text-xs font-medium text-gray-600">Concepto</label>
          <select value={form.concepto} onChange={f("concepto")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            <option value={1}>Productos</option>
            <option value={2}>Servicios</option>
            <option value={3}>Productos y Servicios</option>
          </select>
        </div>
        <Field label="Descripción del servicio *" value={form.detalle} onChange={f("detalle")} placeholder="Publicidad radio — Abril 2026"/>
        <Field label="Monto neto ($) *" value={form.montoNeto} onChange={f("montoNeto")} type="number"/>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400">Neto</p>
            <p className="font-bold text-sm">{fmtMoney(neto)}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs text-orange-400">IVA 10.5%</p>
            <p className="font-bold text-sm text-orange-700">{fmtMoney(iva)}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-400">Total</p>
            <p className="font-bold text-sm text-blue-700">{fmtMoney(total)}</p>
          </div>
        </div>
      </div>

      {resultado && (
        <div className={`rounded-xl border p-4 ${resultado.exito?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
          {resultado.exito ? (
            // FIX 3: {form.email && ...} ahora está DENTRO del div space-y-2
            <div className="space-y-2">
              <p className="font-semibold text-green-800">✅ Factura emitida correctamente</p>
              <p className="text-sm text-green-700">Número: <strong>{resultado.inv.numero}</strong></p>
              <p className="text-sm text-green-700">CAE: <strong>{resultado.inv.cae}</strong></p>
              <button onClick={()=>descargarPDF(resultado.inv)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 mt-2">
                <Icon d={Icons.pdf} size={14}/>Descargar PDF
              </button>
              {resultado.clientEmail && (
                <div className="mt-4 pt-4 border-t border-green-200 space-y-2">
                  <p className="text-xs font-semibold text-green-800">📧 Enviar por email a: {resultado.clientEmail}</p>
                  <textarea
                    value={emailTexto}
                    onChange={e=>setEmailTexto(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg text-xs focus:outline-none resize-none bg-white"
                  />
                  <button
                    onClick={enviarEmail}
                    disabled={enviandoEmail || emailEnviado}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${emailEnviado?"bg-gray-100 text-gray-500":"bg-blue-600 text-white hover:bg-blue-700"} disabled:opacity-50`}
                  >
                    <Icon d={Icons.mail} size={14}/>
                    {enviandoEmail ? "Enviando..." : emailEnviado ? "✅ Email enviado" : "Enviar email con PDF"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="font-semibold text-red-800">❌ Error al emitir</p>
              <p className="text-sm text-red-700 mt-1">{resultado.error}</p>
            </div>
          )}
        </div>
      )}

      {canEdit && (
        <button
          onClick={() => {
            // Validar antes de abrir el modal
            if(!form.razonSocial||!form.cuit||!form.detalle||!form.montoNeto) {
              alert("Completá todos los campos obligatorios");
              return;
            }
            setShowConfirm(true);
          }}
          disabled={emitiendo || resultado?.exito}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {emitiendo ? "⏳ Emitiendo factura..." : resultado?.exito ? "✅ Factura emitida" : <><Icon d={Icons.send} size={16}/>Emitir Factura a ARCA</>}
        </button>
      )}
      {resultado?.exito && (
        <button onClick={()=>{setResultado(null);setForm(empty);}} className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50">
          + Nueva factura
        </button>
      )}

      {showConfirm && (
        <ConfirmEmisionModal
          titulo="¿Emitir factura a ARCA?"
          resumen={{
            "Cliente": form.razonSocial,
            "CUIT": form.cuit,
            "Tipo": `Factura ${form.tipoFactura}`,
            "Detalle": form.detalle.length > 50 ? form.detalle.slice(0,50)+"..." : form.detalle,
            "Neto": fmtMoney(neto),
            "IVA 10.5%": fmtMoney(iva),
            "Total": fmtMoney(total),
          }}
          loading={emitiendo}
          onCancel={() => { if (!emitiendo) setShowConfirm(false); }}
          onConfirm={emitir}
        />
      )}
    </div>
  );
}
