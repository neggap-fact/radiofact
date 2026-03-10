import { useState, useEffect, useCallback } from "react";
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
  report: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h5",
};

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const EXPENSE_CATS = ["Proveedores","Personal","Servicios","Impuestos","Alquiler","Otros"];

function fmtMoney(n) {
  return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",maximumFractionDigits:0}).format(n||0);
}
function fmtDate(d) {
  if (!d) return "-";
  const [y,m,day] = d.split("-");
  return `${day}/${m}/${y}`;
}
function todayStr() { return new Date().toISOString().split("T")[0]; }

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
useEffect(() => {
  async function testSupabase() {
    const { data, error } = await supabase
      .from("clientes")
      .select("*");

    if (error) {
      console.error("Error Supabase:", error);
    } else {
      console.log("Supabase conectado. Clientes:", data);
    }
  }

  testSupabase();
}, []);

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INIT_USERS);
  const [clients, setClients] = useState(INIT_CLIENTS);
  const [contracts, setContracts] = useState(INIT_CONTRACTS);
  const [invoices, setInvoices] = useState(INIT_INVOICES);
  const [expenses, setExpenses] = useState(INIT_EXPENSES);
  const [notifications, setNotifications] = useState([
    {id:"n1",type:"billing",month:1,year:2026,count:2,read:false,message:"2 facturas de Febrero 2026 pendientes de revisión"}
  ]);
  const [page, setPage] = useState("dashboard");
  const [config, setConfig] = useState({
    empresa:"Radio Publicidad S.A.",cuit:"30-99999999-9",
    domicilio:"Av. Principal 100, Caleta Olivia",email:"info@radiopublicidad.com.ar",
    diaFacturacion:1,diasGracia:5,
    emailTemplate:"Estimado/a {cliente},\n\nAdjunto encontrará la factura {numero} correspondiente al período {periodo}.\n\nMonto total: {total}\n\nQuedamos a su disposición.\n\nSaludos,\n{empresa}",
  });
  const [loginForm, setLoginForm] = useState({email:"",password:""});
  const [loginError, setLoginError] = useState("");

  const save = useCallback(async(data)=>{
    try{ localStorage.setItem("radiofact-v3", JSON.stringify(data)); }catch(e){}
  },[]);

  useEffect(()=>{
    try{
      const raw = localStorage.getItem("radiofact-v3");
      if(raw){
        const d = JSON.parse(raw);
        if(d.users) setUsers(d.users);
        if(d.clients) setClients(d.clients);
        if(d.contracts) setContracts(d.contracts);
        if(d.invoices) setInvoices(d.invoices);
        if(d.expenses) setExpenses(d.expenses);
        if(d.config) setConfig(d.config);
        if(d.notifications) setNotifications(d.notifications);
      }
    }catch(e){}
  },[]);

  useEffect(()=>{
    if(!currentUser) return;
    save({users,clients,contracts,invoices,expenses,config,notifications});
  },[users,clients,contracts,invoices,expenses,config,notifications]);

  const handleLogin = ()=>{
    const u = users.find(u=>u.email===loginForm.email&&u.password===loginForm.password&&u.active);
    if(u){setCurrentUser(u);setLoginError("");}
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
          <button onClick={()=>setCurrentUser(null)} className="w-full flex items-center gap-2 text-xs text-gray-500 hover:text-red-600 px-1 py-1">
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
          {page==="clients"&&<Clients clients={clients} setClients={setClients} contracts={contracts} canEdit={canEdit}/>}
          {page==="contracts"&&<Contracts contracts={contracts} setContracts={setContracts} clients={clients} canEdit={canEdit}/>}
          {page==="billing"&&<Billing clients={clients} contracts={contracts} invoices={invoices} setInvoices={setInvoices} notifications={notifications} setNotifications={setNotifications} config={config} canEdit={canEdit}/>}
          {page==="expenses"&&<Expenses expenses={expenses} setExpenses={setExpenses} canEdit={canEdit}/>}
          {page==="finance"&&<Finance clients={clients} invoices={invoices} expenses={expenses}/>}
          {page==="reports"&&<Reports clients={clients} contracts={contracts} invoices={invoices} expenses={expenses}/>}
          {page==="users"&&currentUser.role==="webmaster"&&<Users users={users} setUsers={setUsers} currentUser={currentUser}/>}
          {page==="settings"&&<Settings config={config} setConfig={setConfig} canEdit={canEdit}/>}
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
        <div className="mt-5 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600 mb-1.5">👤 Usuarios demo:</p>
          <p>admin@radio.com / admin123 → <span className="text-purple-600 font-medium">Webmaster</span></p>
          <p>maria@radio.com / maria123 → <span className="text-blue-600 font-medium">Administrador</span></p>
          <p>carlos@radio.com / carlos123 → <span className="text-gray-600 font-medium">Operador</span></p>
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
  const facturado=mi.reduce((s,i)=>s+i.total,0);
  const cobrado=mi.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0);
  const adeudado=facturado-cobrado;
  const ivaDelMes=mi.reduce((s,i)=>s+i.iva,0);
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
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-6">
        {[
          {label:"Clientes",value:clients.filter(c=>c.active).length,sub:"activos"},
          {label:"Contratos",value:contracts.filter(c=>c.active).length,sub:"vigentes"},
          {label:"Facturado",value:fmtMoney(facturado),sub:MONTHS[m-1]},
          {label:"Cobrado",value:fmtMoney(cobrado),sub:"este mes"},
          {label:"Adeudado",value:fmtMoney(adeudado),sub:"pendiente"},
          {label:"IVA del mes",value:fmtMoney(ivaDelMes),sub:"débito fiscal"},
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

function Clients({clients,setClients,contracts,canEdit}){
  const [modal,setModal]=useState(null);
  const [search,setSearch]=useState("");
  const empty={razonSocial:"",cuit:"",domicilio:"",condicionIVA:"Responsable Inscripto",tipoFactura:"A",email:"",telefono:"",active:true};
  const filtered=clients.filter(c=>c.razonSocial.toLowerCase().includes(search.toLowerCase())||c.cuit.includes(search));
  const save=(data)=>{
    if(data.id) setClients(prev=>prev.map(c=>c.id===data.id?data:c));
    else setClients(prev=>[...prev,{...data,id:`c-${Date.now()}`}]);
    setModal(null);
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
                <td className="px-3 py-2.5 font-medium text-sm">{c.razonSocial}</td>
                <td className="px-3 py-2.5 text-gray-500 font-mono text-xs">{c.cuit}</td>
                <td className="px-3 py-2.5 text-gray-500 text-xs">{c.condicionIVA}</td>
                <td className="px-3 py-2.5"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Fac.{c.tipoFactura}</span></td>
                <td className="px-3 py-2.5 text-gray-500 text-xs">{c.email}</td>
                <td className="px-3 py-2.5 text-center"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{contracts.filter(ct=>ct.clientId===c.id&&ct.active).length}</span></td>
                <td className="px-3 py-2.5"><span className={`px-2 py-0.5 rounded-full text-xs ${c.active?"bg-green-50 text-green-700":"bg-gray-100 text-gray-400"}`}>{c.active?"Activo":"Inactivo"}</span></td>
                <td className="px-3 py-2.5">{canEdit&&<button onClick={()=>setModal(c)} className="text-gray-400 hover:text-blue-600"><Icon d={Icons.edit} size={14}/></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div className="text-center py-8 text-gray-400 text-sm">Sin clientes</div>}
      </div>
      {modal&&<ClientModal data={modal} onSave={save} onClose={()=>setModal(null)}/>}
    </div>
  );
}

function ClientModal({data,onSave,onClose}){
  const [form,setForm]=useState(data);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  return(
    <Modal title={form.id?"Editar cliente":"Nuevo cliente"} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2"><Field label="Razón Social" value={form.razonSocial} onChange={f("razonSocial")}/></div>
        <Field label="CUIT" value={form.cuit} onChange={f("cuit")} placeholder="30-12345678-9"/>
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
        <div className="col-span-2"><Field label="Email" value={form.email} onChange={f("email")} type="email"/></div>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))} id="cl-act"/>
          <label htmlFor="cl-act" className="text-sm text-gray-600">Cliente activo</label>
        </div>
      </div>
      <ModalFooter onClose={onClose} onSave={()=>onSave(form)}/>
    </Modal>
  );
}

