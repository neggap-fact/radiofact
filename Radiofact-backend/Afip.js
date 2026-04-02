const { Afip } = require('node-afip');
const fs = require('fs');

console.log("🚀 INICIANDO CONEXIÓN REAL ARCA");

const afip = new Afip({
  CUIT: 30716444240,
  cert: fs.readFileSync('../Certificados/certificado.pfx'),
  key: "Octavio0",
  production: false // después lo pasamos a true
});

async function test() {
  try {
    console.log("👉 Consultando último comprobante...");

    const res = await afip.ElectronicBilling.getLastVoucher(1, 6);

    console.log("✅ CONECTADO A ARCA REAL");
    console.log("📄 Último comprobante:", res);

  } catch (err) {
    console.error("❌ ERROR REAL:");
    console.error(err);
  }
}

test();