const Afip = require('node-afip');
const fs = require('fs');
const path = require('path');

console.log("🚀 INICIANDO CONEXIÓN REAL ARCA");

const afip = new Afip({
    CUIT: 30716444240,
    cert: fs.readFileSync(path.join(__dirname, '../Certificados/certificado.pfx')),
    key: fs.readFileSync(path.join(__dirname, '../Certificados/privada.key'), 'utf8'),
    production: false // cuando todo funcione cambiamos a true
});

async function test() {
    try {
        console.log("🔄 Consultando último comprobante...");

        const res = await afip.ElectronicBilling.getLastVoucher(1, 6);

        console.log("✅ CONECTADO A ARCA REAL");
        console.log("📄 Último comprobante:", res);

    } catch (err) {
        console.error("❌ ERROR:", err.message);
    }
}

test();