function Contracts({contracts,setContracts,clients,canEdit}){
  const [modal,setModal]=useState(null);
  const [filterClient,setFilterClient]=useState("");
  const empty={clientId:clients[0]?.id||"",descripcion:"",montoNeto:"",fechaInicio:todayStr(),duracionMeses:12,diaFacturacion:1,textoOpcional:"",active:true};
  const filtered=contracts.filter(ct=>!filterClient||ct.clientId===filterClient);
  const save=(data)=>{
    const neto=parseFloat(data.montoNeto)||0;
    const iva=Math.round(neto*0.105*100)/100;
    const d={...data,montoNeto:neto,iva,total:Math.round((neto+iva)*100)/100};
    if(d.id) setContracts(prev=>prev.map(c=>c.id===d.id?d:c));
    else setContracts(prev=>[...prev,{...d,id:`ct-${Date.now()}`}]);
    setModal(null);
  };
  return(
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <select value={filterClient} onChange={e=>setFilterClient(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          <option value="">Todos los clientes</option>
          {clients.map(c=><option key={c.id} value={c.id}>{c.razonSocial}</option>)}
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
            <div key={ct.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm">{client?.razonSocial}</span>
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
                  {canEdit&&<button onClick={()=>setModal(ct)} className="mt-1 text-gray-400 hover:text-blue-600"><Icon d={Icons.edit} size={14}/></button>}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-gray-200">Sin contratos</div>}
      </div>
      {modal&&<ContractModal data={modal} clients={clients} onSave={save} onClose={()=>setModal(null)}/>}
    </div>
  );
}

function ContractModal({data,clients,onSave,onClose}){
  const [form,setForm]=useState(data);
  const f=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const neto=parseFloat(form.montoNeto)||0;
  const iva=Math.round(neto*0.105*100)/100;
  return(
    <Modal title={form.id?"Editar contrato":"Nuevo contrato"} onClose={onClose} wide>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600">Cliente</label>
          <select value={form.clientId} onChange={f("clientId")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            {clients.map(c=><option key={c.id} value={c.id}>{c.razonSocial}</option>)}
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
        <Field label="Fecha inicio" value={form.fechaInicio} onChange={f("fechaInicio")} type="date"/>
        <div>
          <label className="text-xs font-medium text-gray-600">Duración</label>
          <select value={form.duracionMeses} onChange={f("duracionMeses")} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
            {[1,3,6,12,24].map(o=><option key={o} value={o}>{o} meses</option>)}
          </select>
        </div>
        <Field label="Día de facturación" value={form.diaFacturacion} onChange={f("diaFacturacion")} type="number"/>
        <Field label="Texto opcional (OC, expediente...)" value={form.textoOpcional} onChange={f("textoOpcional")}/>
        <div className="col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={form.active} onChange={e=>setForm(p=>({...p,active:e.target.checked}))} id="ct-act"/>
          <label htmlFor="ct-act" className="text-sm text-gray-600">Contrato activo</label>
        </div>
      </div>
      <ModalFooter onClose={onClose} onSave={()=>onSave(form)}/>
    </Modal>
  );
}

function Billing({clients,contracts,invoices,setInvoices,notifications,setNotifications,config,canEdit}){
  const today=new Date();
  const [selMonth,setSelMonth]=useState(today.getMonth());
  const [selYear,setSelYear]=useState(today.getFullYear());
  const [reviewModal,setReviewModal]=useState(null);
  const [emailModal,setEmailModal]=useState(null);
  const billMonth=selMonth===0?11:selMonth-1;
  const billYear=selMonth===0?selYear-1:selYear;
  const pendingContracts=contracts.filter(ct=>{
    if(!ct.active) return false;
    return !invoices.find(inv=>inv.contractId===ct.id&&inv.month===billMonth+1&&inv.year===billYear);
  });
  const monthInvoices=invoices.filter(i=>i.month===billMonth+1&&i.year===billYear);
  const totNeto=monthInvoices.reduce((s,i)=>s+i.neto,0);
  const totIva=monthInvoices.reduce((s,i)=>s+i.iva,0);
  const totTotal=monthInvoices.reduce((s,i)=>s+i.total,0);
  const buildInvoice=(ct,extraText="")=>{
    const client=clients.find(c=>c.id===ct.clientId);
    const num=String(invoices.length+1).padStart(8,"0");
    const periodo=`${MONTHS[billMonth]} ${billYear}`;
    const detail=`${ct.descripcion} — Período: ${periodo}${ct.textoOpcional?" — "+ct.textoOpcional:""}${extraText?" — "+extraText:""}`;
    return{id:`inv-${Date.now()}-${Math.random()}`,contractId:ct.id,clientId:ct.clientId,clientName:client?.razonSocial,clientEmail:client?.email,tipoFactura:client?.tipoFactura,numero:`${client?.tipoFactura}-0001-${num}`,month:billMonth+1,year:billYear,periodo,detalle:detail,neto:ct.montoNeto,iva:ct.iva,total:ct.total,estado:"Emitida",cae:"",fechaPago:"",emailEnviado:false,emitida:new Date().toISOString()};
  };
  const approveAndEmit=(contractIds,texts={})=>{
    const newInvoices=contractIds.map(ctId=>{const ct=contracts.find(c=>c.id===ctId);return buildInvoice(ct,texts[ctId]||"");});
    setInvoices(prev=>[...prev,...newInvoices]);
    setNotifications(prev=>prev.map(n=>({...n,read:true})));
    setReviewModal(null);
  };
  const updateInvoice=(id,data)=>setInvoices(prev=>prev.map(i=>i.id===id?{...i,...data}:i));
  return(
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select value={selMonth} onChange={e=>setSelMonth(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          {MONTHS.map((m,i)=><option key={i} value={i}>{m}</option>)}
        </select>
        <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none">
          {[2024,2025,2026].map(y=><option key={y}>{y}</option>)}
        </select>
        <span className="text-xs text-gray-500">Período: <strong>{MONTHS[billMonth]} {billYear}</strong></span>
      </div>
      {monthInvoices.length>0&&(
        <div className="grid grid-cols-3 gap-3">
          {[{label:"Neto",value:fmtMoney(totNeto),cls:"bg-gray-50 border-gray-200",txt:"text-gray-700"},{label:"IVA 10.5%",value:fmtMoney(totIva),cls:"bg-orange-50 border-orange-200",txt:"text-orange-700"},{label:"Total",value:fmtMoney(totTotal),cls:"bg-blue-50 border-blue-200",txt:"text-blue-700"}].map(s=>(
            <div key={s.label} className={`rounded-xl border p-3 ${s.cls}`}>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`font-bold text-base ${s.txt}`}>{s.value}</p>
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
              <p className="text-xs text-amber-600">{MONTHS[billMonth]} {billYear}</p>
            </div>
          </div>
          <button onClick={()=>setReviewModal(pendingContracts)} className="bg-amber-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-amber-700 flex-shrink-0">Revisar y aprobar</button>
        </div>
      )}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Facturas — {MONTHS[billMonth]} {billYear}</h3>
          <span className="text-xs text-gray-400">{monthInvoices.length} facturas</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>{["Número","Cliente","Neto","IVA","Total","Estado","CAE",""].map(h=><th key={h} className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {monthInvoices.map(inv=>(
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-mono text-xs">{inv.numero}</td>
                  <td className="px-3 py-2.5 text-xs font-medium">{inv.clientName}</td>
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
                    <button onClick={()=>setEmailModal(inv)} className={`${inv.emailEnviado?"text-green-500":"text-gray-400 hover:text-blue-600"}`}>
                      <Icon d={Icons.mail} size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {monthInvoices.length===0&&<div className="text-center py-8 text-gray-400 text-sm">Sin facturas para este período</div>}
      </div>
      {reviewModal&&<ReviewModal contracts={reviewModal} clients={clients} onApprove={approveAndEmit} onClose={()=>setReviewModal(null)}/>}
      {emailModal&&<EmailModal invoice={emailModal} config={config} onClose={()=>setEmailModal(null)} onSent={()=>{updateInvoice(emailModal.id,{emailEnviado:true});setEmailModal(null);}}/>}
    </div>
  );
}

function ReviewModal({contracts,clients,onApprove,onClose}){
  const [texts,setTexts]=useState({});
  const [sel,setSel]=useState(contracts.map(c=>c.id));
  const toggle=id=>setSel(prev=>prev.includes(id)?prev.filter(i=>i!==id):[...prev,id]);
  const selTotal=contracts.filter(c=>sel.includes(c.id)).reduce((s,c)=>s+c.total,0);
  return(
    <Modal title="Revisión previa a facturación" onClose={onClose} wide>
      <div className="mb-3 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">Revisá cada contrato antes de aprobar.</div>
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {contracts.map(ct=>{
          const client=clients.find(c=>c.id===ct.clientId);
          const checked=sel.includes(ct.id);
          return(
            <div key={ct.id} className={`border rounded-lg p-3 transition-all ${checked?"border-blue-300 bg-blue-50":"border-gray-200"}`}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={checked} onChange={()=>toggle(ct.id)} className="mt-1"/>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{client?.razonSocial}</p>
                    <span className="font-bold text-blue-700">{fmtMoney(ct.total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{ct.descripcion}</p>
                  <div className="flex gap-3 text-xs text-gray-400 mb-2">
                    <span>Neto: {fmtMoney(ct.montoNeto)}</span>
                    <span>IVA: {fmtMoney(ct.iva)}</span>
                  </div>
                  <input value={texts[ct.id]||ct.textoOpcional||""} onChange={e=>setTexts(p=>({...p,[ct.id]:e.target.value}))}
                    placeholder="Texto adicional (OC, expediente...)"
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-300"/>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">{sel.length}/{contracts.length} · <span className="font-semibold text-blue-700">{fmtMoney(selTotal)}</span></div>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancelar</button>
          <button onClick={()=>onApprove(sel,texts)} disabled={sel.length===0} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 flex items-center gap-2">
            <Icon d={Icons.check} size={14}/>Emitir {sel.length} factura(s)
          </button>
        </div>
      </div>
    </Modal>
  );
}

function EmailModal({invoice,config,onClose,onSent}){
  const body=config.emailTemplate.replace("{cliente}",invoice.clientName).replace("{numero}",invoice.numero).replace("{periodo}",invoice.periodo).replace("{total}",fmtMoney(invoice.total)).replace("{empresa}",config.empresa);
  const [msg,setMsg]=useState(body);
  const [sending,setSending]=useState(false);
  const send=()=>{setSending(true);setTimeout(()=>{setSending(false);onSent();},1500);};
  return(
    <Modal title="Enviar factura por email" onClose={onClose} wide>
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg text-xs space-y-1">
          <p><strong>Para:</strong> {invoice.clientEmail}</p>
          <p><strong>Asunto:</strong> Factura {invoice.numero} — {invoice.periodo}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Cuerpo del mensaje</label>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={7} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none resize-none"/>
        </div>
        <div className="p-2 bg-blue-50 rounded text-xs text-blue-600">📎 PDF adjunto automáticamente</div>
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

function Expenses({expenses,setExpenses,canEdit}){
  const [modal,setModal]=useState(null);
  const [fMonth,setFMonth]=useState(String(new Date().getMonth()+1));
  const [fYear,setFYear]=useState(String(new Date().getFullYear()));
  const [fCat,setFCat]=useState("");
  const empty={descripcion:"",categoria:"Proveedores",monto:"",fecha:todayStr(),proveedor:"",comprobante:"",pagado:true,notas:""};
  const filtered=expenses.filter(e=>{const d=new Date(e.fecha);return(!fMonth||d.getMonth()+1===Number(fMonth))&&(!fYear||d.getFullYear()===Number(fYear))&&(!fCat||e.categoria===fCat);});
  const save=(data)=>{
    const d={...data,monto:parseFloat(data.monto)||0};
    if(d.id) setExpenses(prev=>prev.map(e=>e.id===d.id?d:e));
    else setExpenses(prev=>[...prev,{...d,id:`ex-${Date.now()}`}]);
    setModal(null);
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
                <td className="px-3 py-2.5 text-xs font-mono text-gray-400">{e.comprobante||"—"}</td>
                <td className="px-3 py-2.5 text-xs font-semibold text-red-600">{fmtMoney(e.monto)}</td>
                <td className="px-3 py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full ${e.pagado?"bg-green-50 text-green-700":"bg-amber-50 text-amber-700"}`}>{e.pagado?"Pagado":"Pendiente"}</span></td>
                <td className="px-3 py-2.5">{canEdit&&<button onClick={()=>setModal(e)} className="text-gray-400 hover:text-blue-600"><Icon d={Icons.edit} size={14}/></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&<div className="text-center py-8 text-gray-400 text-sm">Sin gastos</div>}
      </div>
      {modal&&<ExpenseModal data={modal} onSave={save} onClose={()=>setModal(null)}/>}
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

function Reports({clients,contracts,invoices,expenses}){
  const today=new Date();
  const [fMonth,setFMonth]=useState(String(today.getMonth()+1));
  const [fYear,setFYear]=useState(String(today.getFullYear()));
  const [activeTab,setActiveTab]=useState("facturas");
  const filtInv=invoices.filter(i=>(!fMonth||i.month===Number(fMonth))&&(!fYear||i.year===Number(fYear)));
  const filtExp=expenses.filter(e=>{const d=new Date(e.fecha);return(!fMonth||d.getMonth()+1===Number(fMonth))&&(!fYear||d.getFullYear()===Number(fYear));});
  const totNeto=filtInv.reduce((s,i)=>s+i.neto,0);
  const totIva=filtInv.reduce((s,i)=>s+i.iva,0);
  const totFact=filtInv.reduce((s,i)=>s+i.total,0);
  const totCob=filtInv.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0);
  const totAd=totFact-totCob;
  const totGastos=filtExp.reduce((s,e)=>s+e.monto,0);
  const resultado=totCob-totGastos;
  const byClient=clients.map(c=>{const ci=filtInv.filter(i=>i.clientId===c.id);return{...c,neto:ci.reduce((s,i)=>s+i.neto,0),iva:ci.reduce((s,i)=>s+i.iva,0),total:ci.reduce((s,i)=>s+i.total,0),cobrado:ci.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0),cantidad:ci.length,facturas:ci};}).filter(c=>c.total>0);
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
    csv+=row("Número","Cliente","CUIT","Tipo","Período","Neto","IVA 10.5%","Total","Estado","CAE","Fecha Pago")+nl;
    filtInv.forEach(inv=>{const client=clients.find(c=>c.id===inv.clientId);csv+=row(inv.numero,inv.clientName,client?.cuit||"",inv.tipoFactura,inv.periodo,inv.neto,inv.iva,inv.total,inv.estado,inv.cae||"",inv.fechaPago||"")+nl;});
    csv+=row("","","","","TOTALES",totNeto,totIva,totFact)+nl+nl;
    csv+=row("RESUMEN POR CLIENTE")+nl;
    csv+=row("Cliente","CUIT","Tipo","Facturas","Neto","IVA","Total","Cobrado","Saldo")+nl;
    byClient.forEach(c=>{csv+=row(c.razonSocial,c.cuit,c.tipoFactura,c.cantidad,c.neto,c.iva,c.total,c.cobrado,c.total-c.cobrado)+nl;});
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
            <p className={`font-bold text-base mt-0.5 ${s.color==="blue"?"text-blue-700":s.color==="orange"?"text-orange-600":"text-green-700"===s.color?"text-green-700":"text-red-600"}`}>{s.value}</p>
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
                      <td className="px-3 py-2.5 text-xs font-medium">{inv.clientName}</td>
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
                      <td className="px-3 py-2.5 font-medium text-sm">{c.razonSocial}</td>
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
                      <td className="px-3 py-2.5 text-xs font-mono text-gray-400">{e.comprobante||"—"}</td>
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
                    <td className="px-3 py-2.5 text-sm font-medium">{c.razonSocial}</td>
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
  const totNeto=filtInv.reduce((s,i)=>s+i.neto,0);
  const totIva=filtInv.reduce((s,i)=>s+i.iva,0);
  const totFact=filtInv.reduce((s,i)=>s+i.total,0);
  const totCob=filtInv.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0);
  const totAd=totFact-totCob;
  const totGastos=filtExp.reduce((s,e)=>s+e.monto,0);
  const resultado=totCob-totGastos;
  const byClient=clients.map(c=>{const ci=filtInv.filter(i=>i.clientId===c.id);return{...c,facturado:ci.reduce((s,i)=>s+i.total,0),cobrado:ci.filter(i=>i.estado==="Pagada").reduce((s,i)=>s+i.total,0),neto:ci.reduce((s,i)=>s+i.neto,0),iva:ci.reduce((s,i)=>s+i.iva,0),facturas:ci};}).filter(c=>c.facturado>0);
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
              <div><p className="text-sm font-medium">{c.razonSocial}</p><p className="text-xs text-gray-400">{c.facturas.filter(i=>i.estado!=="Pagada").length} factura(s) impaga(s)</p></div>
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
                <td className="px-4 py-3 font-medium text-sm">{c.razonSocial}</td>
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