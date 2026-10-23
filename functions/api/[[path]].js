/* Auditor CSU · API de Trabajos de Laboratorio y del ingreso (Cloudflare Pages Functions + D1)
   Ingreso: RUT + PIN. Usuarios: PIN = su RUT (sin puntos, con guion). Administrador: RUT de ADMIN_RUT + PIN secreto ADMIN_PIN.
   Roles: administrativo | clinico | estudiante | laboratorio. */
import CFG_BASE from "../_cfg_base.js";
/* Aranceles 2026 Laboratorio Cecilia Cerna Hernández (PDF ARANCELES_2026; el documento no trae plazos de entrega) */
/* arancel 2026 Laboratorio Vi-Dent (PDF del laboratorio): 4 días hábiles promedio; implantes con impresión convencional 6; prótesis ad-modum con estructura metálica 20 */
const VIDENT = [{"n": "VACIADO YESO EXTRADURO (tipo IV)", "a": 4000, "nota": "por arcada", "c": "VACIADOS", "p": 4}, {"n": "VACIADO YESO EXTRADURO (con encía artificial)", "a": 15000, "nota": "por arcada", "c": "VACIADOS", "p": 4}, {"n": "MODELO DE YESO SISTEMA DOWELL PIN", "a": 5000, "nota": "por arcada", "c": "VACIADOS", "p": 4}, {"n": "Escaneo de Modelos (DIGITAL)", "a": 15000, "nota": "por arcada · modelo digital: envío STL con antagonista y modelos en oclusión", "c": "VACIADOS", "p": 4}, {"n": "ENCERADO DIAGNOSTICO POR PIEZA", "a": 8000, "nota": "por pieza", "c": "CERAS", "p": 4}, {"n": "CUBETA PARA BLANQUEAMIENTO \"CON ESPACIADOR\"", "a": 15000, "nota": "por arcada", "c": "ESTAMPADO", "p": 4}, {"n": "ESTAMPADO O PLANO DE CONTENCION (ACETATO)", "a": 32000, "nota": "por arcada", "c": "ESTAMPADO", "p": 4}, {"n": "PLANO DURO BLANDO SISTEMA ERKOFORM 3D", "a": 45000, "nota": "por arcada", "c": "ESTAMPADO", "p": 4}, {"n": "ESPIGA MUÑON COLADO", "a": 35000, "nota": "por pieza", "c": "PERNOS", "p": 4}, {"n": "SOPORTE RADICULAR (SOCHAPA)", "a": 20000, "nota": "por pieza", "c": "PERNOS", "p": 4}, {"n": "CORONA PROVISORIA ACRILICO", "a": 15000, "nota": "por pieza", "c": "PROVISORIOS", "p": 4}, {"n": "CORONA TEMPORAL SOBRE IMPLANTE \"SIN ADITAMENTO\"", "a": 20000, "nota": "por pieza", "c": "PROVISORIOS", "p": 4}, {"n": "INCRUSTACION INLAY/ONLAY EN METAL", "a": 40000, "nota": "por pieza", "c": "INCRUSTACIONES", "p": 4}, {"n": "INCRUSTACION INLAY/ONLAY EN CERAMICA (inyectado o Cerec Ivoclar)", "a": 75000, "nota": "por pieza", "c": "INCRUSTACIONES", "p": 4}, {"n": "INCRUSTACION INLAY/ONLAY EN CERAMICA (DIGITAL)", "a": 75000, "nota": "por pieza · modelo digital: envío STL con antagonista y modelos en oclusión", "c": "INCRUSTACIONES", "p": 4}, {"n": "INCRUSTACION INLAY/ONLAY EN RESINA", "a": 40000, "nota": "por pieza", "c": "INCRUSTACIONES", "p": 4}, {"n": "INCRUSTACION INLAY/ONLAY FELDESPATICA PURA (Cerec Vita)", "a": 80000, "nota": "por pieza", "c": "INCRUSTACIONES", "p": 4}, {"n": "INCRUSTACION INLAY/ONLAY FELDESPATICA PURA (DIGITAL)", "a": 80000, "nota": "por pieza · modelo digital: envío STL con antagonista y modelos en oclusión", "c": "INCRUSTACIONES", "p": 4}, {"n": "CARILLA CEROMERO", "a": 42000, "nota": "por pieza", "c": "INCRUSTACIONES", "p": 4}, {"n": "CORONAS PERIFERICAS CEROMEROS", "a": 47000, "nota": "por pieza", "c": "INCRUSTACIONES", "p": 4}, {"n": "CORONA DE PORCELANA SOBRE METAL", "a": 65000, "nota": "por pieza", "c": "METAL", "p": 4}, {"n": "CORONA INTERMEDIARIO EN P.FIJA PLURAL PORCELANA SOBRE METAL", "a": 65000, "nota": "por pieza", "c": "METAL", "p": 4}, {"n": "INCRUSTACION METALICA COMO INSERCION PFP", "a": 45000, "nota": "por pieza", "c": "METAL", "p": 4}, {"n": "CORONA INSERCION PROTESIS FIJA PLURAL PORCELANA SOBRE METAL", "a": 72500, "nota": "por pieza", "c": "METAL", "p": 4}, {"n": "APOYO METALICO", "a": 5000, "nota": "por pieza", "c": "METAL", "p": 4}, {"n": "APOYO METALICO PARA MERYLAN", "a": 20000, "nota": "por pieza", "c": "METAL", "p": 4}, {"n": "FRESADO PALATINO", "a": 15000, "nota": "por pieza", "c": "METAL", "p": 4}, {"n": "CORONA INSERCION PROTESIS FIJA PLURAL LIBRE DE METAL", "a": 70000, "nota": "por pieza", "c": "LIBRE METAL", "p": 4}, {"n": "CORONA INTERMEDIARIO EN P.FIJA PLURAL LIBRE DE METAL", "a": 70000, "nota": "por pieza", "c": "LIBRE METAL", "p": 4}, {"n": "CORONA DE PORCELANA PURA (inyectado o Cerec Ivoclar )", "a": 85000, "nota": "por pieza", "c": "LIBRE METAL", "p": 4}, {"n": "CORONA DE PORCELANA PURA (DIGITAL)", "a": 85000, "nota": "por pieza · modelo digital: envío STL con antagonista y modelos en oclusión", "c": "LIBRE METAL", "p": 4}, {"n": "CORONA CERAMICA FELDESPATICA PURA o monolitica (Cerec Vita)", "a": 80000, "nota": "por pieza", "c": "LIBRE METAL", "p": 4}, {"n": "CORONA CERAMICA FELDESPATICA PURA (DIGITAL)", "a": 80000, "nota": "por pieza · modelo digital: envío STL con antagonista y modelos en oclusión", "c": "LIBRE METAL", "p": 4}, {"n": "CARILLA CERAMICA", "a": 80000, "nota": "por pieza", "c": "LIBRE METAL", "p": 4}, {"n": "HOMBRO CERAMICO", "a": 15000, "nota": "por pieza", "c": "CERAMICA", "p": 4}, {"n": "CORONA SOBRE IMPLANTE \"SOBRE METAL CERAMICA SIN ADITAMENTO\" CEMENTADA", "a": 90000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "CORONA SOBRE IMPLANTE \"SOBRE METAL CERAMICA SIN ADITAMENTO\" ATORNILLADA", "a": 99000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "INTERMEDIARIO SOBRE IMPLANTE METAL", "a": 65000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "PILAR PERSONALIZADO SOBRE IMPLANTE \"COLADO\" METAL", "a": 70000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "CORONA SOBRE IMPLANTE \"LIBRE METAL SIN ADITAMENTO\" ATORNILLADA", "a": 105000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "CORONA SOBRE IMPLANTE \"LIBRE METAL SIN ADITAMENTO\" CEMENTADA", "a": 99000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "INTERMEDIARIO SOBRE IMPLANTE LIBRE METAL", "a": 70000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "PILAR PERSONALIZADO SOBRE IMPLANTE LIBRE METAL", "a": 75000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "CORONA SOBRE IMPLANTE \"CERAMICA PURA SIN ADITAMENTO\" cementada", "a": 110000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "CORONA SOBRE IMPLANTE \"CERAMICA PURA SIN ADITAMENTO\" cementado/Atornillada", "a": 115000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "INTERMEDIARIO SOBRE IMPLANTE CERAMICA PURA", "a": 85000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "PILAR PERSONALIZADO SOBRE IMPLANTE CERAMICA PURA", "a": 85000, "nota": "por pieza · no incluye aditamentos", "c": "IMPLANTES", "p": 6}, {"n": "PROTESIS TOTAL AD-MODUM (Estructura Metal, Terminación acrílica con dientes Nacionales, 1 cubeta y 1 rodete)", "a": 550000, "nota": "por arcada", "c": "IMPLANTES", "p": 20}];
const CERNA = [{"n": "PROVISORIO ACRILICO","a": 15000,"nota": "cód. 1001","c": "PROVISIONALES"},{"n": "PROVISORIO ACRILICO SOBRE IMPLANTE (SIN ADITAMENTOS)","a": 25000,"nota": "cód. 1002","c": "PROVISIONALES"},{"n": "PROVISORIO IMPRESO","a": 30000,"nota": "cód. 1003","c": "PROVISIONALES"},{"n": "PROVISORIO IMPRESO SOBRE IMPLANTES (SIN ADITAMENTOS)","a": 35000,"nota": "cód. 1004","c": "PROVISIONALES"},{"n": "PROVISORIO PMMA","a": 20000,"nota": "cód. 1005","c": "PROVISIONALES"},{"n": "PROVISORIO PMMA SOBRE IMPLANTE (SIN ADITAMENTOS)","a": 30000,"nota": "cód. 1006","c": "PROVISIONALES"},{"n": "BARRA PROVISORIA TERMINADA (SIN ADITAMENTOS)","a": 150000,"nota": "cód. 1007","c": "PROVISIONALES"},{"n": "CORONA ZIRCONIO TRANSLUCIDO SOBRE MUÑON","a": 80000,"nota": "cód. 2001","c": "CORONAS"},{"n": "CORONA ZIRCONIO SOBRE IMPLANTE (SIN ADITAMENTOS)","a": 105000,"nota": "cód. 2002 · incluye fresado de pilar si es necesario y cementación","c": "CORONAS"},{"n": "CORONA DISILICATO DE LITIO","a": 95000,"nota": "cód. 2003","c": "CORONAS"},{"n": "CORONA SOBRE IMPLANTE ZIRCONIO CON CARGA CERAMICA EMAX (SIN ADITAMENTOS)","a": 115000,"nota": "cód. 2004 · incluye fresado de pilar y cementación si es necesario","c": "CORONAS"},{"n": "CORONA METAL CERAMICA SOBRE MUÑON","a": 65000,"nota": "cód. 2005","c": "CORONAS"},{"n": "CORONA METAL CERAMICA SOBRE IMPLANTE (SIN ADITAMENTOS)","a": 95000,"nota": "cód. 2006 · incluye fresado de pilar si es necesario y cementación","c": "CORONAS"},{"n": "CORONA METAL CERAMICA SOBRE MUÑON CON HOMBRO CERAMICO","a": 70000,"nota": "cód. 2007","c": "CORONAS"},{"n": "CORONA METALICA CON FRENTE ESTETICO","a": 60000,"nota": "cód. 2008","c": "CORONAS"},{"n": "CORONA METALICA PULIDA","a": 55000,"nota": "cód. 2009","c": "CORONAS"},{"n": "CORONA METAL CERAMICA DE SUSTITUCIÓN","a": 95000,"nota": "cód. 2010","c": "CORONAS"},{"n": "CERAMICA DE ENCIA POR PIEZA (SOBRE METAL O ZIRCONIO)","a": 6000,"nota": "cód. 2011","c": "CORONAS"},{"n": "CORONA DE RESINA (CEROMERO)","a": 45000,"nota": "cód. 2012","c": "CORONAS"},{"n": "CORONA DE RESINA IMPRESA CROWN","a": 55000,"nota": "cód. 2013","c": "CORONAS"},{"n": "CARILLAS RESINA (CEROMERO)","a": 30000,"nota": "cód. 2014","c": "CARILLAS"},{"n": "CARILLA RESINA IMPRESA CROWM","a": 40000,"nota": "cód. 2015","c": "CARILLAS"},{"n": "CARILLA DISILICATO DE LITIO","a": 70000,"nota": "cód. 2017","c": "CARILLAS"},{"n": "CARILLA ZIRCONIO TRANSLUCIDO","a": 60000,"nota": "cód. 2018","c": "CARILLAS"},{"n": "INCRUSTACION EN RESINA (CEROMERO)","a": 35000,"nota": "cód. 2019","c": "INCRUSTACIONES"},{"n": "INCRUSTACION EN RESINA IMPRESA CROWN","a": 55000,"nota": "cód. 2020","c": "INCRUSTACIONES"},{"n": "INCRUSTACION EN ZIRCONIO TRANSLUCIDO","a": 60000,"nota": "cód. 2021","c": "INCRUSTACIONES"},{"n": "INCRUSTACION EN DISILICATO DE LITIO","a": 75000,"nota": "cód. 2022","c": "INCRUSTACIONES"},{"n": "INCRUSTACION METALICA","a": 40000,"nota": "cód. 2023","c": "INCRUSTACIONES"},{"n": "ENDOCROWN RESINA (CEROMERO)","a": 50000,"nota": "cód. 2024","c": "ENDOCROWN"},{"n": "ENDOCROWN ZIRCONIO TRANSLUCIDO","a": 90000,"nota": "cód. 2025","c": "ENDOCROWN"},{"n": "ENDOCROWN METAL PULIDO","a": 70000,"nota": "cód. 2026","c": "ENDOCROWN"},{"n": "ENDOCROWN RESINA IMPRESA","a": 65000,"nota": "cód. 2027","c": "ENDOCROWN"},{"n": "ENDOCROWN DISILICATO DE LITIO","a": 95000,"nota": "cód. 2028","c": "ENDOCROWN"},{"n": "MODELO DE ESTUDIO CONVENCIONAL (YESO)","a": 5000,"nota": "cód. 3001","c": "IMPRESIÓN DE ESTUDIO PARA DIAGNÓSTICO"},{"n": "MODELO IMPRESO POR EMIARCADA","a": 5000,"nota": "cód. 3002","c": "IMPRESIÓN DE ESTUDIO PARA DIAGNÓSTICO"},{"n": "MODELO IMPRESO POR EMIARCADA CON ENCIA","a": 8000,"nota": "cód. 3003","c": "IMPRESIÓN DE ESTUDIO PARA DIAGNÓSTICO"},{"n": "ENCERADO DIAGNOSTICO CONVENCIONAL POR PZA (CERA)","a": 5000,"nota": "cód. 3004","c": "IMPRESIÓN DE ESTUDIO PARA DIAGNÓSTICO"},{"n": "ENCERADO DIAGNOSTICO DIGITAL POR PZA","a": 3000,"nota": "cód. 3005","c": "IMPRESIÓN DE ESTUDIO PARA DIAGNÓSTICO"},{"n": "IMPRESIÓN DE GUIA QUIRURGICA","a": 15000,"nota": "cód. 3006","c": "IMPRESIÓN DE ESTUDIO PARA DIAGNÓSTICO"},{"n": "IMPRESIÓN DE PLANO DISEÑO DIGITAL (DISEÑO EXTERNO AL LABORATORIO)","a": 40000,"nota": "cód. 3007","c": "IMPRESIÓN DE ESTUDIO PARA DIAGNÓSTICO"},{"n": "PLANO IMPRESO (DISEÑO DIGITAL ECHO EN LABORATORIO)","a": 50000,"nota": "cód. 3008","c": "IMPRESIÓN DE ESTUDIO PARA DIAGNÓSTICO"},{"n": "PERNO MUÑON","a": 35000,"nota": "cód. 4001","c": "METALES"},{"n": "PERNO MUÑON PASANTE","a": 40000,"nota": "cód. 4002","c": "METALES"},{"n": "PERNO TIPO SANDRI","a": 35000,"nota": "cód. 4003","c": "METALES"},{"n": "SOCHAPA","a": 30000,"nota": "cód. 4004","c": "METALES"},{"n": "ESTRUCTURA BASE METALICA","a": 85000,"nota": "cód. 4005","c": "METALES"},{"n": "ESTRUCTURA BASE METALICA DE COMPLEMENTACION (NO INCLUYE ATACHES)","a": 120000,"nota": "cód. 4006","c": "METALES"},{"n": "PERSONALIZADO DE PILAR EN METAL (NO INCLUYE ADITAMENTO)","a": 65000,"nota": "cód. 5001","c": "IMPLANTES"},{"n": "SOBRE PILAR EN ZIRCONIO (NO INCLUYE ADITAMENTO)","a": 75000,"nota": "cód. 5002","c": "IMPLANTES"},{"n": "ESTRUCTURA BARRA AD-MODUM (NO INCLUYE ADITAMENTOS)","a": 300000,"nota": "cód. 5003 · incluye rodete y ordenación","c": "IMPLANTES"},{"n": "IMPLANT BRIDGE METAL CERAMICA TERMINADA (HASTA 12 PZAS)","a": 950000,"nota": "cód. 5004 · incluye rodete, ordenación y prueba acrílica","c": "IMPLANTES"},{"n": "IMPLANT BRIDGE ZIRCONIO MONOLITICO TERMINADA (HASTA 12 PZAS)","a": 1100000,"nota": "cód. 5005 · incluye rodete, ordenación y prueba PMMA","c": "IMPLANTES"},{"n": "ESTRUCTURA ZIRCONIO ARCADA COMPLETA TERMINADA (SIN ENCIA, CON CARGA DE CERAMICA)","a": 1000000,"nota": "cód. 5006","c": "IMPLANTES"},{"n": "ESTRUCTURA METAL CERAMICA ARCADA COMPLETA TERMINADA (HASTA 12 PZAS) SIN ENCIA","a": 900000,"nota": "cód. 5007","c": "IMPLANTES"},{"n": "IMPLANT BRIDGE RESINA IMPRESA TERMINADA (HASTA 12 PZAS)","a": 250000,"nota": "cód. 5008","c": "IMPLANTES"},{"n": "CUBETA INDIVIDUAL PARA IMPLANTES","a": 18000,"nota": "cód. 6001","c": "ACRÍLICOS BASE"},{"n": "CUBETA MULTIFUNCIONAL","a": 30000,"nota": "cód. 6002","c": "ACRÍLICOS BASE"},{"n": "GUIA QUIRURGICA TRANSPARENTE (POR CUADRANTE)","a": 25000,"nota": "cód. 6003","c": "ACRÍLICOS BASE"},{"n": "DUPLICADO DE PROTESIS TRANSPARENTE","a": 45000,"nota": "cód. 6004","c": "ACRÍLICOS BASE"},{"n": "PLACA PALATINA","a": 25000,"nota": "cód. 6005","c": "ACRÍLICOS BASE"},{"n": "REPARACION SIMPLE (HASTA 3 PIEZAS)","a": 25000,"nota": "cód. 7001","c": "REPARACIONES ACRÍLICAS"},{"n": "REPARACION COMPUESTA (DE MAS DE 3 PIEZAS)","a": 30000,"nota": "cód. 7002","c": "REPARACIONES ACRÍLICAS"},{"n": "REBASADO DE PROTESIS","a": 35000,"nota": "cód. 7003","c": "REPARACIONES ACRÍLICAS"},{"n": "CUBETA FUNCIONAL","a": 15000,"nota": "cód. 8001","c": "PRÓTESIS REMOVIBLE ACRÍLICA"},{"n": "PROTESIS INMEDIATA (HASTA 3 PZAS)","a": 45000,"nota": "cód. 8002","c": "PRÓTESIS REMOVIBLE ACRÍLICA"},{"n": "PROTESIS INMEDIATA (HASTA 7 PZAS)","a": 50000,"nota": "cód. 8003","c": "PRÓTESIS REMOVIBLE ACRÍLICA"},{"n": "TERMINACION ACRILICA SOBRE BASE METALICA","a": 60000,"nota": "cód. 8004","c": "PRÓTESIS REMOVIBLE ACRÍLICA"},{"n": "TERMINACION ACRILICA SOBRE BARRA AD-MODUM","a": 200000,"nota": "cód. 8005","c": "PRÓTESIS REMOVIBLE ACRÍLICA"},{"n": "PROTESIS ACRILICA TOTAL","a": 75000,"nota": "cód. 8006","c": "PRÓTESIS REMOVIBLE ACRÍLICA"},{"n": "PROTESIS ACRILICA PARCIAL","a": 70000,"nota": "cód. 8007","c": "PRÓTESIS REMOVIBLE ACRÍLICA"},{"n": "PROTESIS CUCHARA","a": 35000,"nota": "cód. 8008","c": "PRÓTESIS REMOVIBLE ACRÍLICA"},{"n": "PLANO ACRILICO (CON PRUEBA DE CERA)","a": 45000,"nota": "cód. 8009","c": "PRÓTESIS REMOVIBLE ACRÍLICA"},{"n": "CUBETILLA DE BLANQUEAMIENTO PAR","a": 40000,"nota": "cód. 9001","c": "ESTAMPADOS"},{"n": "PLACA DE CONTENCION (DE 0,6- 0,8- 1,0- 1,5 MM)","a": 35000,"nota": "cód. 9002","c": "ESTAMPADOS"},{"n": "ESTAMPADO RIGIDO (2 Y 3 MM)","a": 40000,"nota": "cód. 9003","c": "ESTAMPADOS"},{"n": "PLANO DURO- BLANDO","a": 55000,"nota": "cód. 9004","c": "ESTAMPADOS"}];

const CSU = ["administrativo", "clinico", "directivo"];   // directivo = Gerencia: en trabajos de laboratorio opera igual que recepción (sin ver aranceles)
const TTL_QR = 120_000;                 // QR de traspaso: 2 minutos
const SES_ADMIN = 12 * 3600_000;        // sesión de administrador: 12 horas
const SES_USER = 30 * 24 * 3600_000;    // sesión de usuario: 30 días
const MAX_FALLOS = 8, VENTANA = 15 * 60_000;

/* ---------- utilidades ---------- */
const json = (d, s = 200, h = {}) => new Response(JSON.stringify(d), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...h } });
class HttpErr extends Error { constructor(s, m, extra) { super(m); this.s = s; this.extra = extra; } }
const fail = (s, m, extra) => { throw new HttpErr(s, m, extra); };
const rnd = (n = 20) => { const a = new Uint8Array(n); crypto.getRandomValues(a); return [...a].map(b => b.toString(16).padStart(2, "0")).join(""); };
const sha = async s => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, "0")).join("");
const nombreDe = u => u ? `${u.nombre} ${u.apellido}`.trim() || u.rut : "";
/* nombre + cargo, para que en cada traspaso quede claro quién entregó y quién recibió (CSU, laboratorio, estudiante) */
const cargoDe = (u, t) => !u ? "" : u.rol === "laboratorio" ? `Laboratorio ${t?.laboratorio || ""}`.trim() : u.rol === "administrativo" ? "Administrativo CSU"
  : u.rol === "clinico" ? (u.es_admin ? "Director Técnico" : "Personal clínico CSU") : u.rol === "estudiante" ? "Estudiante" : u.rol === "docente" ? "Docente" : u.rol === "profesional" ? "Profesional clínica privada" : u.rol === "directivo" ? "Gerencia CSU" : "";
const quienEs = (u, t) => { const n = nombreDe(u), c = cargoDe(u, t); return c ? `${n} (${c})` : n; };
const txt = (v, max = 200) => String(v ?? "").trim().slice(0, max);
const igualSeguro = (a, b) => { a = String(a); b = String(b); let d = a.length ^ b.length; for (let i = 0; i < Math.max(a.length, b.length); i++) d |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0); return d === 0; };

/* teléfono chileno → 569XXXXXXXX (formato de WhatsApp); vacío si no es válido */
function telNorm(v) {
  let d = String(v || "").replace(/\D/g, "");
  if (d.startsWith("56")) d = d.slice(2);
  if (d.length === 8) d = "9" + d;
  return /^\d{9}$/.test(d) ? "56" + d : "";
}
const telVacio = v => String(v || "").replace(/\D/g, "").length <= 3;   // "+56 9 " sin completar
const correoOk = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(v || "").trim());
function rutNorm(v) {
  const s = String(v || "").toUpperCase().replace(/[^0-9K]/g, "");
  if (s.length < 2) return null;
  const cuerpo = s.slice(0, -1).replace(/^0+/, ""), dv = s.slice(-1);
  if (!/^\d{6,8}$/.test(cuerpo)) return null;
  let sum = 0, m = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) { sum += +cuerpo[i] * m; m = m === 7 ? 2 : m + 1; }
  const r = 11 - (sum % 11), esp = r === 11 ? "0" : r === 10 ? "K" : String(r);
  return { rut: `${cuerpo}-${dv}`, ok: esp === dv };
}

/* ---------- sesión ---------- */
const cookieDe = req => (req.headers.get("Cookie") || "").match(/(?:^|;\s*)csu_s=([a-f0-9]{40,})/)?.[1];
const cookie = (req, tok, ms) => `csu_s=${tok}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${Math.floor(ms / 1000)}${new URL(req.url).protocol === "https:" ? "; Secure" : ""}`;
async function usuarioSesion(req, env) {
  const tok = cookieDe(req); if (!tok) return null;
  const s = await env.DB.prepare("SELECT * FROM sesiones WHERE token_hash=?").bind(await sha(tok)).first();
  if (!s || s.expira < Date.now()) return null;
  const u = await env.DB.prepare("SELECT * FROM usuarios WHERE rut=?").bind(s.rut).first();
  if (!u || u.estado !== "ACTIVO") return null;
  return u;
}
async function fallo(env, claves) {
  const now = Date.now();
  for (const k of claves) await env.DB.prepare(`INSERT INTO fallos(clave,n,desde) VALUES(?,1,?) ON CONFLICT(clave) DO UPDATE SET n=CASE WHEN desde<? THEN 1 ELSE n+1 END, desde=CASE WHEN desde<? THEN ? ELSE desde END`)
    .bind(k, now, now - VENTANA, now - VENTANA, now).run();
}
async function bloqueado(env, claves) {
  for (const k of claves) { const f = await env.DB.prepare("SELECT * FROM fallos WHERE clave=?").bind(k).first(); if (f && f.n >= MAX_FALLOS && f.desde > Date.now() - VENTANA) return true; }
  return false;
}
function esAdminRut(env, rut) { const a = rutNorm(env.ADMIN_RUT); return !!a && a.rut === rut; }

/* ---------- acceso a trabajos ---------- */
/* solicitante del trabajo: el estudiante o, en clínica privada, el profesional tratante (se guarda en estudiante_rut/estudiante_nombre) */
const esSol = (u, t) => (u.rol === "estudiante" || u.rol === "profesional") && u.rut === t.estudiante_rut;
const FIRMA_PRIV = "No requiere: profesional tratante (clínica privada)";
const esPrueba = p => /^\s*prueba/i.test(String(p || ""));
const hoyCL = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10);
const puedeVer = (u, t) => CSU.includes(u.rol) || (u.rol === "laboratorio" && t.laboratorio_id === u.laboratorio_id && t.estado !== "SOLICITADA") || esSol(u, t) || (u.rol === "docente" && t.docente_rut === u.rut);
async function trabajo(env, u, id) {
  const t = await env.DB.prepare("SELECT t.*, l.nombre AS laboratorio FROM trabajos t JOIN laboratorios l ON l.id=t.laboratorio_id WHERE t.id=?").bind(+id).first();
  if (!t || !puedeVer(u, t)) fail(404, "Trabajo no encontrado o sin acceso.");
  return t;
}
const evento = (env, id, u, tipo, detalle = "") =>
  env.DB.prepare("INSERT INTO eventos(trabajo_id,rut,quien,tipo,detalle) VALUES(?,?,?,?,?)").bind(id, u.rut, `${nombreDe(u)} (${u.rol})`, tipo, detalle);
async function cfgGet(env) {
  const r = await env.DB.prepare("SELECT clave,valor FROM config").all();
  const c = {}; r.results.forEach(x => { try { c[x.clave] = JSON.parse(x.valor); } catch { c[x.clave] = x.valor; } });
  return c;
}
const solL0 = t => t.origen === "privada" ? "profesional" : "estudiante";
const quien = (def, t) => def.tipo === "retiro_lab" ? `una persona de ${t.laboratorio}` : (def.tipo === "retiro_est" || def.tipo === "entrega_orden") ? `${t.origen === "privada" ? "el profesional" : "el estudiante"} ${t.estudiante_nombre}` : def.quienRecibe;
/* "entrega" = quien muestra el QR; "recibe" = quien lo escanea y confirma.
   En entrega_orden el estudiante entrega la orden en papel, pero el QR lo muestra la administrativa (invertir=true). */
const TRASPASO = {
  entrega_orden: { tipo: "entrega_orden", entrega: u => CSU.includes(u.rol), recibe: (u, t) => esSol(u, t), invertir: true,
                   nuevo: "RECEPCIONADA", campos: "entrega_orden", texto: "Entrega de la orden por el estudiante", quienRecibe: "el estudiante asignado",
                   confirmar: "Confirmo que entregué esta orden" },
  retiro_lab:    { tipo: "retiro_lab",  entrega: u => CSU.includes(u.rol), recibe: (u, t) => u.rol === "laboratorio" && u.laboratorio_id === t.laboratorio_id,
                   nuevo: "EN_LABORATORIO", campos: "retiro_lab", texto: "Retiro por el laboratorio", quienRecibe: "una persona del laboratorio" },
  entrega_csu:   { tipo: "entrega_csu", entrega: (u, t) => u.rol === "laboratorio" && u.laboratorio_id === t.laboratorio_id, recibe: u => CSU.includes(u.rol),
                   nuevo: "ENTREGADA_CSU", campos: "entrega_csu", texto: "Entrega del laboratorio al CSU", quienRecibe: "personal del CSU" },
  retiro_est:    { tipo: "retiro_est",  entrega: u => CSU.includes(u.rol), recibe: (u, t) => esSol(u, t),
                   nuevo: "RETIRADA_ESTUDIANTE", campos: "retiro_est", texto: "Retiro por el estudiante", quienRecibe: "el estudiante asignado" },
};
/* orden del flujo: 1° firma del docente, 2° el estudiante entrega la orden, 3° el laboratorio retira */
const defDe = t => t.estado === "RECEPCIONADA" ? (!t.docente_aprobado_en || t.digital ? null : !t.entrega_orden_en ? TRASPASO.entrega_orden : TRASPASO.retiro_lab)
  : t.estado === "EN_LABORATORIO" ? TRASPASO.entrega_csu : t.estado === "ENTREGADA_CSU" ? TRASPASO.retiro_est : null;
async function aplicarTraspaso(env, t, def, entregaRut, recibe, manual) {
  const ent = await env.DB.prepare("SELECT * FROM usuarios WHERE rut=?").bind(entregaRut).first();
  const c = def.campos;
  const muestra = quienEs(ent, t) || entregaRut, escanea = manual ? `${manual.recibe} (registrado sin QR)` : quienEs(recibe, t);
  const [entrego, recibio] = def.invertir ? [escanea, muestra] : [muestra, escanea];   // quién entregó físicamente / quién recibió
  const r = await env.DB.batch([
    env.DB.prepare(`UPDATE trabajos SET estado=?, ${c}_en=datetime('now'), ${c}_entrega=?, ${c}_recibe=?, actualizado_en=datetime('now')${def.nuevo === "EN_LABORATORIO" ? ", etapa_lab='', etapa_en=datetime('now')" : ""} WHERE id=? AND estado=? AND ${c}_en IS NULL`)
      .bind(def.nuevo, entrego, recibio, t.id, t.estado),
    evento(env, t.id, manual ? ent : recibe, manual ? "TRASPASO MANUAL" : "TRASPASO QR",
      `${def.texto}. Entregó: ${entrego}. Recibió: ${recibio}.${manual ? " Motivo sin QR: " + manual.motivo : ""}`),
  ]);
  if (!r[0].meta.changes) fail(409, "El trabajo cambió de estado mientras tanto. Recarga.");
}
/* color del diente: guía + 1, 3 o 4 segmentos (cervical → incisal) + nota. Se guarda como JSON corto. */
const colorNorm = v => {
  if (v == null) return undefined;
  let o = v; if (typeof v === "string") { if (!v.trim()) return ""; try { o = JSON.parse(v); } catch { fail(400, "Color del diente con formato inválido."); } }
  const g = txt(o?.g, 40), s = (Array.isArray(o?.s) ? o.s : []).slice(0, 4).map(x => txt(x, 12)), n = txt(o?.n, 120);
  if (s.some(x => x && !/^[\w.\- ]+$/.test(x))) fail(400, "Color del diente inválido.");
  if (!s.some(Boolean) && !n) return "";
  if (![1, 3, 4].includes(s.length)) fail(400, "El color se marca en 1, 3 o 4 segmentos.");
  return JSON.stringify({ g, s, n });
};
const ZONAS = { 1: ["Todo el diente"], 3: ["Cervical", "Medio", "Incisal"], 4: ["Cervical", "Medio", "Incisal", "Borde incisal"] };
const colorTxt = j => { try { const o = JSON.parse(j || ""); if (!o) return ""; const z = ZONAS[o.s.length] || [];
  return [o.g, o.s.map((x, i) => (o.s.length > 1 ? z[i] + " " : "") + (x || "—")).join(" · "), o.n].filter(Boolean).join(" · "); } catch { return ""; } };
let colorOk = false;   // agrega la columna "color" la primera vez (no hay que tocar Cloudflare)
async function asegurarColor(env) { if (colorOk) return;
  for (const c of ["color", "items", "ajuste_items", "buzon_en", "buzon_por", "exc_sol_en", "exc_sol_por", "exc_motivo", "exc_docente", "etapa_en", "origen", "garantia", "garantia_motivo", "garantia_por", "garantia_en", "garantia_origen", "garantia_arancel", "digital", "dig_salida_en", "dig_salida_por", "dig_salida_datos", "dig_recep_en", "dig_recep_por", "dig_rechazo"]) { try { await env.DB.prepare(`ALTER TABLE trabajos ADD COLUMN ${c} TEXT`).run(); } catch (e) { /* ya existe */ } }
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS encuestas (id INTEGER PRIMARY KEY AUTOINCREMENT, trabajo_id INTEGER NOT NULL, rut TEXT NOT NULL, rol TEXT NOT NULL,
    laboratorio_id INTEGER, tipo_trabajo TEXT, preguntas TEXT, respuestas TEXT, comentario TEXT, omitida INTEGER NOT NULL DEFAULT 0, prueba INTEGER NOT NULL DEFAULT 0,
    creado_en TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(trabajo_id, rut))`).run();
  colorOk = true; }
/* encuesta de satisfacción breve (Likert 1–5); las preguntas se editan en Administración y se guardan con cada respuesta */
const ENC_DEF = { estudiante: ["El trabajo llegó dentro del plazo comprometido.", "El trabajo calzó bien en boca, sin necesidad de ajustes importantes.", "El color y la forma correspondieron a lo solicitado en la orden."],
  docente: ["La calidad técnica del trabajo fue adecuada.", "El trabajo se ajustó a lo indicado en la orden (diseño, color, materiales).", "Volvería a enviar este tipo de trabajo a este laboratorio."] };
const encPreg = cfg => { const e = cfg.encuesta || {}; return { estudiante: Array.isArray(e.estudiante) && e.estudiante.length ? e.estudiante : ENC_DEF.estudiante, docente: Array.isArray(e.docente) && e.docente.length ? e.docente : ENC_DEF.docente }; };

/* ===================== AUDITORÍA DE FICHAS CLÍNICAS (indicador REG 1.2) =====================
   Muestra sellada: el servidor genera la semilla y sortea; se guarda la huella (SHA-256) del universo para poder
   reproducir el sorteo. Las evaluaciones no se editan: una corrección crea una nueva versión con motivo. */
const FC_CRIT = { MED: ["motivo", "antecedentes", "anamnesis", "examen", "diagnostico", "plan"],
  ODO: ["anamnesis", "odontograma", "periodontograma", "consentimiento", "examenes", "derivaciones", "evoluciones"] };
let fcOk = false;
let entOk = false;
async function entTablas(env) { // libro de entregas de documentos (copia de ficha) con firma en pantalla; permiso "entregas" para administrativos
  if (entOk) return;
  try { await env.DB.prepare("ALTER TABLE usuarios ADD COLUMN entregas INTEGER NOT NULL DEFAULT 0").run(); } catch (e) { /* ya existe */ }
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS entregas_doc (id INTEGER PRIMARY KEY AUTOINCREMENT, folio TEXT NOT NULL UNIQUE, tipo TEXT NOT NULL, descripcion TEXT NOT NULL,
    paciente_nombre TEXT, paciente_rut TEXT, ficha TEXT, solicitante TEXT, solicitante_rut TEXT, calidad TEXT, motivo TEXT, fecha_solicitud TEXT,
    estado TEXT NOT NULL DEFAULT 'PENDIENTE', creado_por TEXT, creado_en TEXT DEFAULT (datetime('now')), retira_nombre TEXT, retira_rut TEXT, retira_calidad TEXT,
    firma TEXT, entrego TEXT, entrego_rut TEXT, entregado_en TEXT, anulada_motivo TEXT)`).run();
  for (const c of ["qr_token", "qr_expira", "qr_nombre", "qr_rut", "qr_calidad", "qr_por", "qr_por_rut", "firmado_en_telefono"]) { try { await env.DB.prepare(`ALTER TABLE entregas_doc ADD COLUMN ${c} TEXT`).run(); } catch (e) { /* ya existe */ } }
  entOk = true; }
const TTL_FIRMA = 5 * 60_000;
/* ---------- garantías clínicas (protocolo de garantías odontológicas): Operaciones → DT → Gerencia ---------- */
let garOk = false;
async function garTablas(env) { if (garOk) return;
  try { await env.DB.prepare("ALTER TABLE usuarios ADD COLUMN garantias TEXT").run(); } catch (e) { /* ya existe */ }
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS garantias (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT NOT NULL UNIQUE, estado TEXT NOT NULL, resultado TEXT,
      paciente_nombre TEXT, paciente_rut TEXT, telefono TEXT, apoderado TEXT, estudiante TEXT, asignatura TEXT, docente_tutor TEXT, aplica TEXT,
      datos TEXT NOT NULL DEFAULT '{}', entregado_en TEXT DEFAULT (datetime('now')), etapa_en TEXT DEFAULT (datetime('now')), creado_por TEXT)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS garantia_firmas (id INTEGER PRIMARY KEY AUTOINCREMENT, garantia_id INTEGER NOT NULL, etapa TEXT NOT NULL, nombre TEXT, cargo TEXT, rut TEXT, firma TEXT, nota TEXT, en TEXT DEFAULT (datetime('now')))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS garantia_eventos (id INTEGER PRIMARY KEY AUTOINCREMENT, garantia_id INTEGER NOT NULL, en TEXT DEFAULT (datetime('now')), quien TEXT, tipo TEXT, detalle TEXT)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS garantia_archivos (id INTEGER PRIMARY KEY AUTOINCREMENT, garantia_id INTEGER NOT NULL, tipo TEXT NOT NULL, nombre TEXT, mime TEXT, bytes INTEGER, partes INTEGER, quien TEXT, en TEXT DEFAULT (datetime('now')), vigente INTEGER NOT NULL DEFAULT 1)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS garantia_arch_partes (archivo_id INTEGER NOT NULL, n INTEGER NOT NULL, data BLOB, PRIMARY KEY(archivo_id, n))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS garantia_enlaces (token_hash TEXT PRIMARY KEY, garantia_id INTEGER NOT NULL, creado_por TEXT, en TEXT DEFAULT (datetime('now')), vence INTEGER NOT NULL, usado_en TEXT, anulado INTEGER NOT NULL DEFAULT 0)`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS garantia_eliminados (id INTEGER PRIMARY KEY AUTOINCREMENT, codigo TEXT, quien TEXT, motivo TEXT, en TEXT DEFAULT (datetime('now')))`)]);
  garOk = true; }
const GAR_MIME = { "application/pdf": 1, "image/jpeg": 1, "image/png": 1, "image/webp": 1, "text/csv": 1, "application/vnd.ms-excel": 1, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": 1 };
const GAR_MAX = 8 * 1024 * 1024, GAR_PARTE = 900_000;
const GAR_ETAPAS = {   // etapa: [quién puede, estado requerido]
  devolver: ["DT", ["REVISION_DT", "CONOCIMIENTO_DT"]],
  recepcion: ["OPS", ["EN_DOCENCIA"]], desistido: ["OPS", ["EN_DOCENCIA"]], dt: ["DT", ["REVISION_DT"]], dt_conocimiento: ["DT", ["CONOCIMIENTO_DT"]],
  gerencia: ["GER", ["GERENCIA"]], coordinacion: ["DT", ["EJECUCION"]], presupuesto: ["OPS", ["EJECUCION"]], ejecucion: ["OPS", ["EJECUCION"]], retro: ["DT", ["EJECUCION"]] };
const GAR_CIERRE = ["coordinacion", "presupuesto", "ejecucion", "retro"];
const GAR_TTL_ENLACE = 10 * 24 * 3600_000;   // enlace de retroalimentación para el Director de Carrera: 10 días, un solo uso
const GAR_CAUSAS = { INDICACION: "Indicación / diagnóstico", TECNICA: "Técnica o ejecución", MATERIAL: "Material", LABORATORIO: "Laboratorio externo", REGISTRO: "Registro en ficha", SUPERVISION: "Supervisión docente", PACIENTE: "Factor del paciente", OTRA: "Otra" };
const GAR_RES_TXT = { TOTAL: "Aprobación total", PARCIAL: "Aprobación parcial", DEVOLUCION: "Devolución de monto", RECHAZO: "Rechazo" };
function retroLimpia(b) { // valida el formato de retroalimentación (lo usa el enlace público y el DT)
  const causas = (Array.isArray(b.causas) ? b.causas : []).filter(k => GAR_CAUSAS[k]); if (!causas.length) fail(400, "Marca al menos una causa.");
  const analisis = txt(b.analisis, 3000); if (analisis.length < 10) fail(400, "Escribe el análisis del caso.");
  const accion = txt(b.accion, 1000); if (accion.length < 5) fail(400, "Escribe la acción de mejora acordada.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(b.fecha || ""))) fail(400, "Indica la fecha de la instancia.");
  return { fecha: b.fecha, modalidad: txt(b.modalidad, 60), participantes: txt(b.participantes, 400), causas, causa_otra: txt(b.causa_otra, 200), analisis, accion, responsable: txt(b.responsable, 160), plazo: /^\d{4}-\d{2}-\d{2}$/.test(String(b.plazo || "")) ? b.plazo : "" }; }
const rutOculto = r => { const m = String(r || "").match(/^(\d+)-([\dK])$/i); return m ? "••.•••." + m[1].slice(-3) + "-" + m[2] : ""; };
const iniciales = n => String(n || "").trim().split(/\s+/).map((w, i) => i === 0 ? w : w[0] + ".").join(" ");
async function fcTablas(env) {
  if (fcOk) return;
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS fc_mediciones (id INTEGER PRIMARY KEY AUTOINCREMENT, unidad TEXT NOT NULL, desde TEXT NOT NULL, hasta TEXT NOT NULL,
      mes_inicio TEXT NOT NULL, universo_n INTEGER NOT NULL, hash TEXT NOT NULL, semilla TEXT NOT NULL, parametros TEXT NOT NULL, n_muestra INTEGER NOT NULL,
      cuota INTEGER NOT NULL, origen_n TEXT NOT NULL, regla INTEGER NOT NULL DEFAULT 100, umbral INTEGER NOT NULL DEFAULT 60, estado TEXT NOT NULL DEFAULT 'ACTIVA',
      anulada_motivo TEXT, creado_por TEXT, creado_en TEXT DEFAULT (datetime('now')))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS fc_muestra (id INTEGER PRIMARY KEY AUTOINCREMENT, medicion_id INTEGER NOT NULL, orden INTEGER NOT NULL, rut TEXT NOT NULL,
      paciente TEXT, mes INTEGER, estado TEXT NOT NULL, reemplaza_a INTEGER, motivo TEXT, actualizado_en TEXT DEFAULT (datetime('now')))`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS fc_evaluaciones (id INTEGER PRIMARY KEY AUTOINCREMENT, muestra_id INTEGER NOT NULL, medicion_id INTEGER NOT NULL,
      version INTEGER NOT NULL, vigente INTEGER NOT NULL DEFAULT 1, alumno TEXT, docente TEXT, nivel TEXT, fecha TEXT, items TEXT NOT NULL, pagos TEXT,
      aplicables INTEGER, cumplidos INTEGER, pct REAL, cumple INTEGER, evaluador TEXT, evaluador_rut TEXT, motivo TEXT, creado_en TEXT DEFAULT (datetime('now')))`),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS ix_fc_muestra ON fc_muestra(medicion_id, estado)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS ix_fc_eval ON fc_evaluaciones(muestra_id, vigente)"),
  ]);
  fcOk = true;
}
/* sorteo reproducible: universo ordenado + barajado de Fisher-Yates con generador mulberry32 desde la semilla */
const fcRand = hex => { let a = parseInt(hex.slice(0, 8), 16) >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const fcBarajar = (lista, hex) => { const a = lista.slice(), r = fcRand(hex); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sha256 = async t => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map(b => b.toString(16).padStart(2, "0")).join("");
const fcZ = { 90: 1.645, 95: 1.96, 99: 2.576 };
const fcN = (N, conf, err, p) => { const z = fcZ[conf] || 1.96, n0 = z * z * p * (1 - p) / (err * err); return Math.min(N, Math.ceil(n0 / (1 + (n0 - 1) / N))); };
const mesOk = v => /^\d{4}-(0[1-9]|1[0-2])$/.test(String(v || ""));
/* valida los datos de una orden. En modo prueba (presupuesto que empieza con PRUEBA) los RUT y teléfonos quedan libres. */
async function datosOrden(env, body, t) {
  const req_ = k => txt(body[k]) || fail(400, `Falta: ${k.replace(/_/g, " ")}.`);
  let presupuesto = req_("presupuesto");
  if (t && esPrueba(t.presupuesto) && !esPrueba(presupuesto)) presupuesto = "PRUEBA-" + presupuesto;   // una solicitud de prueba sigue siendo de prueba
  const prueba = esPrueba(presupuesto);
  const num_orden = req_("num_orden"), fecha = req_("fecha_recepcion");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) fail(400, "Fecha de recepción inválida.");
  const rutOk = (k, et) => { const v = txt(body[k], 20); if (prueba) return v || fail(400, `Falta: ${et}.`); const r = rutNorm(v); if (!r) fail(400, `RUT ${et} con formato inválido.`); if (!r.ok) fail(400, `El dígito verificador del RUT ${et} ${r.rut} no corresponde.`); return r.rut; };
  const telOk = (k, et) => { const v = telNorm(body[k]); if (v) return v; if (prueba && txt(body[k])) return txt(body[k], 20); fail(400, `Teléfono ${et} inválido. Usa el formato +56 9 1234 5678.`); };
  const d = { presupuesto, num_orden, fecha_recepcion: fecha, paciente_nombre: req_("paciente_nombre"), paciente_rut: rutOk("paciente_rut", "del paciente"), codigo_smile: txt(body.codigo_smile, 30),
    estudiante_rut: (() => { const r = rutNorm(body.estudiante_rut); if (!r || !r.ok) fail(400, "RUT del estudiante inválido."); return r.rut; })(), estudiante_nombre: req_("estudiante_nombre"),
    estudiante_telefono: telOk("estudiante_telefono", "del estudiante"), estudiante_correo: txt(body.estudiante_correo, 120).toLowerCase(),
    ...(t && t.origen === "privada" ? { docente_rut: "", docente_nombre: "", docente_telefono: "" } : { docente_rut: rutOk("docente_rut", "del docente"), docente_nombre: req_("docente_nombre"), docente_telefono: telOk("docente_telefono", "del docente") }), docente_correo: txt(body.docente_correo, 120).toLowerCase(),
    diente: txt(body.diente, 60), tipo_trabajo: req_("tipo_trabajo"), color: colorNorm(body.color) };
  if ((d.estudiante_correo && !correoOk(d.estudiante_correo)) || (d.docente_correo && !correoOk(d.docente_correo))) fail(400, "Correo inválido.");
  const lab = await env.DB.prepare("SELECT id FROM laboratorios WHERE id=? AND activo=1").bind(+body.laboratorio_id).first(); if (!lab) fail(400, "Elige el laboratorio.");
  d.laboratorio_id = lab.id;
  const cfgO = await cfgGet(env), its = itemsNorm(body, cfgO, d.laboratorio_id, true);
  if (its) { const r = resumenItems(its); Object.assign(d, { tipo_trabajo: r.tipo_trabajo, diente: r.diente, arancel: r.arancel, plazo_dias: r.plazo_dias, color: r.color, items: its.length > 1 ? JSON.stringify(its) : null }); }
  else { const ti = tipoInfo(cfgO, d.tipo_trabajo, d.laboratorio_id); d.arancel = ti?.a ?? null; d.plazo_dias = ti?.p ?? null; }
  const dup = await env.DB.prepare("SELECT id FROM trabajos WHERE num_orden=? AND estado<>'ANULADA' AND id<>?").bind(num_orden, t?.id || 0).first();
  if (dup) fail(409, `Ya existe un trabajo con la orden N° ${num_orden} (registro #${dup.id}).`);
  return d;
}
const sinPrecio = (u, row) => { if (row && !u.es_admin) { delete row.arancel; delete row.garantia_arancel; if (row.items) { try { row.items = JSON.stringify(JSON.parse(row.items).map(({ a, ...x }) => x)); } catch { } } } return row; };   // el arancel lo ve solo el administrador
/* varios trabajos en una misma orden: viajan juntos (un QR); cada uno con su tipo, dientes y color */
const itemsNorm = (body, cfg, lab, req) => {
  if (!Array.isArray(body.items)) return null;
  const arr = body.items.slice(0, 10).map(x => ({ tipo: txt(x.tipo_trabajo ?? x.tipo, 140), diente: txt(x.diente, 60), color: colorNorm(x.color) || "" })).filter(x => x.tipo || x.diente || x.color);
  if (req && (!arr.length || arr.some(x => !x.tipo))) fail(400, "Indica el tipo de cada trabajo de la orden.");
  arr.forEach(x => { const ti = tipoInfo(cfg, x.tipo, lab); x.a = ti?.a ?? null; x.p = ti?.p ?? null; });
  return arr;
};
/* N° de presupuesto y de orden escritos por el estudiante (la administrativa los verifica al recibir) */
async function presNum(env, body, prueba, idActual) {
  let pres = txt(body.presupuesto, 40); const num = txt(body.num_orden, 40);
  if (prueba) pres = esPrueba(pres) ? pres : "PRUEBA" + (pres ? "-" + pres : "");
  else if (esPrueba(pres)) fail(400, "El N° de presupuesto no puede empezar con PRUEBA fuera del modo prueba.");
  if (num) { const dup = await env.DB.prepare("SELECT id FROM trabajos WHERE num_orden=? AND estado<>'ANULADA' AND id<>?").bind(num, idActual || 0).first();
    if (dup) fail(409, `Ya existe un trabajo con la orden N° ${num}. Revisa el número.`); }
  return { pres, num };
}
/* ===== trazabilidad del paciente: casos (original + ajustes) y trabajos en paralelo ===== */
/* el paciente se reconoce por RUT o por código SMILE, el que se haya usado; si alguna orden tiene ambos, se unen */
async function mismoPaciente(env, rut, smile) {
  const R = new Set(txt(rut) ? [txt(rut)] : []), S = new Set(txt(smile) ? [txt(smile)] : []);
  for (let i = 0; i < 2 && (R.size || S.size); i++) {
    const c = [], b = []; if (R.size) { c.push(`paciente_rut IN (${[...R].map(() => "?").join(",")})`); b.push(...R); } if (S.size) { c.push(`codigo_smile IN (${[...S].map(() => "?").join(",")})`); b.push(...S); }
    const r = (await env.DB.prepare(`SELECT DISTINCT paciente_rut, codigo_smile FROM trabajos WHERE ${c.join(" OR ")} LIMIT 200`).bind(...b).all()).results;
    const n0 = R.size + S.size; r.forEach(x => { if (txt(x.paciente_rut)) R.add(txt(x.paciente_rut)); if (txt(x.codigo_smile)) S.add(txt(x.codigo_smile)); }); if (R.size + S.size === n0) break;
  }
  const c = [], b = []; if (R.size) { c.push(`t.paciente_rut IN (${[...R].map(() => "?").join(",")})`); b.push(...R); } if (S.size) { c.push(`t.codigo_smile IN (${[...S].map(() => "?").join(",")})`); b.push(...S); }
  return c.length ? { w: "(" + c.join(" OR ") + ")", b } : null; }
async function ajustesPendientes(env, u, rut, smile, prueba) {
  const mp = await mismoPaciente(env, rut, smile); if (!mp) return [];
  const w = [mp.w, "t.estado='REQUIERE_AJUSTE'", "NOT EXISTS (SELECT 1 FROM trabajos h WHERE h.orden_padre=t.id AND h.estado<>'ANULADA')",
    `upper(trim(t.presupuesto)) ${prueba ? "" : "NOT "}LIKE 'PRUEBA%'`], b = [...mp.b];
  if (u.rol === "estudiante" || u.rol === "profesional") { w.push("t.estudiante_rut=?"); b.push(u.rut); } else if (!CSU.includes(u.rol)) return [];
  return (await env.DB.prepare(`SELECT t.id,t.num_orden,t.presupuesto,t.intento,t.tipo_trabajo,t.diente,t.items,t.ajuste_items,t.estudiante_nombre,l.nombre AS laboratorio,t.prueba_obs
    FROM trabajos t JOIN laboratorios l ON l.id=t.laboratorio_id WHERE ${w.join(" AND ")} ORDER BY t.id DESC LIMIT 20`).bind(...b).all()).results;
}
/* deja una orden nueva encadenada como ajuste de otra (mismo paciente, mismo presupuesto, intento siguiente) */
async function vincularAjuste(env, u, nuevoId, padreId, rut, smile, prueba) {
  const P = (await ajustesPendientes(env, u, rut, smile, prueba)).find(x => x.id === +padreId);
  if (!P) fail(409, "Esa orden ya no está pendiente de ajuste para este paciente. Vuelve a intentarlo.");
  await env.DB.batch([env.DB.prepare("UPDATE trabajos SET orden_padre=?, intento=?, presupuesto=?, garantia='POSIBLE', garantia_origen='ajuste', garantia_motivo=?, garantia_en=datetime('now'), garantia_por=? WHERE id=?").bind(P.id, (P.intento || 1) + 1, P.presupuesto, P.prueba_obs || "", quienEs(u), nuevoId),
    evento(env, nuevoId, u, "AJUSTE DE ORDEN ANTERIOR", `Encadenada como intento ${(P.intento || 1) + 1} de la orden N° ${P.num_orden} (presupuesto ${P.presupuesto}).`),
    evento(env, P.id, u, "NUEVA ORDEN DE AJUSTE", `El ajuste se registró como intento ${(P.intento || 1) + 1}${u.rol === "estudiante" ? " (solicitud del estudiante)" : ""}.`)]);
}
/* en una orden con varios trabajos, cuáles requieren ajuste (índices); el resto quedó OK */
const ajusteDe = (t, body) => { if (body.ok) return null; const n = itemsDe(t).length; if (n < 2) return null;
  const sel = [...new Set((Array.isArray(body.ajuste_items) ? body.ajuste_items : []).map(Number).filter(i => Number.isInteger(i) && i >= 0 && i < n))].sort((a, b) => a - b);
  if (!sel.length) fail(400, "Marca cuál o cuáles trabajos de la orden requieren ajuste."); return JSON.stringify(sel); };
const resumenItems = arr => ({ tipo_trabajo: arr.map(x => x.tipo).filter(Boolean).join(" + ").slice(0, 400), diente: [...new Set(arr.map(x => x.diente).filter(Boolean))].join(", ").slice(0, 200),
  color: (arr.find(x => x.color) || {}).color || "", arancel: arr.some(x => x.a != null) ? arr.reduce((s, x) => s + (x.a || 0), 0) : null,
  plazo_dias: arr.some(x => x.p != null) ? Math.max(...arr.map(x => x.p || 0)) : null });
const itemsDe = t => { try { const a = JSON.parse(t.items || ""); if (Array.isArray(a) && a.length) return a; } catch { } return [{ tipo: t.tipo_trabajo || "", diente: t.diente || "", color: t.color || "", a: t.arancel ?? null, p: t.plazo_dias ?? null }]; };
/* el arancel y plazo dependen del laboratorio: primero la lista de ese laboratorio, después las comunes (sin laboratorio) */
const tipoInfo = (cfg, nombre, lab) => { const L = (cfg.tipos_trabajo || []).filter(x => (x.n || x) === nombre); return L.find(x => x.l && x.l === +lab) || L.find(x => !x.l) || null; };
const normLab = s => String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
/* una sola vez: las prestaciones ya cargadas quedan como de Line System y se agregan las de Cecilia Cerna (aranceles 2026) */
let tiposOk = false;
let plazoOk = false;
async function plazoCerna(env) { // Cerna: 4 días hábiles; se aplica una vez a sus prestaciones sin plazo y como plazo por defecto del laboratorio
  if (plazoOk) return; plazoOk = true;
  try { await env.DB.prepare("INSERT INTO config(clave,valor) VALUES('plazo_cerna_v','1')").run(); } catch { return; }
  try {
    const cerna = (await env.DB.prepare("SELECT id,nombre FROM laboratorios").all()).results.find(x => normLab(x.nombre).includes("cerna"))?.id; if (!cerna) return;
    const c = await cfgGet(env), ti = (c.tipos_trabajo || []).map(x => typeof x === "string" ? { n: x } : x).map(x => x.l === cerna && !(+x.p > 0) ? { ...x, p: 4 } : x);
    const pl = (c.plazo_lab && typeof c.plazo_lab === "object") ? c.plazo_lab : {}; if (!(+pl[cerna] > 0)) pl[cerna] = 4;
    await env.DB.batch([env.DB.prepare("INSERT OR REPLACE INTO config VALUES('tipos_trabajo',?)").bind(JSON.stringify(ti)),
      env.DB.prepare("INSERT OR REPLACE INTO config VALUES('plazo_lab',?)").bind(JSON.stringify(pl)),
      env.DB.prepare("UPDATE trabajos SET plazo_dias=4 WHERE laboratorio_id=? AND COALESCE(plazo_dias,0)=0").bind(cerna)]);
  } catch (e) { await env.DB.prepare("DELETE FROM config WHERE clave='plazo_cerna_v'").run().catch(() => {}); plazoOk = false; throw e; }
}
let videntOk = false;
async function migrarVident(env) { // crea el laboratorio Vi-Dent con su arancel (una sola vez)
  if (videntOk) return; videntOk = true;
  try { await env.DB.prepare("INSERT INTO config(clave,valor) VALUES('vident_v','1')").run(); } catch { return; }
  try {
    const labs = (await env.DB.prepare("SELECT id,nombre FROM laboratorios").all()).results;
    const id = labs.find(x => normLab(x.nombre).includes("vident"))?.id || (await env.DB.prepare("INSERT INTO laboratorios(nombre) VALUES('Vi-Dent')").run()).meta.last_row_id;
    const c = await cfgGet(env); let ti = (c.tipos_trabajo || []).map(x => typeof x === "string" ? { n: x } : x);
    if (!ti.some(x => x.l === id)) ti = ti.concat(VIDENT.map(x => ({ ...x, l: id })));
    const pl = (c.plazo_lab && typeof c.plazo_lab === "object") ? c.plazo_lab : {}; if (!(+pl[id] > 0)) pl[id] = 4;
    await env.DB.batch([env.DB.prepare("INSERT OR REPLACE INTO config VALUES('tipos_trabajo',?)").bind(JSON.stringify(ti)),
      env.DB.prepare("INSERT OR REPLACE INTO config VALUES('plazo_lab',?)").bind(JSON.stringify(pl))]);
  } catch (e) { await env.DB.prepare("DELETE FROM config WHERE clave='vident_v'").run().catch(() => {}); videntOk = false; throw e; }
}
async function migrarTipos(env) {
  if (tiposOk) return; tiposOk = true;
  try { await env.DB.prepare("INSERT INTO config(clave,valor) VALUES('tipos_ver','2')").run(); } catch { return; }   // ya se hizo
  try {
    const labs = (await env.DB.prepare("SELECT id,nombre FROM laboratorios").all()).results;
    const lab = async (clave, nombre) => labs.find(x => normLab(x.nombre).includes(clave))?.id || (await env.DB.prepare("INSERT INTO laboratorios(nombre) VALUES(?)").bind(nombre).run()).meta.last_row_id;
    const line = await lab("linesystem", "Line System"), cerna = await lab("cerna", "Cecilia Cerna");
    let ti = ((await cfgGet(env)).tipos_trabajo || []).map(x => typeof x === "string" ? { n: x } : x).map(x => x.l ? x : { ...x, l: line });
    if (!ti.some(x => x.l === cerna)) ti = ti.concat(CERNA.map(x => ({ ...x, p: 4, l: cerna })));
    await env.DB.prepare("INSERT OR REPLACE INTO config VALUES('tipos_trabajo',?)").bind(JSON.stringify(ti)).run();
  } catch (e) { await env.DB.prepare("DELETE FROM config WHERE clave='tipos_ver'").run().catch(() => {}); tiposOk = false; throw e; }
}

/* datos de contacto del perfil: teléfono propio, correo institucional y, para el personal del CSU, el WhatsApp del CSU desde el que avisa */
function contacto(body, rol) {
  const telefono = telVacio(body.telefono) ? "" : telNorm(body.telefono), correo = txt(body.correo, 120).toLowerCase(), salida = telVacio(body.telefono_salida) ? "" : telNorm(body.telefono_salida);
  if (!telVacio(body.telefono) && !telefono) fail(400, "Teléfono inválido. Usa el formato +56 9 1234 5678.");
  if (correo && !correoOk(correo)) fail(400, "Correo inválido.");
  if (!telVacio(body.telefono_salida) && !salida) fail(400, "Teléfono del CSU inválido. Usa el formato +56 9 1234 5678.");
  if (["estudiante", "docente", "profesional"].includes(rol) && !telefono) fail(400, "El teléfono es obligatorio para estudiantes, docentes y profesionales (para avisarles cuando llegue el trabajo).");
  if (["docente", "estudiante", "laboratorio", "profesional"].includes(rol) && !correo) fail(400, "El correo es obligatorio: se usa para enviar y copiar los avisos del trabajo.");
  if (rol === "administrativo" && (!correo || !salida)) fail(400, "El administrativo debe registrar su correo institucional y el WhatsApp del CSU desde el que enviará los avisos.");
  return { telefono, correo, telefono_salida: CSU.includes(rol) ? salida : "" };
}

/* ---------- rutas públicas (sin sesión) ---------- */
async function publico(req, env, seg, body) {
  const ip = req.headers.get("CF-Connecting-IP") || "local";
  if (seg[0] === "login" && req.method === "POST") {
    const r = rutNorm(body.rut);
    if (!r || !r.ok) fail(400, "RUT inválido. Escríbelo sin puntos y con guion, por ejemplo 12345678-5.");
    const claves = ["rut:" + r.rut, "ip:" + ip];
    if (await bloqueado(env, claves)) fail(429, "Demasiados intentos fallidos. Espera 15 minutos.");
    const admin = esAdminRut(env, r.rut);
    const pinOk = admin ? (!!env.ADMIN_PIN && igualSeguro(String(body.pin || "").trim(), env.ADMIN_PIN)) : rutNorm(body.pin)?.rut === r.rut;
    if (!pinOk) { await fallo(env, claves); fail(401, admin ? "PIN de administrador incorrecto." : "PIN incorrecto. Tu PIN es tu RUT sin puntos y con guion."); }
    let u = await env.DB.prepare("SELECT * FROM usuarios WHERE rut=?").bind(r.rut).first();
    if (admin && !u) { await env.DB.prepare("INSERT INTO usuarios(rut,rol,es_admin,estado) VALUES(?, 'clinico', 1, 'ACTIVO')").bind(r.rut).run(); u = await env.DB.prepare("SELECT * FROM usuarios WHERE rut=?").bind(r.rut).first(); }
    if (admin) await env.DB.prepare("UPDATE usuarios SET es_admin=1, estado='ACTIVO' WHERE rut=?").bind(r.rut).run();
    if (!u) return json({ registro: true, rut: r.rut });
    if (u.estado === "PENDIENTE") fail(403, "Tu perfil está pendiente de aprobación del Director Técnico.");
    if (u.estado !== "ACTIVO") fail(403, "Tu acceso está desactivado. Consulta con el Director Técnico.");
    const tok = rnd(32), ms = admin ? SES_ADMIN : SES_USER;
    await env.DB.batch([
      env.DB.prepare("DELETE FROM sesiones WHERE expira<?").bind(Date.now()),
      env.DB.prepare("INSERT INTO sesiones(token_hash,rut,expira) VALUES(?,?,?)").bind(await sha(tok), r.rut, Date.now() + ms),
      env.DB.prepare("DELETE FROM fallos WHERE clave=?").bind("rut:" + r.rut),
    ]);
    return json({ ok: true }, 200, { "set-cookie": cookie(req, tok, ms) });
  }
  if (seg[0] === "registro" && req.method === "POST") {
    const r = rutNorm(body.rut);
    if (!r || !r.ok || rutNorm(body.pin)?.rut !== r.rut) fail(400, "RUT o PIN inválido.");
    if (esAdminRut(env, r.rut)) fail(400, "Este RUT es de administrador.");
    if (await env.DB.prepare("SELECT rut FROM usuarios WHERE rut=?").bind(r.rut).first()) fail(409, "Ese RUT ya tiene perfil. Ingresa con tu PIN.");
    const nombre = txt(body.nombre, 60), apellido = txt(body.apellido, 60), rol = txt(body.rol, 20);
    if (!nombre || !apellido) fail(400, "Nombre y apellido son obligatorios.");
    if (!["administrativo", "clinico", "docente", "estudiante", "laboratorio", "profesional", "directivo"].includes(rol)) fail(400, "Elige tu cargo.");
    let lab = null;
    if (rol === "laboratorio") { lab = await env.DB.prepare("SELECT id FROM laboratorios WHERE id=? AND activo=1").bind(+body.laboratorio_id).first(); if (!lab) fail(400, "Elige tu laboratorio."); }
    const c = contacto(body, rol);
    const estado = rol === "estudiante" ? "ACTIVO" : "PENDIENTE";
    await env.DB.prepare("INSERT INTO usuarios(rut,nombre,apellido,rol,laboratorio_id,estado,telefono,correo,telefono_salida) VALUES(?,?,?,?,?,?,?,?,?)").bind(r.rut, nombre, apellido, rol, lab?.id ?? null, estado, c.telefono, c.correo, c.telefono_salida).run();
    return json({ ok: true, estado });
  }
  if (seg[0] === "firma-entrega" && seg[1]) { // página pública del QR: quien retira firma en su propio teléfono (sin RUT ni PIN)
    await entTablas(env);
    const e = await env.DB.prepare("SELECT * FROM entregas_doc WHERE qr_token=?").bind(txt(seg[1], 80)).first();
    const motivo = !e ? "Este código no es válido o ya fue usado. Pide en recepción que generen uno nuevo." : e.estado !== "PENDIENTE" ? "Este documento ya fue entregado." : Date.now() > +e.qr_expira ? "El código venció (dura 5 minutos). Pide en recepción que generen uno nuevo." : "";
    if (req.method === "GET") return json(motivo ? { valido: false, motivo } : { valido: true, folio: e.folio, documento: e.descripcion, paciente: iniciales(e.paciente_nombre), retira: e.qr_nombre, rut: rutOculto(e.qr_rut) });
    if (req.method === "POST") { if (motivo) fail(409, motivo);
      const firma = String(body.firma || "");
      if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(firma) || firma.length < 800) fail(400, "Falta su firma.");
      if (firma.length > 400000) fail(400, "La firma es demasiado grande; bórrela y vuelva a firmar.");
      if (body.declara !== true) fail(400, "Marque la declaración de recepción.");
      const r = await env.DB.prepare("UPDATE entregas_doc SET estado='ENTREGADA', retira_nombre=qr_nombre, retira_rut=qr_rut, retira_calidad=qr_calidad, firma=?, entrego=qr_por, entrego_rut=qr_por_rut, entregado_en=datetime('now'), firmado_en_telefono='1', qr_token=NULL WHERE id=? AND estado='PENDIENTE' AND qr_token=?")
        .bind(firma, e.id, e.qr_token).run();
      if (!r.meta.changes) fail(409, "Este documento ya fue entregado.");
      return json({ ok: true }); }
  }
  if (seg[0] === "garantia-retro" && seg[1]) { // página pública: el Director de Carrera completa la retroalimentación (sin perfil ni PIN)
    await garTablas(env);
    const en = await env.DB.prepare("SELECT * FROM garantia_enlaces WHERE token_hash=?").bind(await sha(txt(seg[1], 80))).first();
    const g = en ? await env.DB.prepare("SELECT * FROM garantias WHERE id=?").bind(en.garantia_id).first() : null, d = g ? JSON.parse(g.datos || "{}") : {};
    const motivo = !en || !g || en.anulado ? "Este enlace no es válido o fue anulado. Pide al Director Técnico uno nuevo." : en.usado_en ? "Este enlace ya fue usado: la retroalimentación quedó registrada." : Date.now() > en.vence ? "El enlace venció (dura 10 días). Pide al Director Técnico uno nuevo." : g.estado !== "EJECUCION" || d.retro ? "La retroalimentación de este caso ya no está pendiente." : "";
    if (req.method === "GET") { if (motivo) return json({ valido: false, motivo }); const a = d.dt?.anexo || {}, ge = d.gerencia || {};
      return json({ valido: true, codigo: g.codigo, asignatura: g.asignatura, piezas: a.piezas || [], prestacion: a.prestacion || "", resultado: GAR_RES_TXT[ge.tipo] || "", ger_en: ge.en || "", responsabilidad: ge.responsabilidad || "", ejecuta: ge.ejecuta || "", vb_obs: d.dt?.vb_obs || "", causas: GAR_CAUSAS }); }
    if (req.method === "POST") { if (motivo) fail(409, motivo);
      const nombre = txt(body.nombre, 120), cargo = txt(body.cargo, 120); if (nombre.length < 3) fail(400, "Escribe tu nombre."); if (cargo.length < 3) fail(400, "Escribe tu cargo.");
      const firma = String(body.firma || ""); if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(firma) || firma.length < 800) fail(400, "Falta tu firma."); if (firma.length > 400000) fail(400, "La firma es demasiado grande; bórrala y vuelve a firmar.");
      const r_ = retroLimpia(body);
      const up = await env.DB.prepare("UPDATE garantia_enlaces SET usado_en=datetime('now') WHERE token_hash=? AND usado_en IS NULL AND anulado=0").bind(en.token_hash).run(); if (!up.meta.changes) fail(409, "Este enlace ya fue usado.");
      d.retro_link = { ...r_, nombre, cargo, firma, en: new Date().toISOString() };
      await env.DB.batch([env.DB.prepare("UPDATE garantias SET datos=? WHERE id=?").bind(JSON.stringify(d), g.id),
        env.DB.prepare("INSERT INTO garantia_eventos(garantia_id,quien,tipo,detalle) VALUES(?,?,?,?)").bind(g.id, `${nombre} (${cargo}) · por enlace`, "RETROALIMENTACIÓN RECIBIDA", "Completada por enlace; falta la revisión y firma del DT")]);
      return json({ ok: true }); }
  }
  if (seg[0] === "logout" && req.method === "POST") {
    const tok = cookieDe(req); if (tok) await env.DB.prepare("DELETE FROM sesiones WHERE token_hash=?").bind(await sha(tok)).run();
    return json({ ok: true }, 200, { "set-cookie": "csu_s=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" });
  }
  return null;
}

/* ---------- rutas con sesión ---------- */
async function rutear(req, env, path) {
  const m = req.method;
  if (["POST", "PUT"].includes(m) && !(req.headers.get("content-type") || "").includes("application/json")) fail(415, "Formato no válido.");
  const body = ["POST", "PUT"].includes(m) ? await req.json().catch(() => ({})) : {};
  const seg = path.split("/").filter(Boolean);
  if (seg[0] === "trabajos" || seg[0] === "solicitudes" || seg[0] === "export.csv" || seg[0] === "traspaso") await asegurarColor(env);
  await migrarTipos(env); await plazoCerna(env); await migrarVident(env);
  const p = await publico(req, env, seg, body); if (p) return p;

  const u = await usuarioSesion(req, env);
  if (seg[0] === "me" && m === "GET") {
    const labs = (await env.DB.prepare("SELECT * FROM laboratorios ORDER BY nombre").all()).results;
    if (!u) return json({ user: null, laboratorios: labs.filter(l => l.activo) });
    const cfg = await cfgGet(env);
    if (!u.es_admin) cfg.tipos_trabajo = (cfg.tipos_trabajo || []).map(x => typeof x === "string" ? { n: x } : { n: x.n, p: x.p, nota: x.nota, l: x.l, c: x.c });
    if (u.rol === "laboratorio") cfg.tipos_trabajo = (cfg.tipos_trabajo || []).filter(x => !x.l || x.l === u.laboratorio_id);
    let pend_fm = 0;
    if (u.es_admin) { await asegurarColor(env); pend_fm = (await env.DB.prepare("SELECT COUNT(*) AS n FROM trabajos WHERE exc_sol_en IS NOT NULL AND docente_aprobado_en IS NULL AND estado IN ('SOLICITADA','RECEPCIONADA')").first())?.n || 0; }
    let pend_gar = 0;
    if (u.es_admin || u.garantias) { await garTablas(env); const est = u.es_admin ? ["REVISION_DT", "CONOCIMIENTO_DT"] : u.garantias === "GER" ? ["GERENCIA"] : ["EN_DOCENCIA"];
      pend_gar = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM garantias WHERE estado IN (${est.map(() => "?").join(",")})`).bind(...est).first())?.n || 0; }
    let pend_ent = 0;
    if (u.es_admin || u.rol === "directivo" || (u.entregas && CSU.includes(u.rol))) { await entTablas(env); pend_ent = (await env.DB.prepare("SELECT COUNT(*) AS n FROM entregas_doc WHERE estado='PENDIENTE'").first())?.n || 0; }
    return json({ user: u, config: cfg, pend_fm, pend_ent, pend_gar, laboratorios: u.rol === "laboratorio" ? labs.filter(l => l.id === u.laboratorio_id) : labs });
  }
  if (!u) fail(401, "Tu sesión no está iniciada o venció. Ingresa con tu RUT y PIN.");
  const esCSU = CSU.includes(u.rol), admin = !!u.es_admin;

  if (seg[0] === "me" && m === "PUT") {
    const nombre = txt(body.nombre, 60), apellido = txt(body.apellido, 60);
    if (!nombre || !apellido) fail(400, "Nombre y apellido son obligatorios.");
    const c = contacto({ telefono: body.telefono ?? u.telefono, correo: body.correo ?? u.correo, telefono_salida: body.telefono_salida ?? u.telefono_salida }, u.rol);
    await env.DB.prepare("UPDATE usuarios SET nombre=?, apellido=?, telefono=?, correo=?, telefono_salida=? WHERE rut=?").bind(nombre, apellido, c.telefono, c.correo, c.telefono_salida, u.rut).run();
    return json({ ok: true });
  }

  if (seg[0] === "admin" && seg[1] === "cfg-base") { // configuración base del Auditor (tarifas): solo administrador
    if (!admin) fail(403, "Solo el administrador.");
    return json(CFG_BASE);
  }

  if ((seg[0] === "estudiante" || seg[0] === "docente") && seg[1]) { // autocompletar datos al registrar una orden
    if (!esCSU) fail(403, "Sin acceso.");
    const r = rutNorm(decodeURIComponent(seg[1])); if (!r) return json({});
    const k = seg[0];
    const p = await env.DB.prepare("SELECT nombre,apellido,telefono,correo FROM usuarios WHERE rut=?").bind(r.rut).first();
    const t = await env.DB.prepare(`SELECT ${k}_nombre AS n, ${k}_telefono AS tel, ${k}_correo AS mail FROM trabajos WHERE ${k}_rut=? AND UPPER(LTRIM(COALESCE(presupuesto,''))) NOT LIKE 'PRUEBA%' ORDER BY id DESC LIMIT 1`).bind(r.rut).first();
    const out = { nombre: p ? `${p.nombre} ${p.apellido}`.trim() : t?.n || "", telefono: p?.telefono || t?.tel || "", correo: p?.correo || t?.mail || "" };
    if (k === "estudiante") { // su docente habitual (último trabajo)
      const d = await env.DB.prepare("SELECT docente_rut,docente_nombre,docente_telefono,docente_correo FROM trabajos WHERE estudiante_rut=? AND COALESCE(docente_rut,'')<>'' AND UPPER(LTRIM(COALESCE(presupuesto,''))) NOT LIKE 'PRUEBA%' ORDER BY id DESC LIMIT 1").bind(r.rut).first();
      if (d) out.docente = { rut: d.docente_rut, nombre: d.docente_nombre, telefono: d.docente_telefono, correo: d.docente_correo };
    }
    return json(out);
  }

  if (seg[0] === "paciente" && m === "GET") { // autocompletar paciente por RUT o código SMILE (estudiante: solo de sus propios trabajos)
    const solR = u.rol === "estudiante" || u.rol === "profesional";
    if (!esCSU && !solR) fail(403, "Sin acceso.");
    const sp = new URL(req.url).searchParams, smile = txt(sp.get("smile"), 30), rr = rutNorm(sp.get("rut"));
    if (!smile && !rr) return json({});
    const w = rr ? "paciente_rut=?" : "codigo_smile=?", v = rr ? rr.rut : smile;
    const t = await env.DB.prepare(`SELECT paciente_nombre,paciente_rut,codigo_smile FROM trabajos WHERE ${w} AND COALESCE(paciente_nombre,'')<>'' AND UPPER(LTRIM(COALESCE(presupuesto,''))) NOT LIKE 'PRUEBA%'${solR ? " AND estudiante_rut=?" : ""} ORDER BY id DESC LIMIT 1`).bind(...(solR ? [v, u.rut] : [v])).first();
    return json(t ? { nombre: t.paciente_nombre, rut: t.paciente_rut, smile: t.codigo_smile } : {});
  }

  if (seg[0] === "mi-docente" && m === "GET") { // docente habitual del estudiante que hace la solicitud
    if (u.rol !== "estudiante") return json({});
    const d = await env.DB.prepare("SELECT docente_rut FROM trabajos WHERE estudiante_rut=? AND COALESCE(docente_rut,'')<>'' AND UPPER(LTRIM(COALESCE(presupuesto,''))) NOT LIKE 'PRUEBA%' ORDER BY id DESC LIMIT 1").bind(u.rut).first();
    return json({ rut: d?.docente_rut || "" });
  }


  if (seg[0] === "fichas") {
    if (!admin) fail(403, "La auditoría de fichas es solo para el administrador.");
    await fcTablas(env);
    const medicion = async id => (await env.DB.prepare("SELECT * FROM fc_mediciones WHERE id=?").bind(+id).first()) || fail(404, "Medición no encontrada.");
    if (seg[1] === "mediciones" && !seg[2] && m === "GET") {
      const r = (await env.DB.prepare(`SELECT m.*, (SELECT COUNT(*) FROM fc_evaluaciones e WHERE e.medicion_id=m.id AND e.vigente=1) AS evaluadas,
        (SELECT COUNT(*) FROM fc_evaluaciones e WHERE e.medicion_id=m.id AND e.vigente=1 AND e.cumple=1) AS cumplen FROM fc_mediciones m ORDER BY m.id DESC`).all()).results;
      return json(r);
    }
    if (seg[1] === "mediciones" && !seg[2] && m === "POST") {
      const unidad = FC_CRIT[body.unidad] ? body.unidad : fail(400, "Unidad inválida.");
      if (![body.desde, body.hasta, body.mes_inicio].every(mesOk)) fail(400, "Indica los meses del universo y el mes de inicio de la evaluación.");
      if (body.desde > body.hasta) fail(400, "El período del universo está al revés.");
      const conf = [90, 95, 99].includes(+body.conf) ? +body.conf : 95, err = +body.err, p = +body.p;
      if (!(err > 0 && err <= 0.2) || !(p > 0 && p < 1)) fail(400, "Parámetros de muestra inválidos.");
      const vistos = new Map();
      for (const x of Array.isArray(body.universo) ? body.universo : []) { const rut = txt(x.rut, 12).toUpperCase(); if (/^\d{6,8}-[\dK]$/.test(rut) && !vistos.has(rut)) vistos.set(rut, txt(x.nombre, 120)); }
      const lista = [...vistos.keys()].sort(); const N = lista.length;
      if (N < 2) fail(400, "El universo debe tener al menos 2 pacientes con RUT válido.");
      if (N > 60000) fail(400, "El universo es demasiado grande.");
      const hash = await sha256(lista.join("\n"));
      if (txt(body.hash) && body.hash !== hash) fail(400, "La huella del listado no coincide con la calculada en tu equipo. Vuelve a cargar el archivo.");
      const ya = await env.DB.prepare("SELECT id FROM fc_mediciones WHERE unidad=? AND desde=? AND hasta=? AND estado='ACTIVA'").bind(unidad, body.desde, body.hasta).first();
      if (ya) fail(409, "Ya existe una medición activa para esa unidad y período. Para sortear de nuevo, primero anúlala con un motivo.");
      const calc = fcN(N, conf, err, p), manual = Math.round(+body.n_manual || 0);
      if (manual && (manual < 1 || manual > N)) fail(400, "La muestra ingresada debe estar entre 1 y el tamaño del universo.");
      const n = manual || calc, cuota = Math.ceil(n / 6), reserva = Math.min(N - n, Math.max(5, Math.ceil(n * 0.2)));
      const semilla = [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, "0")).join("");
      const orden = fcBarajar(lista, semilla).slice(0, n + reserva);
      const regla = Math.min(100, Math.max(50, Math.round(+body.regla || 100))), umbral = Math.min(100, Math.max(1, Math.round(+body.umbral || 60)));
      const ins = await env.DB.prepare(`INSERT INTO fc_mediciones(unidad,desde,hasta,mes_inicio,universo_n,hash,semilla,parametros,n_muestra,cuota,origen_n,regla,umbral,creado_por) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(unidad, body.desde, body.hasta, body.mes_inicio, N, hash, semilla, JSON.stringify({ conf, err, p, calculada: calc, filtro: body.filtro && body.filtro.col ? { col: txt(body.filtro.col, 80), vals: (Array.isArray(body.filtro.vals) ? body.filtro.vals : []).slice(0, 60).map(v => txt(v, 120)) } : null, archivo: txt(body.archivo, 120) }), n, cuota, manual ? "MANUAL" : "CALCULADA", regla, umbral, nombreDe(u)).run();
      const id = ins.meta.last_row_id, st = [];
      orden.forEach((rut, i) => st.push(env.DB.prepare("INSERT INTO fc_muestra(medicion_id,orden,rut,paciente,mes,estado) VALUES(?,?,?,?,?,?)")
        .bind(id, i + 1, rut, vistos.get(rut) || "", i < n ? Math.floor(i / cuota) + 1 : null, i < n ? "PENDIENTE" : "RESERVA")));
      for (let i = 0; i < st.length; i += 90) await env.DB.batch(st.slice(i, i + 90));
      return json({ id });
    }
    if (seg[1] === "mediciones" && seg[2] && !seg[3] && m === "GET") {
      const med = await medicion(seg[2]);
      const muestra = (await env.DB.prepare("SELECT * FROM fc_muestra WHERE medicion_id=? ORDER BY orden").bind(med.id).all()).results;
      const evals = (await env.DB.prepare("SELECT * FROM fc_evaluaciones WHERE medicion_id=? ORDER BY muestra_id, version").bind(med.id).all()).results;
      return json({ medicion: med, muestra, evaluaciones: evals });
    }
    if (seg[1] === "mediciones" && seg[2] && seg[3] === "anular" && m === "POST") {
      const med = await medicion(seg[2]); const motivo = txt(body.motivo, 300);
      if (motivo.length < 10) fail(400, "Escribe el motivo de la anulación (mínimo 10 caracteres).");
      if (med.estado !== "ACTIVA") fail(409, "La medición ya está anulada.");
      await env.DB.prepare("UPDATE fc_mediciones SET estado='ANULADA', anulada_motivo=? WHERE id=?").bind(`${motivo} (${nombreDe(u)}, ${new Date().toISOString().slice(0, 10)})`, med.id).run();
      return json({ ok: true });
    }
    if (seg[1] === "muestra" && seg[2] && seg[3]) {
      const fila = (await env.DB.prepare("SELECT * FROM fc_muestra WHERE id=?").bind(+seg[2]).first()) || fail(404, "Ficha no encontrada en la muestra.");
      const med = await medicion(fila.medicion_id);
      if (med.estado !== "ACTIVA") fail(409, "La medición está anulada.");
      const vig = await env.DB.prepare("SELECT * FROM fc_evaluaciones WHERE muestra_id=? AND vigente=1").bind(fila.id).first();
      if (seg[3] === "reemplazar" && m === "POST") {
        const motivo = txt(body.motivo, 300);
        if (motivo.length < 10) fail(400, "Escribe por qué esta ficha no se puede evaluar (mínimo 10 caracteres).");
        if (fila.estado !== "PENDIENTE" || vig) fail(409, "Solo se reemplaza una ficha sorteada que aún no ha sido evaluada.");
        const res = (await env.DB.prepare("SELECT * FROM fc_muestra WHERE medicion_id=? AND estado='RESERVA' ORDER BY orden LIMIT 1").bind(med.id).first()) || fail(409, "No quedan fichas de reserva en esta medición.");
        await env.DB.batch([
          env.DB.prepare("UPDATE fc_muestra SET estado='REEMPLAZADA', motivo=?, actualizado_en=datetime('now') WHERE id=?").bind(`${motivo} (${nombreDe(u)})`, fila.id),
          env.DB.prepare("UPDATE fc_muestra SET estado='PENDIENTE', mes=?, reemplaza_a=?, actualizado_en=datetime('now') WHERE id=?").bind(fila.mes, fila.id, res.id),
        ]);
        return json({ ok: true, nuevo: res.id });
      }
      if (seg[3] === "evaluar" && m === "POST") {
        if (!["PENDIENTE", "EVALUADA"].includes(fila.estado)) fail(409, "Esta ficha no está en la muestra vigente.");
        const keys = FC_CRIT[med.unidad], it = body.items || {}, items = {};
        for (const k of keys) {
          const v = it[k]?.v, obs = txt(it[k]?.obs, 300);
          if (!["C", "NC", "NA"].includes(v)) fail(400, "Falta evaluar uno o más criterios de la pauta.");
          if (v === "NA" && obs.length < 5) fail(400, "Cada \"No aplica\" debe llevar su justificación.");
          if (v === "NC" && obs.length < 5) fail(400, "Cada \"No cumple\" debe indicar qué falta en el registro.");
          items[k] = { v, obs };
        }
        const apl = keys.filter(k => items[k].v !== "NA").length, cum = keys.filter(k => items[k].v === "C").length;
        if (!apl) fail(400, "Debe haber al menos un criterio aplicable.");
        const pct = Math.round(cum / apl * 1000) / 10, cumple = pct >= med.regla ? 1 : 0;
        const nivel = ["Pregrado", "Postgrado"].includes(body.nivel) ? body.nivel : fail(400, "Indica el nivel académico.");
        const fecha = /^\d{4}-\d{2}-\d{2}$/.test(body.fecha || "") ? body.fecha : fail(400, "Fecha de contraloría inválida.");
        const pagos = med.unidad === "ODO" && ["C", "NC", "NA"].includes(body.pagos) ? body.pagos : null;
        const motivo = txt(body.motivo, 300);
        if (vig && motivo.length < 10) fail(400, "Para corregir una evaluación ya guardada, escribe el motivo de la corrección (mínimo 10 caracteres).");
        await env.DB.batch([
          ...(vig ? [env.DB.prepare("UPDATE fc_evaluaciones SET vigente=0 WHERE id=?").bind(vig.id)] : []),
          env.DB.prepare(`INSERT INTO fc_evaluaciones(muestra_id,medicion_id,version,vigente,alumno,docente,nivel,fecha,items,pagos,aplicables,cumplidos,pct,cumple,evaluador,evaluador_rut,motivo)
            VALUES(?,?,?,1,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(fila.id, med.id, (vig?.version || 0) + 1, txt(body.alumno, 120), txt(body.docente, 120), nivel, fecha,
            JSON.stringify(items), pagos, apl, cum, pct, cumple, nombreDe(u), u.rut, vig ? motivo : null),
          env.DB.prepare("UPDATE fc_muestra SET estado='EVALUADA', actualizado_en=datetime('now') WHERE id=?").bind(fila.id),
        ]);
        return json({ ok: true, pct, cumple });
      }
    }
    fail(404, "Ruta no encontrada.");
  }

  if (seg[0] === "admin" && seg[1] === "fotos" && admin) { // espacio de fotos y liberación
    const meses = Math.max(1, Math.min(60, Math.round(+new URL(req.url).searchParams.get("meses") || +body.meses || 6)));
    const W = `SELECT f.id FROM fotos f JOIN trabajos t ON t.id=f.trabajo_id WHERE t.estado IN ('TERMINADO','REQUIERE_AJUSTE','ANULADA') AND t.actualizado_en < datetime('now', '-${meses} months')`;
    if (m === "GET" && !seg[2]) {
      const tot = await env.DB.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(bytes),0) AS b FROM fotos").first();
      const viejas = await env.DB.prepare(`SELECT COUNT(*) AS n, COALESCE(SUM(bytes),0) AS b FROM fotos WHERE id IN (${W})`).first();
      return json({ total: tot.n, bytes: tot.b, meses, antiguas: viejas.n, bytesAntiguas: viejas.b });
    }
    if (m === "GET" && seg[2] === "lista") {
      return json((await env.DB.prepare(`SELECT f.id,f.trabajo_id,f.en,f.mime,f.nota,t.num_orden FROM fotos f JOIN trabajos t ON t.id=f.trabajo_id WHERE f.id IN (${W}) ORDER BY f.trabajo_id,f.id`).all()).results);
    }
    if (m === "POST" && seg[2] === "liberar") {
      const afect = (await env.DB.prepare(`SELECT trabajo_id, COUNT(*) AS n FROM fotos WHERE id IN (${W}) GROUP BY trabajo_id`).all()).results;
      const total = afect.reduce((a, x) => a + x.n, 0);
      if (!total) return json({ ok: true, borradas: 0 });
      await env.DB.batch([...afect.map(x => evento(env, x.trabajo_id, u, "FOTOS ELIMINADAS (LIBERAR ESPACIO)", `${x.n} foto(s) de un trabajo cerrado hace más de ${meses} mes(es)`)),
        env.DB.prepare(`DELETE FROM fotos WHERE id IN (${W})`)]);
      return json({ ok: true, borradas: total });
    }
  }

  if (seg[0] === "docentes" && m === "GET") { // lista para elegir el docente a cargo (el estudiante ve solo nombre y RUT)
    if (!esCSU && u.rol !== "estudiante") fail(403, "Sin acceso.");
    return json((await env.DB.prepare(`SELECT rut,nombre,apellido${esCSU ? ",telefono,correo" : ""} FROM usuarios WHERE rol='docente' AND estado='ACTIVO' ORDER BY apellido,nombre`).all()).results);
  }

  if (seg[0] === "garantias") {
    await garTablas(env);
    const gr = admin ? "DT" : (u.garantias === "OPS" || u.garantias === "GER") && ["administrativo", "clinico", "directivo"].includes(u.rol) ? u.garantias : "";
    if (!gr) fail(403, "No tienes acceso a garantías clínicas.");
    const cargo = gr === "DT" ? "Director Técnico" : gr === "GER" ? "Gerente de Sede" : "Jefatura de Operaciones";
    const ev = (id, tipo, det) => env.DB.prepare("INSERT INTO garantia_eventos(garantia_id,quien,tipo,detalle) VALUES(?,?,?,?)").bind(id, `${nombreDe(u)} (${cargo})`, tipo, txt(det, 400));
    const firmaOk = f => { f = String(f || ""); if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(f) || f.length < 800) fail(400, "Falta la firma."); if (f.length > 400000) fail(400, "La firma es demasiado grande; bórrala y vuelve a firmar."); return f; };
    if (!seg[1] && m === "GET") return json((await env.DB.prepare("SELECT id,codigo,estado,resultado,paciente_nombre,paciente_rut,estudiante,asignatura,docente_tutor,aplica,entregado_en,etapa_en,datos FROM garantias ORDER BY id DESC LIMIT 3000").all()).results.map(x => {
      const d = JSON.parse(x.datos || "{}"); delete x.datos; return { ...x, hechos: GAR_CIERRE.filter(k => d[k]), retro_link: !!d.retro_link && !d.retro, ger_en: d.gerencia?.en || "", mi_rol: gr }; }));
    if (seg[1] === "eliminados" && m === "GET") { if (gr !== "DT") fail(403, "Solo el Director Técnico."); return json((await env.DB.prepare("SELECT codigo,quien,motivo,en FROM garantia_eliminados ORDER BY id DESC LIMIT 500").all()).results); }
    if (seg[1] === "export.csv" && m === "GET") {
      const r = (await env.DB.prepare("SELECT * FROM garantias ORDER BY id").all()).results; const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const head = ["codigo", "estado", "resultado", "paciente", "rut", "estudiante", "asignatura", "docente_tutor", "docencia", "piezas", "responsabilidad", "ejecuta", "cubre", "a_pago", "monto_devolucion", "formulario_entregado", "ultima_etapa"];
      const lines = r.map(x => { const d = JSON.parse(x.datos || "{}"), g = d.gerencia || {}, a = (d.dt || {}).anexo || (d.recepcion || {}).anexo || {};
        return [x.codigo, x.estado, x.resultado, x.paciente_nombre, x.paciente_rut, x.estudiante, x.asignatura, x.docente_tutor, x.aplica, (a.piezas || []).join(" "), g.responsabilidad, g.ejecuta, g.cubre, g.a_pago, g.monto, x.entregado_en, x.etapa_en].map(esc).join(";"); });
      return new Response("\ufeff" + [head.join(";"), ...lines].join("\r\n"), { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="garantias-clinicas.csv"`, "cache-control": "no-store" } }); }
    if (!seg[1] && m === "POST") { // A0: Operaciones entrega el formulario (Anexo 1) al estudiante
      if (gr === "GER") fail(403, "El caso lo abre Operaciones.");
      const nom = txt(body.paciente_nombre, 120); if (nom.length < 3) fail(400, "Indica el nombre del paciente.");
      const r = rutNorm(body.paciente_rut); if (!r || !r.ok) fail(400, "RUT del paciente inválido.");
      const y = new Date(Date.now() - 3 * 3600_000).getUTCFullYear(), prev = (await env.DB.prepare("SELECT codigo FROM garantias WHERE codigo LIKE ?").bind(`G-${y}-%`).all()).results;
      const codigo = `G-${y}-${String(Math.max(0, ...prev.map(x => +x.codigo.split("-")[2] || 0)) + 1).padStart(3, "0")}`;
      const ins = await env.DB.prepare("INSERT INTO garantias(codigo,estado,paciente_nombre,paciente_rut,telefono,apoderado,estudiante,asignatura,docente_tutor,creado_por) VALUES(?,?,?,?,?,?,?,?,?,?)")
        .bind(codigo, "EN_DOCENCIA", nom, r.rut, txt(body.telefono, 30), txt(body.apoderado, 120), txt(body.estudiante, 120), txt(body.asignatura, 160), txt(body.docente_tutor, 120), `${nombreDe(u)} (${cargo})`).run();
      if (body.formato_anterior) await env.DB.prepare("UPDATE garantias SET datos=? WHERE id=?").bind(JSON.stringify({ inicio: { formato_anterior: true } }), ins.meta.last_row_id).run();
      await ev(ins.meta.last_row_id, body.formato_anterior ? "CASO CREADO CON FORMULARIO ANTERIOR" : "FORMULARIO ENTREGADO AL ESTUDIANTE", body.formato_anterior ? `Caso ${codigo}: el estudiante ya trae el formulario (formato anterior); se sube firmado.` : `Caso ${codigo}: el estudiante lo revisa con docencia (docente tutor 3 días hábiles; coordinador y director de carrera 5 días hábiles).`).run();
      return json({ id: ins.meta.last_row_id, codigo }); }
    if (seg[1]) {
      const g = await env.DB.prepare("SELECT * FROM garantias WHERE id=?").bind(+seg[1]).first(); if (!g) fail(404, "Caso no encontrado.");
      if (seg[2] === "archivo" && m === "POST") { // formulario firmado (PDF/foto) o pagos (Excel/imagen); reemplaza el anterior del mismo tipo
        if (gr === "GER") fail(403, "Los archivos los suben Operaciones o el DT.");
        const tipo = body.tipo === "pagos" ? "pagos" : body.tipo === "formulario" ? "formulario" : body.tipo === "acta" ? "acta" : fail(400, "Tipo de archivo inválido.");
        if (tipo === "acta" ? g.estado !== "EJECUCION" : !["EN_DOCENCIA", "REVISION_DT", "CONOCIMIENTO_DT"].includes(g.estado)) fail(409, "En esta etapa ya no se cambian los archivos.");
        const mm = String(body.data || "").match(/^data:([^;,]+);base64,([A-Za-z0-9+/=]+)$/); if (!mm) fail(400, "Archivo no válido.");
        const mime = mm[1] === "application/octet-stream" && /\.xlsx$/i.test(body.nombre || "") ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : mm[1];
        if (!GAR_MIME[mime]) fail(400, "Formato no permitido (PDF, imagen, Excel o CSV).");
        const bin = Uint8Array.from(atob(mm[2]), c => c.charCodeAt(0)); if (bin.length > GAR_MAX) fail(413, "El archivo pesa más de 8 MB. Escanéalo con menor resolución o en blanco y negro.");
        const n = Math.ceil(bin.length / GAR_PARTE) || 1;
        await env.DB.prepare("UPDATE garantia_archivos SET vigente=0 WHERE garantia_id=? AND tipo=?").bind(g.id, tipo).run();
        const ins = await env.DB.prepare("INSERT INTO garantia_archivos(garantia_id,tipo,nombre,mime,bytes,partes,quien) VALUES(?,?,?,?,?,?,?)").bind(g.id, tipo, txt(body.nombre, 120), mime, bin.length, n, `${nombreDe(u)} (${cargo})`).run();
        const aid = ins.meta.last_row_id, st = [];
        for (let i = 0; i < n; i++) st.push(env.DB.prepare("INSERT INTO garantia_arch_partes(archivo_id,n,data) VALUES(?,?,?)").bind(aid, i, bin.slice(i * GAR_PARTE, (i + 1) * GAR_PARTE).buffer));
        await env.DB.batch(st); await ev(g.id, "ARCHIVO SUBIDO", `${tipo === "pagos" ? "Pagos" : tipo === "acta" ? "Acta de retroalimentación" : "Formulario"}: ${txt(body.nombre, 120)} (${Math.round(bin.length / 1024)} KB)`).run();
        return json({ ok: true, id: aid }); }
      if (seg[2] === "archivo" && seg[3] && m === "GET") {
        const a = await env.DB.prepare("SELECT * FROM garantia_archivos WHERE id=? AND garantia_id=?").bind(+seg[3], g.id).first(); if (!a) fail(404, "Archivo no encontrado.");
        const ps = (await env.DB.prepare("SELECT data FROM garantia_arch_partes WHERE archivo_id=? ORDER BY n").bind(a.id).all()).results.map(x => new Uint8Array(x.data));
        const out = new Uint8Array(ps.reduce((s_, x) => s_ + x.length, 0)); let o = 0; ps.forEach(x => { out.set(x, o); o += x.length; });
        return new Response(out, { headers: { "content-type": a.mime, "content-disposition": `inline; filename="${encodeURIComponent(a.nombre || "archivo")}"`, "cache-control": "private, no-store", "x-content-type-options": "nosniff" } }); }
      if (!seg[2] && m === "GET") {
        const archivos = (await env.DB.prepare("SELECT id,tipo,nombre,mime,bytes,quien,en FROM garantia_archivos WHERE garantia_id=? AND vigente=1 ORDER BY id").bind(g.id).all()).results;
        const firmas = (await env.DB.prepare("SELECT etapa,nombre,cargo,firma,nota,en FROM garantia_firmas WHERE garantia_id=? ORDER BY id").bind(g.id).all()).results;
        const eventos = (await env.DB.prepare("SELECT en,quien,tipo,detalle FROM garantia_eventos WHERE garantia_id=? ORDER BY id").bind(g.id).all()).results;
        const enlace = gr === "DT" ? await env.DB.prepare("SELECT en,vence,usado_en FROM garantia_enlaces WHERE garantia_id=? AND anulado=0 ORDER BY en DESC LIMIT 1").bind(g.id).first() : null;
        return json({ ...g, datos: JSON.parse(g.datos || "{}"), firmas, eventos, archivos, enlace, mi_rol: gr }); }
      if (seg[2] === "eliminar" && m === "POST") { // solo el DT: casos de prueba o creados por error; queda una línea sin datos del paciente
        if (gr !== "DT") fail(403, "Solo el Director Técnico puede eliminar casos.");
        if (txt(body.codigo, 20).toUpperCase() !== g.codigo) fail(400, `Para confirmar, escribe el código del caso (${g.codigo}).`);
        const mo = txt(body.motivo, 200); if (mo.length < 5) fail(400, "Indica el motivo.");
        const arch = (await env.DB.prepare("SELECT id FROM garantia_archivos WHERE garantia_id=?").bind(g.id).all()).results.map(x => x.id);
        const st = arch.map(a => env.DB.prepare("DELETE FROM garantia_arch_partes WHERE archivo_id=?").bind(a));
        for (const t of ["garantia_archivos", "garantia_firmas", "garantia_eventos", "garantia_enlaces"]) st.push(env.DB.prepare(`DELETE FROM ${t} WHERE garantia_id=?`).bind(g.id));
        st.push(env.DB.prepare("DELETE FROM garantias WHERE id=?").bind(g.id), env.DB.prepare("INSERT INTO garantia_eliminados(codigo,quien,motivo) VALUES(?,?,?)").bind(g.codigo, `${nombreDe(u)} (${cargo})`, mo));
        await env.DB.batch(st); return json({ ok: true }); }
      if (seg[2] === "enlace" && m === "POST") { // enlace para que el Director de Carrera complete la retroalimentación sin perfil
        if (gr !== "DT") fail(403, "Solo el Director Técnico.");
        const d = JSON.parse(g.datos || "{}");
        if (seg[3] === "anular") { await env.DB.prepare("UPDATE garantia_enlaces SET anulado=1 WHERE garantia_id=? AND usado_en IS NULL").bind(g.id).run(); await ev(g.id, "ENLACE ANULADO", "Enlace de retroalimentación anulado").run(); return json({ ok: true }); }
        if (g.estado !== "EJECUCION" || d.retro) fail(409, "La retroalimentación ya no está pendiente.");
        const tok = rnd(18), vence = Date.now() + GAR_TTL_ENLACE;
        await env.DB.batch([env.DB.prepare("UPDATE garantia_enlaces SET anulado=1 WHERE garantia_id=? AND usado_en IS NULL").bind(g.id),
          env.DB.prepare("INSERT INTO garantia_enlaces(token_hash,garantia_id,creado_por,vence) VALUES(?,?,?,?)").bind(await sha(tok), g.id, `${nombreDe(u)} (${cargo})`, vence),
          ev(g.id, "ENLACE DE RETROALIMENTACIÓN", "Enviado al Director de Carrera (vence en 10 días, un solo uso)")]);
        return json({ token: tok, vence }); }
      if (seg[2] === "etapa" && m === "POST") {
        const et = txt(body.etapa, 30), def = GAR_ETAPAS[et]; if (!def) fail(400, "Etapa inválida.");
        if (def[0] !== gr && !(def[0] === "OPS" && gr === "DT")) fail(403, def[0] === "GER" ? "Esta etapa la firma la Gerente de Sede." : def[0] === "DT" ? "Esta etapa la firma el Director Técnico." : "Esta etapa la firma Operaciones.");
        if (!def[1].includes(g.estado)) fail(409, "El caso no está en esta etapa.");
        const d = JSON.parse(g.datos || "{}"); if (GAR_CIERRE.includes(et) && d[et]) fail(409, "Esta etapa ya fue firmada.");
        const dat = body.datos && typeof body.datos === "object" ? body.datos : {}; const crudo = JSON.stringify(dat); if (crudo.length > 30000) fail(400, "Demasiados datos en la etapa.");
        let estado = g.estado, resultado = g.resultado, aplica = g.aplica, nota = "";
        if (et === "recepcion") { const dc = dat.docencia || {}; if (!["APLICA", "NO_APLICA", "SIN_MARCA"].includes(dc.decision)) fail(400, "Indica qué marcó docencia en el formulario.");
          if (!(await env.DB.prepare("SELECT id FROM garantia_archivos WHERE garantia_id=? AND tipo='formulario' AND vigente=1").bind(g.id).first())) fail(400, "Sube el formulario completado por docencia (PDF o foto).");
          aplica = dc.decision; estado = aplica === "NO_APLICA" ? "CONOCIMIENTO_DT" : "REVISION_DT"; nota = `Docencia: ${aplica === "APLICA" ? "aplica" : aplica === "NO_APLICA" ? "no aplica" : "no viene marcado"}`; }
        if (et === "devolver") { const mo = txt(dat.motivo, 200); if (mo.length < 5) fail(400, "Indica qué falta."); estado = "EN_DOCENCIA"; nota = "Devuelto a Operaciones: " + mo; }
        if (et === "desistido") { const mo = txt(dat.motivo, 200); if (mo.length < 5) fail(400, "Indica el motivo."); estado = "CERRADO"; resultado = "DESISTIDO"; nota = mo; }
        if (et === "dt") { if (!Array.isArray(dat.anexo?.piezas) || !dat.anexo.piezas.length) fail(400, "Transcribe las piezas o prestaciones de la solicitud.");
          if (!["VB", "VB_OBS", "NO_VB"].includes(dat.vb)) fail(400, "Indica tu visto bueno."); if (dat.vb !== "VB" && txt(dat.vb_obs).length < 5) fail(400, "Escribe las observaciones."); estado = "GERENCIA"; nota = dat.vb === "VB" ? "V°B" : dat.vb === "VB_OBS" ? "V°B con observaciones" : "Sin V°B"; }
        if (et === "dt_conocimiento") { estado = dat.enviar_gerencia ? "GERENCIA" : "CERRADO"; if (!dat.enviar_gerencia) resultado = "NO_APLICA"; nota = dat.enviar_gerencia ? "Toma conocimiento y envía a Gerencia" : "Toma conocimiento: no aplica según docencia"; }
        if (et === "gerencia") { if (!["TOTAL", "PARCIAL", "DEVOLUCION", "RECHAZO"].includes(dat.tipo)) fail(400, "Indica la resolución.");
          if (dat.tipo === "RECHAZO" && txt(dat.motivo).length < 5) fail(400, "Indica el motivo del rechazo."); if (dat.tipo === "PARCIAL" && (!txt(dat.cubre) || !txt(dat.a_pago))) fail(400, "Indica qué cubre la garantía y qué queda a pago.");
          if (dat.tipo === "DEVOLUCION" && !(+dat.monto > 0)) fail(400, "Indica el monto a devolver.");
          resultado = dat.tipo; estado = dat.tipo === "RECHAZO" ? "CERRADO" : "EJECUCION"; nota = { TOTAL: "Aprobación total", PARCIAL: "Aprobación parcial", DEVOLUCION: "Devolución de monto", RECHAZO: "Rechazo" }[dat.tipo]; }
        if (et === "retro") Object.assign(dat, retroLimpia(dat), { de_enlace: !!(JSON.parse(g.datos || "{}").retro_link && dat.de_enlace) });
        if (GAR_CIERRE.includes(et)) { if (!txt(dat.fecha)) fail(400, "Indica la fecha."); const hechos = GAR_CIERRE.filter(k => k === et || d[k]); if (hechos.length === GAR_CIERRE.length) estado = "CERRADO"; nota = { coordinacion: "Inicio de atención coordinado", presupuesto: "Presupuesto en garantía y reporte", ejecucion: "Tratamiento en garantía realizado", retro: "Retroalimentación" }[et]; }
        const fir = et === "desistido" || et === "devolver" ? null : firmaOk(body.firma);
        d[et] = { ...dat, por: `${nombreDe(u)} (${cargo})`, en: new Date().toISOString() };
        const st = [env.DB.prepare("UPDATE garantias SET datos=?, estado=?, resultado=?, aplica=?, etapa_en=datetime('now') WHERE id=? AND estado=?").bind(JSON.stringify(d), estado, resultado, aplica, g.id, g.estado), ev(g.id, et.toUpperCase().replace("_", " "), nota)];
        if (fir) st.push(env.DB.prepare("INSERT INTO garantia_firmas(garantia_id,etapa,nombre,cargo,rut,firma,nota) VALUES(?,?,?,?,?,?,?)").bind(g.id, et, nombreDe(u), cargo, u.rut, fir, nota));
        const res = await env.DB.batch(st); if (!res[0].meta.changes) fail(409, "El caso cambió mientras lo editabas; vuelve a abrirlo.");
        return json({ ok: true, estado }); }
    }
    fail(404, "Ruta no encontrada.");
  }
  if (seg[0] === "entregas") {
    await entTablas(env);
    const puedeEnt = admin || (!!u.entregas && esCSU) || u.rol === "directivo";   // Gerencia ve el libro y entrega
    if (!puedeEnt) fail(403, "No tienes permiso para entregas de documentos.");
    const rutOk = v => { const r = rutNorm(v); if (!r || !r.ok) fail(400, "RUT inválido (revisa el dígito verificador)."); return r.rut; };
    if (seg[1] === "folio" && m === "GET") { if (!admin) fail(403, "Solo el administrador.");
      const y = new Date(Date.now() - 3 * 3600_000).getUTCFullYear(), r = await env.DB.prepare("SELECT folio FROM entregas_doc WHERE folio LIKE ?").bind(y + "-%").all();
      const n = Math.max(0, ...r.results.map(x => +String(x.folio).split("-")[1] || 0)) + 1; return json({ folio: `${y}-${String(n).padStart(3, "0")}` }); }
    if (!seg[1] && m === "GET") {
      // el libro lo ven el DT y quienes tienen el permiso de entregas (pueden reimprimir constancias)
      return json((await env.DB.prepare(`SELECT id,folio,tipo,descripcion,paciente_nombre,paciente_rut,ficha,solicitante,solicitante_rut,calidad,motivo,fecha_solicitud,estado,creado_por,creado_en,retira_nombre,retira_rut,retira_calidad,entrego,entregado_en,anulada_motivo
        FROM entregas_doc ORDER BY id DESC LIMIT 3000`).all()).results); }
    if (!seg[1] && m === "POST") { if (!admin) fail(403, "Solo el administrador envía documentos a entrega.");
      const folio = txt(body.folio, 20); if (!/^\d{4}-\d{1,6}$/.test(folio)) fail(400, "N° de solicitud inválido (formato 2026-001).");
      const ya = await env.DB.prepare("SELECT id,estado FROM entregas_doc WHERE folio=?").bind(folio).first();
      if (ya && ya.estado !== "ANULADA") fail(409, ya.estado === "ENTREGADA" ? `La solicitud N° ${folio} ya fue entregada.` : `La solicitud N° ${folio} ya está pendiente de entrega en recepción.`);
      if (ya) await env.DB.prepare("DELETE FROM entregas_doc WHERE id=?").bind(ya.id).run();
      const desc = txt(body.descripcion, 300) || fail(400, "Falta la descripción del documento.");
      await env.DB.prepare(`INSERT INTO entregas_doc(folio,tipo,descripcion,paciente_nombre,paciente_rut,ficha,solicitante,solicitante_rut,calidad,motivo,fecha_solicitud,creado_por) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`)
        .bind(folio, txt(body.tipo, 40) || "copia_ficha", desc, txt(body.paciente_nombre, 120), rutOk(body.paciente_rut), txt(body.ficha, 20), txt(body.solicitante, 120), rutOk(body.solicitante_rut), txt(body.calidad, 80), txt(body.motivo, 300), txt(body.fecha_solicitud, 10), quienEs(u)).run();
      return json({ ok: true }); }
    if (seg[1]) {
      const e = await env.DB.prepare("SELECT * FROM entregas_doc WHERE id=?").bind(+seg[1]).first(); if (!e) fail(404, "Entrega no encontrada.");
      if (!seg[2] && m === "GET") { delete e.qr_token; return json(e); }
      if (seg[2] === "qr" && m === "POST") { // recepción verificó la cédula: genera el QR para que firme en su teléfono
        if (e.estado !== "PENDIENTE") fail(409, "Este documento ya no está pendiente de entrega.");
        const nom = txt(body.retira_nombre, 120); if (nom.length < 3) fail(400, "Indica el nombre de quien retira.");
        const rr = rutOk(body.retira_rut), tok = rnd(16), exp = Date.now() + TTL_FIRMA;
        await env.DB.prepare("UPDATE entregas_doc SET qr_token=?, qr_expira=?, qr_nombre=?, qr_rut=?, qr_calidad=?, qr_por=?, qr_por_rut=? WHERE id=?").bind(tok, String(exp), nom, rr, txt(body.retira_calidad, 80), quienEs(u), u.rut, e.id).run();
        return json({ token: tok, expira: exp }); }
      if (seg[2] === "estado" && m === "GET") return json({ estado: e.estado, retira: e.retira_nombre || "" });
      if (seg[2] === "entregar" && m === "POST") {
        if (e.estado !== "PENDIENTE") fail(409, "Este documento ya no está pendiente de entrega.");
        const nom = txt(body.retira_nombre, 120); if (nom.length < 3) fail(400, "Indica el nombre de quien retira.");
        const rr = rutOk(body.retira_rut), firma = String(body.firma || "");
        if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(firma) || firma.length < 800) fail(400, "Falta la firma de quien retira.");
        if (firma.length > 400000) fail(400, "La firma es demasiado grande; bórrala y vuelve a firmar.");
        if (body.declara !== true) fail(400, "Quien retira debe marcar la declaración de recepción.");
        await env.DB.prepare("UPDATE entregas_doc SET estado='ENTREGADA', retira_nombre=?, retira_rut=?, retira_calidad=?, firma=?, entrego=?, entrego_rut=?, entregado_en=datetime('now'), qr_token=NULL WHERE id=? AND estado='PENDIENTE'")
          .bind(nom, rr, txt(body.retira_calidad, 80), firma, quienEs(u), u.rut, e.id).run();
        return json({ ok: true }); }
      if (seg[2] === "anular" && m === "POST") { if (!admin) fail(403, "Solo el administrador.");
        if (e.estado !== "PENDIENTE") fail(409, "Solo se anulan entregas pendientes."); const mo = txt(body.motivo, 200); if (mo.length < 5) fail(400, "Indica el motivo.");
        await env.DB.prepare("UPDATE entregas_doc SET estado='ANULADA', anulada_motivo=? WHERE id=?").bind(mo, e.id).run(); return json({ ok: true }); }
    }
    fail(404, "Ruta no encontrada.");
  }
  if (seg[0] === "usuarios") {
    if (!admin) fail(403, "Solo el administrador.");
    if (m === "GET") return json((await env.DB.prepare("SELECT * FROM usuarios ORDER BY CASE estado WHEN 'PENDIENTE' THEN 0 ELSE 1 END, rol, apellido, nombre").all()).results);
    if (m === "DELETE" && seg[1]) { // eliminar un perfil (el historial de los trabajos conserva los nombres como texto)
      const r = rutNorm(decodeURIComponent(seg[1])); if (!r) fail(400, "RUT inválido.");
      const x = await env.DB.prepare("SELECT * FROM usuarios WHERE rut=?").bind(r.rut).first(); if (!x) fail(404, "Ese perfil no existe.");
      if (x.es_admin || esAdminRut(env, r.rut)) fail(400, "El perfil de administrador no se elimina.");
      await env.DB.batch([env.DB.prepare("DELETE FROM sesiones WHERE rut=?").bind(r.rut), env.DB.prepare("DELETE FROM fallos WHERE clave=?").bind("rut:" + r.rut), env.DB.prepare("DELETE FROM usuarios WHERE rut=?").bind(r.rut)]);
      return json({ ok: true });
    }
    if (m === "POST") {
      const r = rutNorm(body.rut); if (!r || !r.ok) fail(400, "RUT inválido.");
      const rol = txt(body.rol, 20);
      if (!["administrativo", "clinico", "docente", "estudiante", "laboratorio", "profesional", "directivo"].includes(rol)) fail(400, "Cargo inválido.");
      const lab = rol === "laboratorio" ? (+body.laboratorio_id || fail(400, "Elige el laboratorio de esta persona.")) : null;
      const estado = ["ACTIVO", "PENDIENTE", "INACTIVO"].includes(body.estado) ? body.estado : "ACTIVO";
      if (r.rut === u.rut && (estado !== "ACTIVO" || !body.es_admin)) fail(400, "No puedes quitarte el acceso de administrador a ti mismo.");
      await env.DB.prepare(`INSERT INTO usuarios(rut,nombre,apellido,rol,laboratorio_id,es_admin,estado,aprobado_por) VALUES(?,?,?,?,?,?,?,?)
        ON CONFLICT(rut) DO UPDATE SET nombre=CASE WHEN excluded.nombre<>'' THEN excluded.nombre ELSE nombre END,
        apellido=CASE WHEN excluded.apellido<>'' THEN excluded.apellido ELSE apellido END, rol=excluded.rol, laboratorio_id=excluded.laboratorio_id,
        es_admin=excluded.es_admin, estado=excluded.estado, aprobado_por=excluded.aprobado_por`)
        .bind(r.rut, txt(body.nombre, 60), txt(body.apellido, 60), rol, lab, body.es_admin ? 1 : 0, estado, nombreDe(u)).run();
      if (body.garantias != null) { await garTablas(env); await env.DB.prepare("UPDATE usuarios SET garantias=? WHERE rut=?").bind(["OPS", "GER"].includes(body.garantias) && ["administrativo", "clinico", "directivo"].includes(rol) ? body.garantias : null, r.rut).run(); }
      if (body.entregas != null) { await entTablas(env); await env.DB.prepare("UPDATE usuarios SET entregas=? WHERE rut=?").bind(body.entregas && ["administrativo", "clinico"].includes(rol) ? 1 : 0, r.rut).run(); }
      if (estado !== "ACTIVO") await env.DB.prepare("DELETE FROM sesiones WHERE rut=?").bind(r.rut).run();
      return json({ ok: true });
    }
  }

  if (seg[0] === "admin" && seg[1] === "borrar-prueba" && m === "POST") { // capacitación: borra definitivamente los trabajos con presupuesto PRUEBA…
    if (!admin) fail(403, "Solo el administrador.");
    const W = "SELECT id FROM trabajos WHERE upper(trim(presupuesto)) LIKE 'PRUEBA%'";
    const n = (await env.DB.prepare(`SELECT COUNT(*) AS n FROM (${W})`).first()).n;
    if (!n) return json({ ok: true, borrados: 0 });
    await env.DB.batch([
      env.DB.prepare(`UPDATE trabajos SET orden_padre=NULL WHERE orden_padre IN (${W})`),
      env.DB.prepare(`DELETE FROM eventos WHERE trabajo_id IN (${W})`),
      env.DB.prepare(`DELETE FROM traspasos WHERE trabajo_id IN (${W})`),
      env.DB.prepare(`DELETE FROM fotos WHERE trabajo_id IN (${W})`),
      env.DB.prepare(`DELETE FROM trabajos WHERE id IN (${W})`),
    ]);
    return json({ ok: true, borrados: n });
  }

  if (seg[0] === "laboratorios" && m === "POST") {
    if (!admin) fail(403, "Solo el administrador.");
    const nombre = txt(body.nombre, 80); if (!nombre) fail(400, "Nombre del laboratorio.");
    if (body.id) await env.DB.prepare("UPDATE laboratorios SET nombre=?, activo=? WHERE id=?").bind(nombre, body.activo === false ? 0 : 1, +body.id).run();
    else await env.DB.prepare("INSERT INTO laboratorios(nombre) VALUES(?)").bind(nombre).run();
    return json({ ok: true });
  }

  if (seg[0] === "config" && seg[1] === "trato" && m === "PUT") { // Dr./Dra. de cada docente, para el saludo de los mensajes
    if (!esCSU && !admin) fail(403, "Sin permiso.");
    const k = txt(body.clave, 80).toLowerCase(), v = body.trato === "Dra." ? "Dra." : body.trato === "Dr." ? "Dr." : ""; if (!k || !v) fail(400, "Indica el docente y el trato.");
    const c = await cfgGet(env), T = (c.tratos && typeof c.tratos === "object") ? c.tratos : {}; T[k] = v;
    await env.DB.prepare("INSERT OR REPLACE INTO config VALUES('tratos',?)").bind(JSON.stringify(T)).run(); return json({ ok: true, tratos: T });
  }
  if (seg[0] === "config" && seg[1] === "encuesta" && m === "PUT") {
    if (!admin) fail(403, "Solo el administrador.");
    const L = a => (Array.isArray(a) ? a : []).map(x => txt(x, 200)).filter(Boolean).slice(0, 4);
    const e = { estudiante: L(body.estudiante), docente: L(body.docente) }; if (!e.estudiante.length || !e.docente.length) fail(400, "Cada encuesta necesita al menos una pregunta (máximo 4).");
    await env.DB.prepare("INSERT OR REPLACE INTO config VALUES('encuesta',?)").bind(JSON.stringify(e)).run(); return json({ ok: true });
  }
  if (seg[0] === "config" && seg[1] === "feriados" && m === "PUT") { // feriados que no cuentan como hábiles (alarma de retiro y plazos)
    if (!admin) fail(403, "Solo el administrador.");
    const L = [...new Set((Array.isArray(body.feriados) ? body.feriados : []).map(x => txt(x, 10)).filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x)))].sort().slice(0, 200);
    await env.DB.prepare("INSERT OR REPLACE INTO config VALUES('feriados',?)").bind(JSON.stringify(L)).run();
    return json({ ok: true, feriados: L });
  }
  if (seg[0] === "config" && seg[1] === "correo-dt" && m === "PUT") {
    if (!admin) fail(403, "Solo el administrador.");
    const c = txt(body.correo_dt, 120).toLowerCase(); if (c && !correoOk(c)) fail(400, "Correo inválido.");
    await env.DB.prepare("INSERT OR REPLACE INTO config VALUES('correo_dt',?)").bind(JSON.stringify(c)).run();
    return json({ ok: true });
  }

  if (seg[0] === "config" && m === "PUT") {
    if (!admin) fail(403, "Solo el administrador.");
    const etapas = (Array.isArray(body.etapas_lab) ? body.etapas_lab : []).map(x => txt(x, 60)).filter(Boolean).slice(0, 40);
    const tipos = (Array.isArray(body.tipos_trabajo) ? body.tipos_trabajo : []).map(x => ({ n: txt(x.n, 140), a: Number.isFinite(+x.a) && x.a !== null && x.a !== "" ? Math.round(+x.a) : null, p: Number.isFinite(+x.p) && x.p !== null && x.p !== "" ? Math.round(+x.p) : null, nota: txt(x.nota, 80), l: +x.l || null, c: txt(x.c, 60) })).filter(x => x.n).slice(0, 900);
    const labIds = new Set((await env.DB.prepare("SELECT id FROM laboratorios").all()).results.map(x => x.id));
    if (tipos.some(x => x.l && !labIds.has(x.l))) fail(400, "Hay prestaciones asignadas a un laboratorio que no existe.");
    if (!etapas.length || !tipos.length) fail(400, "Debe haber al menos una etapa y un tipo de trabajo.");
    await env.DB.batch([
      env.DB.prepare("INSERT OR REPLACE INTO config VALUES('etapas_lab',?)").bind(JSON.stringify(etapas)),
      env.DB.prepare("INSERT OR REPLACE INTO config VALUES('tipos_trabajo',?)").bind(JSON.stringify(tipos)),
    ]);
    return json({ ok: true });
  }

  if (seg[0] === "etiqueta" && seg[1]) {
    const t = await env.DB.prepare("SELECT id,laboratorio_id,estudiante_rut,docente_rut,estado FROM trabajos WHERE qr_token=?").bind(seg[1]).first();
    if (!t || !puedeVer(u, t)) fail(404, "Esta etiqueta no corresponde a un trabajo que puedas ver.");
    return json({ id: t.id });
  }

  if (seg[0] === "trabajos" && !seg[1]) {
    if (m === "GET") {
      let w = "1=1", b = [];
      if (u.rol === "laboratorio") { w = "t.laboratorio_id=? AND t.estado<>'SOLICITADA'"; b = [u.laboratorio_id]; }
      if (u.rol === "estudiante" || u.rol === "profesional") { w = "t.estudiante_rut=?"; b = [u.rut]; }
      if (u.rol === "docente") { w = "t.docente_rut=?"; b = [u.rut]; }
      const r = await env.DB.prepare(`SELECT t.docente_nombre,t.docente_rut, t.id,t.presupuesto,t.num_orden,t.intento,t.orden_padre,t.fecha_recepcion,t.paciente_nombre,t.paciente_rut,t.codigo_smile,
          t.estudiante_nombre,t.estudiante_rut,t.tipo_trabajo,t.arancel,t.plazo_dias,t.diente,t.color,t.items,t.ajuste_items,t.buzon_en,t.buzon_por,t.exc_sol_en,t.exc_sol_por,t.exc_motivo,t.exc_docente,t.etapa_en,t.origen,t.garantia,t.garantia_motivo,t.garantia_por,t.garantia_en,t.garantia_origen,t.digital,t.dig_salida_en,t.dig_recep_en,t.dig_rechazo,t.laboratorio_id,l.nombre AS laboratorio,t.estado,t.etapa_lab,t.actualizado_en,t.creado_en,
          t.docente_aprobado_en,t.docente_aprobado_por,t.entrega_orden_en,t.retiro_lab_en,t.entrega_csu_en,t.retiro_est_en,t.prueba_est_en,t.prueba_est_resultado,t.prueba_en,t.prueba_resultado,
          (SELECT COUNT(*) FROM trabajos h WHERE h.orden_padre=t.id) AS hijos,
          (SELECT COUNT(*) FROM eventos e WHERE e.trabajo_id=t.id AND e.tipo='TRASPASO MANUAL') AS manuales${esCSU || admin ? `, t.estudiante_telefono,
          (SELECT e.en||'|'||e.quien||'|'||e.tipo||'|'||COALESCE(e.detalle,'') FROM eventos e WHERE e.trabajo_id=t.id AND e.tipo IN ('COMUNICACIÓN','AVISO PREPARADO','AVISO AL LABORATORIO') ORDER BY e.id DESC LIMIT 1) AS ult_aviso` : ""}
        FROM trabajos t JOIN laboratorios l ON l.id=t.laboratorio_id WHERE ${w} AND upper(trim(t.presupuesto)) ${new URL(req.url).searchParams.get("prueba") === "1" ? "" : "NOT "}LIKE 'PRUEBA%' ORDER BY t.id DESC LIMIT 3000`).bind(...b).all();
      return json(r.results.map(x => sinPrecio(u, x)));
    }
    if (m === "POST") {
      if (!esCSU) fail(403, "Solo personal del CSU registra órdenes.");
      const d = await datosOrden(env, body, null);
      const ins = await env.DB.prepare(`INSERT INTO trabajos(presupuesto,num_orden,fecha_recepcion,paciente_nombre,paciente_rut,codigo_smile,estudiante_rut,estudiante_nombre,tipo_trabajo,arancel,plazo_dias,diente,laboratorio_id,qr_token,creado_por,
        estudiante_telefono,estudiante_correo,docente_rut,docente_nombre,docente_telefono,docente_correo)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(d.presupuesto, d.num_orden, d.fecha_recepcion, d.paciente_nombre, d.paciente_rut, d.codigo_smile, d.estudiante_rut, d.estudiante_nombre,
        d.tipo_trabajo, d.arancel, d.plazo_dias, d.diente, d.laboratorio_id, rnd(), u.rut, d.estudiante_telefono, d.estudiante_correo, d.docente_rut, d.docente_nombre, d.docente_telefono, d.docente_correo).run();
      const id = ins.meta.last_row_id;
      if (d.color || d.items) await env.DB.prepare("UPDATE trabajos SET color=?, items=? WHERE id=?").bind(d.color || null, d.items || null, id).run();
      if (body.digital) await env.DB.prepare("UPDATE trabajos SET digital='1' WHERE id=?").bind(id).run();
      await evento(env, id, u, "ORDEN RECEPCIONADA", `Presupuesto ${d.presupuesto} · Orden ${d.num_orden}${body.digital ? " · impresión digital" : ""}`).run();
      if (+body.ajuste_de) await vincularAjuste(env, u, id, +body.ajuste_de, d.paciente_rut, d.codigo_smile, esPrueba(d.presupuesto));
      return json({ id });
    }
  }

  if (seg[0] === "ajustes-pendientes" && m === "GET") { const q = new URL(req.url).searchParams;
    let rut = txt(q.get("rut"), 20); const r = rut ? rutNorm(rut) : null; if (r && r.ok) rut = r.rut;
    return json(await ajustesPendientes(env, u, rut, q.get("smile"), q.get("prueba") === "1")); }
  if (seg[0] === "solicitudes" && m === "POST") { // el estudiante solicita el registro; la administrativa lo completa
    if (u.rol !== "estudiante" && u.rol !== "profesional") fail(403, "Las solicitudes las hace el estudiante o el profesional de clínica privada.");
    const priv = u.rol === "profesional";
    if (priv) { body.docente_rut = ""; body.docente_nombre = ""; body.docente_telefono = ""; body.docente_correo = ""; }
    const prueba = !!body.prueba;
    const smile = txt(body.codigo_smile, 30); let prut = txt(body.paciente_rut, 20);
    if (!smile && !prut) fail(400, "Ingresa el código SMILE o el RUT del paciente.");
    if (prut && !prueba) { const r = rutNorm(prut); if (!r || !r.ok) fail(400, "RUT del paciente inválido (revisa el dígito verificador)."); prut = r.rut; }
    let drut = txt(body.docente_rut, 20);
    if (drut && !prueba) { const r = rutNorm(drut); if (!r || !r.ok) fail(400, "RUT del docente inválido."); drut = r.rut; }
    const lab = (+body.laboratorio_id ? await env.DB.prepare("SELECT id FROM laboratorios WHERE id=? AND activo=1").bind(+body.laboratorio_id).first() : null)
      || await env.DB.prepare("SELECT id FROM laboratorios WHERE activo=1 ORDER BY id LIMIT 1").first() || fail(409, "No hay laboratorios configurados.");
    const pn = await presNum(env, body, prueba, 0);
    const itsS = itemsNorm(body, await cfgGet(env), lab.id, false);
    if (itsS) { const r = resumenItems(itsS); body.tipo_trabajo = r.tipo_trabajo; body.diente = r.diente; body.color = r.color; }
    const dp = drut ? await env.DB.prepare("SELECT nombre,apellido,telefono,correo FROM usuarios WHERE rut=? AND rol='docente'").bind(drut).first() : null;
    if (dp) { body.docente_nombre = `${dp.nombre} ${dp.apellido}`.trim(); body.docente_telefono = dp.telefono || ""; body.docente_correo = dp.correo || ""; }
    const ins = await env.DB.prepare(`INSERT INTO trabajos(presupuesto,num_orden,fecha_recepcion,paciente_nombre,paciente_rut,codigo_smile,estudiante_rut,estudiante_nombre,tipo_trabajo,diente,laboratorio_id,estado,qr_token,creado_por,
      estudiante_telefono,estudiante_correo,docente_rut,docente_nombre,docente_telefono,docente_correo) VALUES(?,?,?,?,?,?,?,?,?,?,?,'SOLICITADA',?,?,?,?,?,?,?,?)`)
      .bind(pn.pres, pn.num, hoyCL(), txt(body.paciente_nombre, 120), prut, smile, u.rut, nombreDe(u), txt(body.tipo_trabajo, 400), txt(body.diente, 200), lab.id, rnd(), u.rut,
        u.telefono || "", u.correo || "", drut, txt(body.docente_nombre, 120), telNorm(body.docente_telefono) || "", txt(body.docente_correo, 120).toLowerCase()).run();
    const id = ins.meta.last_row_id;
    const col = colorNorm(body.color); if (col || itsS) await env.DB.prepare("UPDATE trabajos SET color=?, items=? WHERE id=?").bind(col || null, itsS && itsS.length > 1 ? JSON.stringify(itsS) : null, id).run();
    if (priv) await env.DB.prepare("UPDATE trabajos SET origen='privada', docente_aprobado_en=datetime('now'), docente_aprobado_por=? WHERE id=?").bind(FIRMA_PRIV, id).run();
    if (body.digital) await env.DB.prepare("UPDATE trabajos SET digital='1' WHERE id=?").bind(id).run();
    await evento(env, id, u, priv ? "SOLICITUD DEL PROFESIONAL (CLÍNICA PRIVADA)" : "SOLICITUD DEL ESTUDIANTE", `Paciente ${prut || "RUT no indicado"}${smile ? " · SMILE " + smile : ""}${body.tipo_trabajo ? " · " + txt(body.tipo_trabajo, 140) : ""}`).run();
    if (+body.ajuste_de) await vincularAjuste(env, u, id, +body.ajuste_de, prut, smile, prueba);
    return json({ id });
  }

  if (seg[0] === "trabajos" && seg[1]) {
    const t = await trabajo(env, u, seg[1]);
    const acc = seg[2] || "";

    if (m === "GET" && acc === "paciente") { // historial del paciente: solo CSU / DT (puede incluir trabajos de otros estudiantes)
      if (!esCSU && !admin) fail(403, "El historial del paciente lo ve el personal del CSU.");
      const mp = await mismoPaciente(env, t.paciente_rut, t.codigo_smile); if (!mp) return json([]);
      const pr = esPrueba(t.presupuesto);
      return json((await env.DB.prepare(`SELECT t.id,t.num_orden,t.presupuesto,t.intento,t.orden_padre,t.estado,t.tipo_trabajo,t.diente,t.fecha_recepcion,t.creado_en,t.estudiante_nombre,t.prueba_resultado,l.nombre AS laboratorio
        FROM trabajos t JOIN laboratorios l ON l.id=t.laboratorio_id WHERE ${mp.w} AND upper(trim(t.presupuesto)) ${pr ? "" : "NOT "}LIKE 'PRUEBA%' ORDER BY t.id LIMIT 300`).bind(...mp.b).all()).results);
    }
    if (m === "GET" && !acc) {
      const ev = (await env.DB.prepare("SELECT en,quien,tipo,detalle FROM eventos WHERE trabajo_id=? ORDER BY id").bind(t.id).all()).results;
      const fam = !txt(t.presupuesto) || t.estado === "SOLICITADA" ? [] : (await env.DB.prepare("SELECT id,num_orden,intento,estado,prueba_resultado,laboratorio_id,estudiante_rut,docente_rut FROM trabajos WHERE presupuesto=? ORDER BY intento, id").bind(t.presupuesto).all()).results.filter(x => puedeVer(u, x));
      const def = defDe(t);
      const hijo = await env.DB.prepare("SELECT id,num_orden FROM trabajos WHERE orden_padre=? AND estado<>'ANULADA'").bind(t.id).first();
      return json({ trabajo: sinPrecio(u, { ...t }), eventos: ev, familia: fam, hijo, traspaso: def ? { tipo: def.tipo, texto: def.texto, puedoEntregar: def.entrega(u, t), puedoRecibir: def.recibe(u, t), quienRecibe: quien(def, t) } : null });
    }

    if (m === "PUT" && !acc) {
      if (!esCSU) fail(403, "Sin permiso.");
      if (["TERMINADO", "REQUIERE_AJUSTE", "ANULADA", "PRUEBA_PENDIENTE", "SOLICITADA"].includes(t.estado)) fail(409, "El trabajo ya está cerrado, en confirmación o es una solicitud por completar.");
      const cambios = [], set = [], vals = [];
      const campo = (k, v) => { if (v != null && String(v) !== String(t[k] ?? "")) { cambios.push(`${k}: "${t[k] ?? ""}" → "${v}"`); set.push(`${k}=?`); vals.push(v); } };
      for (const k of ["estudiante_telefono", "docente_telefono"]) if (body[k] != null && body[k] !== "") { const tn = telNorm(body[k]); if (!tn) fail(400, "Teléfono inválido."); campo(k, tn); }
      for (const k of ["estudiante_correo", "docente_correo"]) if (body[k] != null) { const ml = txt(body[k], 120).toLowerCase(); if (ml && !correoOk(ml)) fail(400, "Correo inválido."); campo(k, ml); }
      for (const k of ["paciente_rut", "docente_rut"]) if (body[k] != null && esPrueba(t.presupuesto)) { campo(k, txt(body[k], 20)); delete body[k]; }
      for (const k of ["paciente_rut", "estudiante_rut", "docente_rut"]) if (body[k] != null) { const r = rutNorm(body[k]); if (!r || !r.ok) fail(400, `RUT inválido (${k.replace("_", " ")}).`); campo(k, r.rut); }
      ["presupuesto", "num_orden", "paciente_nombre", "codigo_smile", "diente", "fecha_recepcion", "estudiante_nombre", "docente_nombre"].forEach(k => body[k] != null && campo(k, txt(body[k])));
      const labN = body.laboratorio_id != null && t.estado === "RECEPCIONADA" ? +body.laboratorio_id : t.laboratorio_id, tipoN = body.tipo_trabajo != null ? txt(body.tipo_trabajo) : t.tipo_trabajo;
      const itsE = itemsNorm(body, await cfgGet(env), labN, true);
      if (itsE) { const r = resumenItems(itsE), js = itsE.length > 1 ? JSON.stringify(itsE) : null;
        if ((js || "") !== (t.items || "")) { cambios.push(`trabajos de la orden: "${t.tipo_trabajo}" → "${r.tipo_trabajo}"`); set.push("items=?"); vals.push(js); }
        for (const k of ["tipo_trabajo", "diente", "arancel", "plazo_dias", "color"]) { const i = set.indexOf(`${k}=?`);
          if (i >= 0) { vals[i] = r[k]; } else if (String(r[k] ?? "") !== String(t[k] ?? "")) { set.push(`${k}=?`); vals.push(r[k]); } }
        delete body.color; }
      else if (tipoN !== t.tipo_trabajo || labN !== t.laboratorio_id) { const ti = tipoInfo(await cfgGet(env), tipoN, labN); campo("tipo_trabajo", tipoN); if (ti) { campo("arancel", ti.a); campo("plazo_dias", ti.p); } }
      if (body.laboratorio_id != null && t.estado === "RECEPCIONADA") campo("laboratorio_id", +body.laboratorio_id);
      if (body.digital != null && t.estado === "RECEPCIONADA" && !t.dig_salida_en && !t.entrega_orden_en && !t.buzon_en) campo("digital", body.digital ? "1" : "");
      const col = colorNorm(body.color);
      if (col !== undefined && col !== (t.color || "")) { cambios.push(`color: "${colorTxt(t.color) || "—"}" → "${colorTxt(col) || "—"}"`); set.push("color=?"); vals.push(col); }
      if (!set.length) return json({ ok: true });
      await env.DB.batch([env.DB.prepare(`UPDATE trabajos SET ${set.join(",")}, actualizado_en=datetime('now') WHERE id=?`).bind(...vals, t.id), evento(env, t.id, u, "DATOS CORREGIDOS", cambios.join("; "))]);
      return json({ ok: true });
    }

    if (acc === "completar" && m === "POST") { // la administrativa completa la solicitud del estudiante
      if (!esCSU) fail(403, "La solicitud la completa el personal del CSU.");
      if (t.estado !== "SOLICITADA") fail(409, "Esta solicitud ya fue completada.");
      if (!t.docente_aprobado_en) fail(409, "Falta la aprobación del docente: el estudiante debe mostrarle su QR para que lo firme.");
      const d = await datosOrden(env, body, t);
      const r = await env.DB.batch([
        env.DB.prepare(`UPDATE trabajos SET presupuesto=?,num_orden=?,fecha_recepcion=?,paciente_nombre=?,paciente_rut=?,codigo_smile=?,estudiante_rut=?,estudiante_nombre=?,tipo_trabajo=?,arancel=?,plazo_dias=?,diente=?,laboratorio_id=?,
          estudiante_telefono=?,estudiante_correo=?,docente_rut=?,docente_nombre=?,docente_telefono=?,docente_correo=?,estado='RECEPCIONADA',actualizado_en=datetime('now') WHERE id=? AND estado='SOLICITADA'`)
          .bind(d.presupuesto, d.num_orden, d.fecha_recepcion, d.paciente_nombre, d.paciente_rut, d.codigo_smile, d.estudiante_rut, d.estudiante_nombre, d.tipo_trabajo, d.arancel, d.plazo_dias, d.diente, d.laboratorio_id,
            d.estudiante_telefono, d.estudiante_correo, d.docente_rut, d.docente_nombre, d.docente_telefono, d.docente_correo, t.id),
        evento(env, t.id, u, "ORDEN RECEPCIONADA (DESDE SOLICITUD)", `Presupuesto ${d.presupuesto} · Orden ${d.num_orden}`),
        ...(t.buzon_en && !t.entrega_orden_en ? [env.DB.prepare("UPDATE trabajos SET entrega_orden_en=datetime('now'), entrega_orden_entrega=?, entrega_orden_recibe=? WHERE id=?").bind(`${t.estudiante_nombre} (${t.origen === "privada" ? "Profesional clínica privada" : "Estudiante"}, dejada en el buzón)`, quienEs(u, t), t.id),
          evento(env, t.id, u, "ORDEN RECIBIDA DESDE EL BUZÓN", `Dejada por ${t.buzon_por} el ${t.buzon_en}; recepción confirmada por ${nombreDe(u)}`)] : []),
        ...(d.color !== undefined ? [env.DB.prepare("UPDATE trabajos SET color=? WHERE id=?").bind(d.color, t.id)] : []),
        ...(body.digital != null ? [env.DB.prepare("UPDATE trabajos SET digital=? WHERE id=?").bind(body.digital ? "1" : "", t.id)] : []),
        ...(d.items !== undefined ? [env.DB.prepare("UPDATE trabajos SET items=? WHERE id=?").bind(d.items, t.id)] : []),
      ]);
      if (!r[0].meta.changes) fail(409, "La solicitud cambió mientras tanto. Recarga.");
      return json({ ok: true });
    }

    if (acc === "rechazar" && m === "POST") {
      if (!esCSU) fail(403, "Sin permiso.");
      if (t.estado !== "SOLICITADA") fail(409, "Solo se rechazan solicitudes pendientes.");
      const motivo = txt(body.motivo, 200); if (motivo.length < 5) fail(400, "Indica el motivo para el estudiante.");
      await env.DB.batch([env.DB.prepare("UPDATE trabajos SET estado='ANULADA', actualizado_en=datetime('now') WHERE id=?").bind(t.id), evento(env, t.id, u, "SOLICITUD RECHAZADA", motivo)]);
      return json({ ok: true });
    }

    if (acc === "firma" && m === "POST") { // QR para que el docente firme (apruebe) el trabajo
      if (t.origen === "privada") fail(409, "Clínica privada: este trabajo no requiere firma de docente.");
      if (!(esCSU || esSol(u, t))) fail(403, "El QR de firma lo muestra el estudiante o el personal del CSU.");
      if (t.docente_aprobado_en) fail(409, "Este trabajo ya está aprobado por el docente.");
      if (!["SOLICITADA", "RECEPCIONADA"].includes(t.estado)) fail(409, "La firma del docente se pide antes de enviar el trabajo al laboratorio.");
      await env.DB.prepare("UPDATE traspasos SET usado=2 WHERE trabajo_id=? AND usado=0").bind(t.id).run();
      const token = rnd(20), expira = Date.now() + TTL_QR;
      await env.DB.prepare("INSERT INTO traspasos(token,trabajo_id,tipo,entrega_rut,expira) VALUES(?,?,'firma_docente',?,?)").bind(token, t.id, u.rut, expira).run();
      return json({ token, expira, texto: "Aprobación del docente (firma)", quienRecibe: t.docente_nombre ? `el docente ${t.docente_nombre}` : "el docente a cargo" });
    }

    /* Aprobación por fuerza mayor: la administrativa la solicita (docente + motivo) y solo vale cuando el DT la autoriza.
       Reemplaza únicamente la firma del docente; el resto del flujo (QR de entrega, laboratorio, etc.) sigue igual. */
    if (acc === "firma-excepcion" && m === "POST") {
      if (!(admin || u.rol === "administrativo" || u.rol === "directivo")) fail(403, "La aprobación por fuerza mayor la solicita la administrativa del CSU.");
      if (t.docente_aprobado_en) fail(409, "Este trabajo ya está aprobado por el docente.");
      if (!["SOLICITADA", "RECEPCIONADA"].includes(t.estado)) fail(409, "La aprobación se registra antes de enviar el trabajo al laboratorio.");
      if (t.exc_sol_en) fail(409, "Ya hay una solicitud de aprobación por fuerza mayor pendiente del Director Técnico.");
      const motivo = txt(body.motivo, 300), docente = txt(body.docente, 120) || t.docente_nombre;
      if (motivo.length < 10) fail(400, "Describe el motivo de fuerza mayor (al menos 10 caracteres).");
      if (!docente) fail(400, "Indica el docente a cargo del trabajo.");
      if (admin) { // el propio DT: queda autorizada de inmediato
        await env.DB.batch([env.DB.prepare("UPDATE trabajos SET docente_aprobado_en=datetime('now'), docente_aprobado_por=?, docente_aprobado_rut='', actualizado_en=datetime('now') WHERE id=?").bind(`${docente} (fuerza mayor, autorizada por el DT ${nombreDe(u)})`, t.id),
          evento(env, t.id, u, "APROBACIÓN POR FUERZA MAYOR AUTORIZADA (DT)", `Docente a cargo: ${docente}. Motivo: ${motivo}`)]);
        return json({ ok: true, autorizada: true }); }
      await env.DB.batch([env.DB.prepare("UPDATE trabajos SET exc_sol_en=datetime('now'), exc_sol_por=?, exc_motivo=?, exc_docente=?, actualizado_en=datetime('now') WHERE id=?").bind(nombreDe(u), motivo, docente, t.id),
        evento(env, t.id, u, "SOLICITUD DE APROBACIÓN POR FUERZA MAYOR", `Docente a cargo: ${docente}. Motivo: ${motivo}. Pendiente de autorización del Director Técnico.`)]);
      return json({ ok: true, autorizada: false });
    }
    if ((acc === "firma-excepcion-autorizar" || acc === "firma-excepcion-rechazar") && m === "POST") {
      if (!admin) fail(403, "Solo el Director Técnico autoriza la aprobación por fuerza mayor.");
      if (!t.exc_sol_en) fail(409, "No hay una solicitud de aprobación por fuerza mayor pendiente.");
      const limpiar = "exc_sol_en=NULL, exc_sol_por=NULL, exc_motivo=NULL, exc_docente=NULL, actualizado_en=datetime('now')";
      if (acc === "firma-excepcion-rechazar") { const mot = txt(body.motivo, 200);
        if (mot.length < 5) fail(400, "Indica por qué no se autoriza.");
        await env.DB.batch([env.DB.prepare(`UPDATE trabajos SET ${limpiar} WHERE id=?`).bind(t.id),
          evento(env, t.id, u, "APROBACIÓN POR FUERZA MAYOR NO AUTORIZADA (DT)", `Solicitada por ${t.exc_sol_por}. Motivo del DT: ${mot}. Sigue pendiente la firma del docente por QR.`)]);
        return json({ ok: true }); }
      if (t.docente_aprobado_en) { await env.DB.prepare(`UPDATE trabajos SET ${limpiar} WHERE id=?`).bind(t.id).run(); fail(409, "El docente ya había firmado con QR; la solicitud quedó sin efecto."); }
      await env.DB.batch([env.DB.prepare(`UPDATE trabajos SET docente_aprobado_en=datetime('now'), docente_aprobado_por=?, docente_aprobado_rut='', ${limpiar} WHERE id=?`)
          .bind(`${t.exc_docente} (fuerza mayor: solicitada por ${t.exc_sol_por}, autorizada por el DT ${nombreDe(u)})`, t.id),
        evento(env, t.id, u, "APROBACIÓN POR FUERZA MAYOR AUTORIZADA (DT)", `Solicitada por ${t.exc_sol_por} el ${t.exc_sol_en}. Docente a cargo: ${t.exc_docente}. Motivo: ${t.exc_motivo}`)]);
      return json({ ok: true });
    }

    if (acc === "firma-manual" && m === "POST") { // respaldo del administrador si no se pudo usar el QR
      if (!admin) fail(403, "Solo el administrador.");
      if (t.docente_aprobado_en) fail(409, "Ya está aprobado.");
      const motivo = txt(body.motivo, 200), quien_ = txt(body.docente, 120) || t.docente_nombre;
      if (motivo.length < 5 || !quien_) fail(400, "Indica el docente que aprobó y el motivo por el que no se usó el QR.");
      await env.DB.batch([env.DB.prepare("UPDATE trabajos SET docente_aprobado_en=datetime('now'), docente_aprobado_por=?, docente_aprobado_rut='', exc_sol_en=NULL, exc_sol_por=NULL, exc_motivo=NULL, exc_docente=NULL, actualizado_en=datetime('now') WHERE id=?").bind(quien_ + " (registrado por administrador)", t.id),
        evento(env, t.id, u, "APROBACIÓN DOCENTE SIN QR", `Docente: ${quien_}. Motivo: ${motivo}`)]);
      return json({ ok: true });
    }

    if (acc === "buzon" && m === "POST") { // el estudiante deja la orden en el buzón de recepción (sin personal presente)
      if (!esSol(u, t)) fail(403, "Solo quien hizo la solicitud puede dejar su orden en el buzón.");
      if (t.digital) fail(409, "Esta orden es de impresión digital: no se deja en el buzón; confirma en la app el envío de los archivos al laboratorio.");
      if (!t.docente_aprobado_en) fail(409, "Primero tu docente debe aprobar el trabajo con su firma QR.");
      if (t.estado === "SOLICITADA") { if (!txt(t.num_orden) || !txt(t.presupuesto) || (esPrueba(t.presupuesto) && !t.num_orden)) fail(409, "Antes de dejarla en el buzón, completa en tu solicitud el N° de orden y el N° de presupuesto (están en la orden en papel)."); }
      else if (!(t.estado === "RECEPCIONADA" && !t.entrega_orden_en)) fail(409, "Esta orden ya fue entregada en recepción.");
      if (t.buzon_en) fail(409, "Ya registraste esta orden en el buzón; espera la confirmación de recepción.");
      await env.DB.batch([env.DB.prepare("UPDATE trabajos SET buzon_en=datetime('now'), buzon_por=?, actualizado_en=datetime('now') WHERE id=?").bind(nombreDe(u), t.id),
        evento(env, t.id, u, "ORDEN DEJADA EN EL BUZÓN DE RECEPCIÓN", "Pendiente de confirmación de recepción por el personal del CSU")]);
      return json({ ok: true });
    }
    if ((acc === "buzon-confirmar" || acc === "buzon-rechazar") && m === "POST") {
      if (!esCSU) fail(403, "La recepción la confirma el personal del CSU.");
      if (!t.buzon_en || t.entrega_orden_en) fail(409, "Esta orden no está pendiente en el buzón.");
      if (acc === "buzon-rechazar") { const motivo = txt(body.motivo, 200) || "La orden no estaba en la bandeja";
        await env.DB.batch([env.DB.prepare("UPDATE trabajos SET buzon_en=NULL, buzon_por=NULL, actualizado_en=datetime('now') WHERE id=?").bind(t.id),
          evento(env, t.id, u, "ORDEN NO ENCONTRADA EN EL BUZÓN", motivo)]);
        return json({ ok: true }); }
      if (t.estado !== "RECEPCIONADA") fail(409, "Para una solicitud, la recepción se confirma al completar el registro.");
      await env.DB.batch([env.DB.prepare("UPDATE trabajos SET entrega_orden_en=datetime('now'), entrega_orden_entrega=?, entrega_orden_recibe=?, actualizado_en=datetime('now') WHERE id=? AND entrega_orden_en IS NULL")
          .bind(`${t.estudiante_nombre} (${t.origen === "privada" ? "Profesional clínica privada" : "Estudiante"}, dejada en el buzón)`, quienEs(u, t), t.id),
        evento(env, t.id, u, "ORDEN RECIBIDA DESDE EL BUZÓN", `Dejada por ${t.buzon_por} el ${t.buzon_en}; recepción confirmada por ${nombreDe(u)}`)]);
      return json({ ok: true });
    }

    if ((acc === "solicitud" && m === "PUT") || (acc === "retirar" && m === "POST")) { // el estudiante (o el CSU) corrige; el estudiante retira su solicitud pendiente
      const dueno = esSol(u, t);
      if (!(dueno || (acc === "solicitud" && esCSU))) fail(403, acc === "retirar" ? "Solo el estudiante que hizo la solicitud puede eliminarla (el CSU puede rechazarla)." : "Solo el estudiante que hizo la solicitud o el personal del CSU pueden corregirla.");
      if (t.estado !== "SOLICITADA") fail(409, "La solicitud ya fue completada por el CSU: para corregirla, pide el cambio en recepción.");
      const prueba = esPrueba(t.presupuesto);
      if (acc === "retirar") {
        if (!t.docente_aprobado_en) {   // sin firma del docente: no hay nada que resguardar, se borra
          await env.DB.batch([
            env.DB.prepare("DELETE FROM eventos WHERE trabajo_id=?").bind(t.id), env.DB.prepare("DELETE FROM traspasos WHERE trabajo_id=?").bind(t.id),
            env.DB.prepare("DELETE FROM fotos WHERE trabajo_id=?").bind(t.id), env.DB.prepare("DELETE FROM trabajos WHERE id=? AND estado='SOLICITADA'").bind(t.id)]);
          return json({ ok: true, borrada: true });
        }
        const motivo = txt(body.motivo, 200);   // ya firmada por el docente: queda registrada como anulada
        await env.DB.batch([
          env.DB.prepare("UPDATE trabajos SET estado='ANULADA', actualizado_en=datetime('now') WHERE id=? AND estado='SOLICITADA'").bind(t.id),
          env.DB.prepare("UPDATE traspasos SET usado=2 WHERE trabajo_id=? AND usado=0").bind(t.id),
          evento(env, t.id, u, "SOLICITUD RETIRADA POR EL ESTUDIANTE", motivo || "Sin motivo indicado")]);
        return json({ ok: true, borrada: false });
      }
      const smile = txt(body.codigo_smile, 30); let prut = txt(body.paciente_rut, 20);
      if (!smile && !prut) fail(400, "Ingresa el código SMILE o el RUT del paciente.");
      if (prut && !prueba) { const r = rutNorm(prut); if (!r || !r.ok) fail(400, "RUT del paciente inválido (revisa el dígito verificador)."); prut = r.rut; }
      const lab = (await env.DB.prepare("SELECT id FROM laboratorios WHERE id=? AND activo=1").bind(+body.laboratorio_id || t.laboratorio_id).first()) || fail(400, "Elige el laboratorio.");
      let drut = txt(body.docente_rut, 20);
      if (drut && !prueba) { const r = rutNorm(drut); if (!r || !r.ok) fail(400, "RUT del docente inválido."); drut = r.rut; }
      const dp = drut ? await env.DB.prepare("SELECT nombre,apellido,telefono,correo FROM usuarios WHERE rut=? AND rol='docente'").bind(drut).first() : null;
      const itsC = itemsNorm(body, await cfgGet(env), lab.id, false), rC = itsC ? resumenItems(itsC) : null;
      const n = { paciente_rut: prut, codigo_smile: smile, paciente_nombre: txt(body.paciente_nombre, 120), tipo_trabajo: rC ? rC.tipo_trabajo : txt(body.tipo_trabajo, 140), diente: rC ? rC.diente : txt(body.diente, 60),
        laboratorio_id: lab.id, docente_rut: drut, docente_nombre: dp ? `${dp.nombre} ${dp.apellido}`.trim() : drut ? txt(body.docente_nombre, 120) || t.docente_nombre || "" : "",
        docente_telefono: dp ? dp.telefono || "" : drut === t.docente_rut ? t.docente_telefono || "" : "", docente_correo: dp ? dp.correo || "" : drut === t.docente_rut ? t.docente_correo || "" : "" };
      const col = colorNorm(body.color); if (col !== undefined) n.color = col;
      if (body.digital != null) n.digital = body.digital ? "1" : "";
      if (rC) { n.color = rC.color; n.items = itsC.length > 1 ? JSON.stringify(itsC) : null; }
      if (body.presupuesto != null || body.num_orden != null) { const pn = await presNum(env, body, prueba, t.id); n.presupuesto = pn.pres; n.num_orden = pn.num; }
      const nom = { paciente_rut: "RUT paciente", codigo_smile: "SMILE", paciente_nombre: "paciente", tipo_trabajo: "tipo de trabajo", diente: "dientes", laboratorio_id: "laboratorio", docente_rut: "docente", color: "color", digital: "tipo de impresión (física/digital)", items: "trabajos de la orden", presupuesto: "N° presupuesto", num_orden: "N° orden" };
      const cambios = Object.keys(nom).filter(k => k in n && String(n[k] ?? "") !== String(t[k] ?? ""));
      if (!cambios.length) return json({ ok: true, sinCambios: true });
      const set = Object.keys(n).map(k => `${k}=?`).join(","), vals = Object.keys(n).map(k => n[k]);
      // la firma del docente se mantiene; el historial deja constancia si la corrección fue posterior a ella
      await env.DB.batch([
        env.DB.prepare(`UPDATE trabajos SET ${set},actualizado_en=datetime('now') WHERE id=? AND estado='SOLICITADA'`).bind(...vals, t.id),
        evento(env, t.id, u, dueno ? "SOLICITUD CORREGIDA POR EL ESTUDIANTE" : "SOLICITUD CORREGIDA POR EL CSU", "Cambió: " + cambios.map(k => nom[k]).join(", ") + (t.docente_aprobado_en ? ` (después de la aprobación de ${t.docente_aprobado_por})` : "")),
      ]);
      return json({ ok: true });
    }

    if (m === "DELETE" && !acc) { // borrar definitivamente (datos ingresados por error)
      if (!admin) fail(403, "Solo el administrador elimina trabajos.");
      await env.DB.batch([
        env.DB.prepare("UPDATE trabajos SET orden_padre=NULL WHERE orden_padre=?").bind(t.id),
        env.DB.prepare("DELETE FROM eventos WHERE trabajo_id=?").bind(t.id),
        env.DB.prepare("DELETE FROM traspasos WHERE trabajo_id=?").bind(t.id),
        env.DB.prepare("DELETE FROM fotos WHERE trabajo_id=?").bind(t.id),
        env.DB.prepare("DELETE FROM trabajos WHERE id=?").bind(t.id),
      ]);
      return json({ ok: true });
    }

    if (acc === "etapa" && m === "POST") {
      if (!(u.rol === "laboratorio" && u.laboratorio_id === t.laboratorio_id)) fail(403, "Solo el laboratorio a cargo marca sus etapas.");
      if (t.estado !== "EN_LABORATORIO") fail(409, "El trabajo no está en el laboratorio.");
      const etapa = txt(body.etapa, 60); if (!((await cfgGet(env)).etapas_lab || []).includes(etapa)) fail(400, "Etapa no válida.");
      await env.DB.batch([env.DB.prepare("UPDATE trabajos SET etapa_lab=?, etapa_en=datetime('now'), actualizado_en=datetime('now') WHERE id=?").bind(etapa, t.id), evento(env, t.id, u, "ETAPA LABORATORIO", etapa)]);
      return json({ ok: true });
    }

    if (acc === "digital" && m === "POST") { // impresión digital: el estudiante confirma la salida de los archivos; el laboratorio confirma la recepción
      if (t.estado !== "RECEPCIONADA") fail(409, "La orden no está esperando el envío de archivos.");
      const convertir = !t.digital && body.paso === "salida" && body.convertir === true;   // regularización: orden antigua que en realidad fue digital
      if (convertir && (t.entrega_orden_en || t.buzon_en)) fail(409, "Esta orden ya tiene registrada la entrega en papel.");
      if (!t.digital && !convertir) fail(409, "Esta orden no es de impresión digital.");
      const lab_ = u.rol === "laboratorio" && u.laboratorio_id === t.laboratorio_id, paso = txt(body.paso, 20);
      if (paso === "salida") {
        const sol = esSol(u, t); if (!sol && !esCSU) fail(403, "La salida la confirma el estudiante (o el CSU por fuerza mayor).");
        if (!t.docente_aprobado_en) fail(409, "Primero el docente debe firmar la orden.");
        if (t.dig_salida_en) fail(409, "La salida ya está confirmada; falta que el laboratorio confirme la recepción.");
        const medio = ["CORREO", "PLATAFORMA", "OTRO"].includes(body.medio) ? body.medio : fail(400, "Indica cómo enviaste los archivos.");
        const que = (Array.isArray(body.que) ? body.que : []).map(x => txt(x, 40)).filter(Boolean).slice(0, 8); if (!que.length) fail(400, "Marca qué archivos enviaste.");
        const fe = txt(body.fecha, 16); if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(fe)) fail(400, "Indica la fecha y hora del envío.");
        const motivo = sol ? "" : txt(body.motivo, 200); if (!sol && motivo.length < 5) fail(400, "Indica por qué lo registra el CSU (fuerza mayor).");
        const dat = { medio, medio_otro: txt(body.medio_otro, 80), que, fecha: fe, ref: txt(body.ref, 160), motivo };
        const por = sol ? `${t.estudiante_nombre} (${solL0(t)})` : `${nombreDe(u)} (CSU, fuerza mayor)`;
        const r = await env.DB.batch([env.DB.prepare("UPDATE trabajos SET digital='1', dig_salida_en=datetime('now'), dig_salida_por=?, dig_salida_datos=?, actualizado_en=datetime('now') WHERE id=? AND dig_salida_en IS NULL AND estado='RECEPCIONADA'").bind(por, JSON.stringify(dat), t.id),
          ...(convertir ? [evento(env, t.id, u, "REGULARIZACIÓN: ORDEN DIGITAL", "La orden figuraba como física; se declara de impresión digital (sin entrega en papel)")] : []),
          evento(env, t.id, u, "SALIDA DIGITAL", `Archivos enviados al laboratorio por ${{ CORREO: "correo", PLATAFORMA: "plataforma del laboratorio", OTRO: dat.medio_otro || "otro medio" }[medio]} el ${fe.replace("T", " ")}: ${que.join(", ")}${dat.ref ? ` · ref. "${dat.ref}"` : ""}${motivo ? ` · registrado por el CSU: ${motivo}` : ""}`)]);
        if (!r[0].meta.changes) fail(409, "La orden cambió mientras tanto. Recarga.");
        return json({ ok: true }); }
      if (paso === "recepcion" || paso === "faltan") {
        const dtFM = !lab_ && admin && paso === "recepcion";   // el DT registra la recepción por el laboratorio (confirmada fuera de la app)
        if (!lab_ && !dtFM) fail(403, "La recepción de los archivos la confirma el laboratorio de la orden.");
        const motFM = dtFM ? txt(body.motivo, 200) : ""; if (dtFM && motFM.length < 5) fail(400, "Indica cómo confirmó el laboratorio (por ejemplo: confirmado por WhatsApp).");
        if (!t.dig_salida_en) fail(409, "El estudiante aún no confirma el envío de los archivos.");
        if (paso === "faltan") { const mo = txt(body.motivo, 300); if (mo.length < 5) fail(400, "Indica qué falta o qué no se puede abrir.");
          await env.DB.batch([env.DB.prepare("UPDATE trabajos SET dig_salida_en=NULL, dig_rechazo=?, actualizado_en=datetime('now') WHERE id=?").bind(JSON.stringify({ motivo: mo, por: quienEs(u, t), en: new Date().toISOString() }), t.id),
            evento(env, t.id, u, "ARCHIVOS DIGITALES INCOMPLETOS", `${mo} · el estudiante debe reenviar y confirmar de nuevo la salida`)]);
          return json({ ok: true }); }
        const yo = dtFM ? `${nombreDe(u)} (DT, por ${t.laboratorio}: ${motFM})` : quienEs(u, t), hoy_ = hoyCL(); let fr = txt(body.fecha, 10) || hoy_;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fr) || fr > hoy_) fail(400, "La fecha de recepción no puede ser futura.");
        const sal = (() => { try { return String(JSON.parse(t.dig_salida_datos || "{}").fecha || "").slice(0, 10); } catch { return ""; } })();
        if (sal && fr < sal) fail(400, `La fecha de recepción no puede ser anterior al envío (${sal.split("-").reverse().join("-")}).`);
        const ret = fr === hoy_ ? null : `${fr} 15:00:00`;   // fecha real (orden antigua): el plazo se calcula desde ahí
        const r = await env.DB.batch([env.DB.prepare(`UPDATE trabajos SET estado='EN_LABORATORIO', dig_recep_en=datetime('now'), dig_recep_por=?, retiro_lab_en=COALESCE(?, datetime('now')), retiro_lab_entrega=?, retiro_lab_recibe=?, etapa_lab='', etapa_en=datetime('now'), dig_rechazo=NULL, actualizado_en=datetime('now') WHERE id=? AND estado='RECEPCIONADA' AND dig_salida_en IS NOT NULL`)
            .bind(yo, ret, `Envío digital: ${t.dig_salida_por}`, yo, t.id),
          evento(env, t.id, u, "RECEPCIÓN DIGITAL", `El laboratorio confirma que recibió los archivos completos (${yo})${ret ? `; fecha real de recepción ${fr.split("-").reverse().join("-")}` : ""}; el plazo corre desde esa fecha`)]);
        if (!r[0].meta.changes) fail(409, "La orden cambió mientras tanto. Recarga.");
        return json({ ok: true }); }
      fail(400, "Paso inválido.");
    }
    if (acc === "traspaso" && m === "POST") {
      const def = defDe(t); if (!def) fail(409, "Este trabajo no tiene traspasos pendientes.");
      if (!def.entrega(u, t)) fail(403, "No te corresponde mostrar el QR en esta etapa.");
      await env.DB.prepare("UPDATE traspasos SET usado=2 WHERE trabajo_id=? AND usado=0").bind(t.id).run();
      const token = rnd(20), expira = Date.now() + TTL_QR;
      await env.DB.prepare("INSERT INTO traspasos(token,trabajo_id,tipo,entrega_rut,expira) VALUES(?,?,?,?,?)").bind(token, t.id, def.tipo, u.rut, expira).run();
      return json({ token, expira, texto: def.texto, quienRecibe: quien(def, t) });
    }

    if (acc === "manual" && m === "POST") {
      if (!esCSU) fail(403, "Solo personal del CSU registra traspasos manuales.");
      const def = defDe(t); if (!def) fail(409, "Este trabajo no tiene traspasos pendientes.");
      const motivo = txt(body.motivo, 200), recibe = txt(body.recibe, 120);
      if (motivo.length < 5 || !recibe) fail(400, def.invertir ? "Indica quién entregó la orden y por qué no se usó el QR." : "Indica quién recibió y por qué no se usó el QR.");
      await aplicarTraspaso(env, t, def, u.rut, null, { motivo, recibe });
      return json({ ok: true });
    }

    if (acc === "prueba-est" && m === "POST") { // 1° el estudiante registra cómo quedó el trabajo
      if (!esSol(u, t)) fail(403, "La prueba la registra el estudiante (o el profesional) a cargo del trabajo.");
      if (t.estado !== "RETIRADA_ESTUDIANTE") fail(409, "Registra la prueba después de retirar el trabajo.");
      if (typeof body.ok !== "boolean") fail(400, "Indica si el trabajo quedó OK o requiere ajuste.");
      const obs = txt(body.obs, 400); if (!body.ok && obs.length < 5) fail(400, "Describe el ajuste requerido.");
      const ajE = ajusteDe(t, body);
      if (t.origen === "privada") { // clínica privada: el profesional tratante registra la prueba y cierra el caso (no hay docente)
        const res = body.ok ? "OK" : "AJUSTE";
        await env.DB.batch([env.DB.prepare(`UPDATE trabajos SET estado=?, prueba_est_en=datetime('now'), prueba_est_resultado=?, prueba_est_obs=?, prueba_en=datetime('now'), prueba_resultado=?, prueba_por=?, prueba_obs=?, ajuste_items=?, actualizado_en=datetime('now') WHERE id=? AND estado='RETIRADA_ESTUDIANTE'`)
          .bind(body.ok ? "TERMINADO" : "REQUIERE_AJUSTE", res, obs, res, nombreDe(u), obs, body.ok ? null : ajE, t.id),
          evento(env, t.id, u, body.ok ? "PRUEBA DEL PROFESIONAL: OK — TRABAJO TERMINADO" : "PRUEBA DEL PROFESIONAL: REQUIERE AJUSTE", `${obs || ""}${body.ok ? "" : " · Se debe registrar una nueva orden con el mismo presupuesto"}`)]);
        return json({ ok: true, cerrado: true });
      }
      await env.DB.batch([env.DB.prepare("UPDATE trabajos SET estado='PRUEBA_PENDIENTE', prueba_est_en=datetime('now'), prueba_est_resultado=?, prueba_est_obs=?, ajuste_items=?, actualizado_en=datetime('now') WHERE id=? AND estado='RETIRADA_ESTUDIANTE'")
        .bind(body.ok ? "OK" : "AJUSTE", obs, ajE, t.id), evento(env, t.id, u, body.ok ? "PRUEBA (ESTUDIANTE): OK" : "PRUEBA (ESTUDIANTE): REQUIERE AJUSTE", (obs || "") + " · Falta confirmación del docente")]);
      return json({ ok: true });
    }

    if (acc === "prueba" && m === "POST") { // 2° el docente confirma (o corrige) y se cierra
      if (!((u.rol === "docente" && u.rut === t.docente_rut) || admin)) fail(403, "La confirmación la hace el docente a cargo del estudiante.");
      if (t.origen === "privada" && !admin) fail(409, "Clínica privada: la prueba la registra y cierra el profesional.");
      if (!(t.estado === "PRUEBA_PENDIENTE" || (admin && t.estado === "RETIRADA_ESTUDIANTE"))) fail(409, "Primero el estudiante debe registrar el trabajo en boca; después lo confirma el docente.");
      if (typeof body.ok !== "boolean") fail(400, "Indica si el trabajo quedó OK o requiere ajuste.");
      const obs = txt(body.obs, 400); if (!body.ok && obs.length < 5 && !(t.prueba_est_resultado === "AJUSTE" && t.prueba_est_obs)) fail(400, "Describe el ajuste requerido.");
      const res = body.ok ? "OK" : "AJUSTE";
      const nota = t.estado === "RETIRADA_ESTUDIANTE" ? "Registrada por el administrador sin registro previo del estudiante" : res === t.prueba_est_resultado ? "Confirma lo registrado por el estudiante" : `Corrige lo registrado por el estudiante (${t.prueba_est_resultado === "OK" ? "OK" : "requiere ajuste"})`;
      const obsFinal = obs || t.prueba_est_obs || "";
      const ajD = body.ok ? null : ajusteDe(t, Array.isArray(body.ajuste_items) ? body : { ok: false, ajuste_items: JSON.parse(t.ajuste_items || "null") });
      await env.DB.batch([env.DB.prepare(`UPDATE trabajos SET estado=?, prueba_en=datetime('now'), prueba_resultado=?, prueba_por=?, prueba_obs=?, ajuste_items=?, actualizado_en=datetime('now') WHERE id=? AND estado=?`)
        .bind(body.ok ? "TERMINADO" : "REQUIERE_AJUSTE", res, nombreDe(u), obsFinal, ajD, t.id, t.estado),
        evento(env, t.id, u, body.ok ? "PRUEBA CONFIRMADA POR DOCENTE: OK — TRABAJO TERMINADO" : "PRUEBA CONFIRMADA POR DOCENTE: REQUIERE AJUSTE", `${nota}${obsFinal ? " · " + obsFinal : ""}${body.ok ? "" : " · Se debe registrar una nueva orden con el mismo presupuesto"}`)]);
      return json({ ok: true });
    }

    if (acc === "ajuste" && m === "POST") { // nueva orden del mismo presupuesto, cuando el estudiante trae la nueva orden
      if (!esCSU && !admin) fail(403, "La nueva orden la registra el personal del CSU.");
      const garT = !!body.garantia && t.estado === "TERMINADO";   // garantía de un trabajo ya terminado (sin plazo), p. ej. fractura posterior
      if (t.estado !== "REQUIERE_AJUSTE" && !garT) fail(409, "Este trabajo no requiere ajuste.");
      const motG = garT ? txt(body.motivo, 300) : ""; if (garT && motG.length < 5) fail(400, "Describe qué ocurrió con el trabajo.");
      const ya = await env.DB.prepare("SELECT id,num_orden FROM trabajos WHERE orden_padre=? AND estado<>'ANULADA'").bind(t.id).first();
      if (ya) fail(409, `Ya se registró la nueva orden N° ${ya.num_orden} para este ajuste.`);
      const nuevo = txt(body.num_orden, 40); if (!nuevo) fail(400, "Indica el N° de la nueva orden de laboratorio.");
      const dup = await env.DB.prepare("SELECT id FROM trabajos WHERE num_orden=? AND estado<>'ANULADA'").bind(nuevo).first(); if (dup) fail(409, `La orden N° ${nuevo} ya existe (registro #${dup.id}).`);
      const fecha = txt(body.fecha_recepcion); if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) fail(400, "Fecha de recepción inválida.");
      const lab = await env.DB.prepare("SELECT id FROM laboratorios WHERE id=? AND activo=1").bind(+body.laboratorio_id || t.laboratorio_id).first(); if (!lab) fail(400, "Elige el laboratorio.");
      let ar = t.arancel, pl = t.plazo_dias, tipoA = t.tipo_trabajo, dienteA = t.diente, colorA = t.color, itemsA = t.items || null;
      const todos = itemsDe(t), idx = JSON.parse(t.ajuste_items || "null");
      if (t.items || lab.id !== t.laboratorio_id) {
        const cfgA = await cfgGet(env), sub = (Array.isArray(idx) && idx.length ? idx.map(i => todos[i]).filter(Boolean) : todos).map(x => { const ti = tipoInfo(cfgA, x.tipo, lab.id); return { ...x, a: ti?.a ?? null, p: ti?.p ?? null }; });
        const r = resumenItems(sub); ar = r.arancel; pl = r.plazo_dias; tipoA = r.tipo_trabajo; dienteA = r.diente; colorA = r.color || t.color; itemsA = sub.length > 1 ? JSON.stringify(sub) : null; }
      const ins = await env.DB.prepare(`INSERT INTO trabajos(presupuesto,num_orden,intento,orden_padre,fecha_recepcion,paciente_nombre,paciente_rut,codigo_smile,estudiante_rut,estudiante_nombre,tipo_trabajo,arancel,plazo_dias,diente,laboratorio_id,qr_token,creado_por,
        estudiante_telefono,estudiante_correo,docente_rut,docente_nombre,docente_telefono,docente_correo)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(t.presupuesto, nuevo, t.intento + 1, t.id, fecha, t.paciente_nombre, t.paciente_rut, t.codigo_smile,
        t.estudiante_rut, t.estudiante_nombre, tipoA, ar, pl, dienteA, lab.id, rnd(), u.rut,
        t.estudiante_telefono, t.estudiante_correo, t.docente_rut, t.docente_nombre, t.docente_telefono, t.docente_correo).run();
      const hijo = ins.meta.last_row_id;
      if (colorA || itemsA) await env.DB.prepare("UPDATE trabajos SET color=?, items=? WHERE id=?").bind(colorA || null, itemsA, hijo).run();
      if (t.origen === "privada") await env.DB.prepare("UPDATE trabajos SET origen='privada', docente_aprobado_en=datetime('now'), docente_aprobado_por=? WHERE id=?").bind(FIRMA_PRIV, hijo).run();
      await env.DB.batch([
        env.DB.prepare("UPDATE trabajos SET garantia='POSIBLE', garantia_origen=?, garantia_motivo=?, garantia_en=datetime('now'), garantia_por=? WHERE id=?").bind(garT ? "terminado" : "ajuste", garT ? motG : (t.prueba_obs || ""), quienEs(u, t), hijo),
        evento(env, t.id, u, garT ? "SOLICITUD DE GARANTÍA" : "NUEVA ORDEN DE AJUSTE", `${garT ? motG + " · " : ""}Continúa en la orden N° ${nuevo} (registro #${hijo})`),
        evento(env, hijo, u, garT ? "ORDEN RECEPCIONADA (GARANTÍA)" : "ORDEN RECEPCIONADA (AJUSTE)", `Mismo presupuesto ${t.presupuesto}; viene de la orden N° ${t.num_orden} (intento ${t.intento}). ${garT ? "Garantía solicitada: " + motG : "Ajuste: " + (t.prueba_obs || "")} · Posible garantía: la responde el laboratorio`),
      ]);
      return json({ ok: true, nuevo: hijo });
    }

    if (acc === "correo" && m === "POST") { // arma el correo con sus copias según quién escribe
      const cfg = await cfgGet(env);
      const dt = txt(cfg.correo_dt) || (await env.DB.prepare("SELECT correo FROM usuarios WHERE es_admin=1 AND COALESCE(correo,'')<>'' LIMIT 1").first())?.correo || "";
      const est = t.estudiante_correo || (await env.DB.prepare("SELECT correo FROM usuarios WHERE rut=?").bind(t.estudiante_rut).first())?.correo || "";
      const doc = t.docente_correo || (t.docente_rut ? (await env.DB.prepare("SELECT correo FROM usuarios WHERE rut=?").bind(t.docente_rut).first())?.correo : "") || "";
      const labs = (await env.DB.prepare("SELECT correo FROM usuarios WHERE rol='laboratorio' AND laboratorio_id=? AND estado='ACTIVO' AND COALESCE(correo,'')<>''").bind(t.laboratorio_id).all()).results.map(x => x.correo);
      let para = [], cc = [], a = "";
      if (u.rol === "laboratorio") { para = [est]; cc = [doc, dt]; a = "estudiante"; }
      else if (u.rol === "estudiante" || u.rol === "docente" || u.rol === "profesional") { para = labs; cc = [dt]; a = "laboratorio"; }
      else fail(403, "Este correo lo envían el laboratorio, el estudiante o el docente.");
      para = [...new Set(para.filter(Boolean))]; cc = [...new Set(cc.filter(x => x && !para.includes(x) && x !== u.correo))];
      if (t.origen === "privada" && a === "estudiante") a = "profesional";
      if (!para.length) fail(409, a === "profesional" ? "El profesional no tiene correo registrado." : a === "estudiante" ? "El estudiante no tiene correo registrado." : "El laboratorio no tiene correos registrados (sus perfiles deben tener correo).");
      await evento(env, t.id, u, "CORREO PREPARADO", `Para ${a}${cc.length ? " · con copia a " + cc.join(", ") : ""}`).run();
      return json({ para, cc, a });
    }

    if (acc === "fotos" && m === "GET") {
      return json((await env.DB.prepare("SELECT id,en,rut,quien,rol,nota,bytes FROM fotos WHERE trabajo_id=? ORDER BY id").bind(t.id).all()).results);
    }
    if (acc === "fotos" && m === "POST") { // fotos del trabajo: estudiante y laboratorio (y personal del CSU)
      if (!(esSol(u, t) || (u.rol === "laboratorio" && u.laboratorio_id === t.laboratorio_id) || esCSU)) fail(403, "No puedes subir fotos a este trabajo.");
      const m_ = String(body.data || "").match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/); if (!m_) fail(400, "Formato de imagen no válido.");
      const bin = Uint8Array.from(atob(m_[2]), c => c.charCodeAt(0));
      if (bin.length > 900_000) fail(413, "La foto es muy pesada (máximo 900 KB después de comprimir).");
      const n = (await env.DB.prepare("SELECT COUNT(*) AS n FROM fotos WHERE trabajo_id=?").bind(t.id).first()).n; if (n >= 20) fail(409, "Este trabajo ya tiene 20 fotos (máximo).");
      const nota = txt(body.nota, 140);
      const ins = await env.DB.prepare("INSERT INTO fotos(trabajo_id,rut,quien,rol,nota,mime,bytes,data) VALUES(?,?,?,?,?,?,?,?)").bind(t.id, u.rut, nombreDe(u), u.rol, nota, m_[1], bin.length, bin.buffer).run();
      await evento(env, t.id, u, "FOTO AGREGADA", nota || "").run();
      return json({ id: ins.meta.last_row_id });
    }

    if (acc === "entrega-dt" && m === "POST") { // el DT registra la entrega de la orden sin QR (marcha blanca / fuerza mayor) con la fecha real
      if (!admin) fail(403, "Solo el Director Técnico registra la entrega sin QR por fuerza mayor.");
      if (t.estado !== "RECEPCIONADA" || !t.docente_aprobado_en || t.entrega_orden_en || t.digital) fail(409, "Esta orden no tiene pendiente la entrega del estudiante.");
      const quien_ = txt(body.entrega, 120) || t.estudiante_nombre, motivo = txt(body.motivo, 300), f = txt(body.fecha, 10), hoy_ = hoyCL();
      if (motivo.length < 5) fail(400, "Indica el motivo.");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(f) || f > hoy_) fail(400, "Fecha de entrega inválida (no puede ser futura).");
      if ((Date.parse(hoy_) - Date.parse(f)) / 864e5 > 90) fail(400, "La fecha no puede ser de hace más de 90 días.");
      const en = f === hoy_ ? null : `${f} 15:00:00`; // mediodía de Chile, guardado en UTC
      await env.DB.batch([env.DB.prepare(`UPDATE trabajos SET entrega_orden_en=${en ? "?" : "datetime('now')"}, entrega_orden_entrega=?, entrega_orden_recibe=?, buzon_en=NULL, buzon_por=NULL, actualizado_en=datetime('now') WHERE id=? AND entrega_orden_en IS NULL`)
          .bind(...(en ? [en] : []), `${quien_} (sin QR, fuerza mayor)`, quienEs(u, t), t.id),
        evento(env, t.id, u, "ENTREGA DE LA ORDEN SIN QR (FUERZA MAYOR, DT)", `Entregó: ${quien_}. Fecha real de entrega: ${f.split("-").reverse().join("-")}. Motivo: ${motivo}`)]);
      return json({ ok: true });
    }
    if (acc === "comunicacion" && m === "POST") { // mensaje libre (WhatsApp o correo) de recepción/DT a estudiante, docente o laboratorio
      if (!esCSU && !admin) fail(403, "Sin permiso.");
      const canal = body.canal === "correo" ? "correo" : "WhatsApp", a0 = ["estudiante", "docente", "laboratorio"].includes(body.a) ? body.a : "estudiante", a = t.origen === "privada" && a0 === "estudiante" ? "profesional" : a0;
      await evento(env, t.id, u, "COMUNICACIÓN", `${canal} a ${a === "laboratorio" ? "laboratorio " + t.laboratorio : a}${txt(body.nombre) ? " (" + txt(body.nombre, 80) + ")" : ""}${txt(body.plantilla) ? " · " + txt(body.plantilla, 60) : ""}`).run();
      return json({ ok: true });
    }
    if (acc === "aviso-lab" && m === "POST") { // constancia de aviso al laboratorio (retiro pendiente o etapa sin actualizar)
      if (!esCSU && !admin) fail(403, "Sin permiso.");
      const canal = body.canal === "correo" ? "correo" : "WhatsApp", mot = body.motivo === "etapa" ? "etapa sin actualizar" : body.motivo === "digital" ? "confirmar la recepción de archivos digitales" : "retiro pendiente de más de 48 horas hábiles";
      await evento(env, t.id, u, "AVISO AL LABORATORIO", `${canal} a ${t.laboratorio}: ${mot}${txt(body.a) ? " · para " + txt(body.a, 80) : ""}`).run();
      return json({ ok: true });
    }
    if (acc === "encuesta" && m === "POST") {
      const rol = u.rol === "profesional" && u.rut === t.estudiante_rut ? "profesional" : u.rol === "estudiante" && u.rut === t.estudiante_rut ? "estudiante" : u.rol === "docente" && u.rut === t.docente_rut ? "docente" : "";
      if (!rol) fail(403, "La encuesta la responden el estudiante y el docente del trabajo (o el profesional en clínica privada).");
      if (!["TERMINADO", "REQUIERE_AJUSTE"].includes(t.estado)) fail(409, "La encuesta se responde cuando el trabajo ya fue evaluado en boca.");
      const P = encPreg(await cfgGet(env))[rol === "profesional" ? "docente" : rol], om = !!body.omitir;
      const resp = om ? [] : (Array.isArray(body.respuestas) ? body.respuestas : []).slice(0, P.length).map(Number);
      if (!om && (resp.length !== P.length || resp.some(x => !Number.isInteger(x) || x < 1 || x > 5))) fail(400, "Responde todas las preguntas (1 a 5).");
      const r = await env.DB.prepare(`INSERT OR IGNORE INTO encuestas(trabajo_id,rut,rol,laboratorio_id,tipo_trabajo,preguntas,respuestas,comentario,omitida,prueba) VALUES(?,?,?,?,?,?,?,?,?,?)`)
        .bind(t.id, u.rut, rol, t.laboratorio_id, t.tipo_trabajo || "", JSON.stringify(P), JSON.stringify(resp), om ? "" : txt(body.comentario, 500), om ? 1 : 0, esPrueba(t.presupuesto) ? 1 : 0).run();
      if (!r.meta.changes) fail(409, "Ya respondiste la encuesta de este trabajo.");
      return json({ ok: true });
    }
    if (acc === "aviso" && m === "POST") { // deja constancia de que se preparó un aviso (WhatsApp o correo)
      if (!esCSU) fail(403, "Sin permiso.");
      const canal = body.canal === "correo" ? "correo" : "WhatsApp", a = t.origen === "privada" ? "profesional" : body.a === "docente" ? "docente" : body.a === "ambos" ? "estudiante y docente" : "estudiante";
      await evento(env, t.id, u, "AVISO PREPARADO", `${canal} a ${a}${canal === "WhatsApp" && u.telefono_salida ? " desde el WhatsApp del CSU +" + u.telefono_salida : ""}${canal === "correo" && u.correo ? " desde " + u.correo : ""}`).run();
      return json({ ok: true });
    }

    if (acc === "garantia" && m === "POST") { // el laboratorio acepta o rechaza; el DT tiene la última palabra
      const esLab = u.rol === "laboratorio" && u.laboratorio_id === t.laboratorio_id;
      if (!esLab && !admin) fail(403, "La garantía la responde el laboratorio (y el Director Técnico puede cambiar la decisión).");
      if (!t.garantia) fail(409, "Este trabajo no está marcado como posible garantía.");
      if (esLab && !admin && t.garantia !== "POSIBLE") fail(409, "La garantía ya fue respondida; si hay que cambiarla, avisa al Director Técnico.");
      if (typeof body.acepta !== "boolean") fail(400, "Indica si se acepta como garantía.");
      const mo = txt(body.motivo, 300); if (!body.acepta && mo.length < 5) fail(400, "Indica el motivo por el que no corresponde garantía.");
      const prev = t.garantia, base = t.garantia_arancel != null && t.garantia_arancel !== "" ? +t.garantia_arancel : t.arancel;
      await env.DB.batch([env.DB.prepare("UPDATE trabajos SET garantia=?, garantia_motivo=?, garantia_por=?, garantia_en=datetime('now'), garantia_arancel=?, arancel=?, actualizado_en=datetime('now') WHERE id=?")
          .bind(body.acepta ? "ACEPTADA" : "RECHAZADA", mo || t.garantia_motivo || "", quienEs(u, t), base, body.acepta ? 0 : base, t.id),
        evento(env, t.id, u, body.acepta ? "GARANTÍA ACEPTADA (SIN COSTO)" : "GARANTÍA NO CORRESPONDE", `${prev !== "POSIBLE" ? "Cambia la decisión anterior (" + prev.toLowerCase() + "). " : ""}${mo}`)]);
      return json({ ok: true });
    }
    if (acc === "anular" && m === "POST") {
      if (!admin) fail(403, "Solo el administrador anula.");
      const motivo = txt(body.motivo, 200); if (motivo.length < 5) fail(400, "Indica el motivo.");
      await env.DB.batch([env.DB.prepare("UPDATE trabajos SET estado='ANULADA', actualizado_en=datetime('now') WHERE id=?").bind(t.id), evento(env, t.id, u, "ANULADA", motivo)]);
      return json({ ok: true });
    }
  }

  if (seg[0] === "traspaso" && seg[1]) {
    const x = await env.DB.prepare("SELECT * FROM traspasos WHERE token=?").bind(seg[1]).first();
    if (!x) fail(404, "Código de traspaso no válido.");
    if (seg[2] === "estado") {
      if (x.entrega_rut !== u.rut) fail(403, "Sin acceso.");
      const t = await env.DB.prepare("SELECT estado FROM trabajos WHERE id=?").bind(x.trabajo_id).first();
      return json({ usado: x.usado === 1, vencido: x.usado !== 1 && Date.now() > x.expira, estado: t.estado });
    }
    const t = await env.DB.prepare("SELECT t.*, l.nombre AS laboratorio FROM trabajos t JOIN laboratorios l ON l.id=t.laboratorio_id WHERE t.id=?").bind(x.trabajo_id).first();
    if (x.tipo === "firma_docente") {
      const motivo = x.usado === 1 ? "Este código ya fue usado." : x.usado === 2 ? "Este código fue reemplazado por uno más nuevo." : Date.now() > x.expira ? "El código venció (dura 2 minutos). Pide que generen uno nuevo." :
        t.origen === "privada" ? "Clínica privada: este trabajo no requiere firma de docente." : t.docente_aprobado_en ? `Este trabajo ya fue aprobado por ${t.docente_aprobado_por}.` : !["SOLICITADA", "RECEPCIONADA"].includes(t.estado) ? "El trabajo ya no está en esta etapa." :
        u.rol !== "docente" ? "Este código debe escanearlo un docente con su propio perfil." : t.docente_rut && t.docente_rut !== u.rut ? `Este trabajo está a cargo del docente ${t.docente_nombre}.` : "";
      if (m === "GET") {
        const ent = await env.DB.prepare("SELECT * FROM usuarios WHERE rut=?").bind(x.entrega_rut).first();
        return json({ valido: !motivo, motivo, firma: true, texto: "Aprobación del docente (firma)", confirmar: "Apruebo este trabajo", entrega: nombreDe(ent),
          trabajo: motivo ? null : { id: t.id, num_orden: t.num_orden || "(por asignar)", presupuesto: t.presupuesto, paciente_nombre: t.paciente_nombre, paciente_rut: t.paciente_rut, codigo_smile: t.codigo_smile, tipo_trabajo: t.tipo_trabajo, diente: t.diente, laboratorio: t.estado === "SOLICITADA" ? "(por asignar)" : t.laboratorio, estudiante_nombre: t.estudiante_nombre } });
      }
      if (m === "POST" && seg[2] === "aceptar") {
        if (motivo) fail(409, motivo);
        const r = await env.DB.prepare("UPDATE traspasos SET usado=1 WHERE token=? AND usado=0 AND expira>=?").bind(x.token, Date.now()).run();
        if (!r.meta.changes) fail(409, "El código ya no es válido.");
        const ent = await env.DB.prepare("SELECT * FROM usuarios WHERE rut=?").bind(x.entrega_rut).first();
        await env.DB.batch([
          env.DB.prepare(`UPDATE trabajos SET docente_aprobado_en=datetime('now'), docente_aprobado_por=?, docente_aprobado_rut=?,
            docente_rut=CASE WHEN COALESCE(docente_rut,'')='' THEN ? ELSE docente_rut END, docente_nombre=CASE WHEN COALESCE(docente_nombre,'')='' THEN ? ELSE docente_nombre END,
            docente_telefono=CASE WHEN COALESCE(docente_telefono,'')='' THEN ? ELSE docente_telefono END, docente_correo=CASE WHEN COALESCE(docente_correo,'')='' THEN ? ELSE docente_correo END,
            exc_sol_en=NULL, exc_sol_por=NULL, exc_motivo=NULL, exc_docente=NULL, actualizado_en=datetime('now') WHERE id=? AND docente_aprobado_en IS NULL`).bind(nombreDe(u), u.rut, u.rut, nombreDe(u), u.telefono || "", u.correo || "", t.id),
          evento(env, t.id, u, "APROBADO POR DOCENTE (FIRMA QR)", `Firmó: ${nombreDe(u)}. QR mostrado por: ${nombreDe(ent)}.`),
        ]);
        return json({ ok: true, id: t.id });
      }
    }
    const def = defDe(t);
    let labMal = ""; // laboratorio que escanea con su perfil asociado a otro laboratorio: decirlo claro para que se corrija el perfil
    if (def && def.tipo === x.tipo && u.rol === "laboratorio" && u.laboratorio_id !== t.laboratorio_id && ["retiro_lab", "entrega_csu"].includes(def.tipo)) {
      const mio = (await env.DB.prepare("SELECT nombre FROM laboratorios WHERE id=?").bind(u.laboratorio_id).first())?.nombre || "otro laboratorio";
      labMal = `Tu perfil está registrado en el laboratorio ${mio}, pero este trabajo es de ${t.laboratorio}. Pide al Director Técnico que corrija el laboratorio de tu perfil; mientras tanto, recepción puede registrar el traspaso sin QR.`; }
    const motivo0 = x.usado === 1 ? "Este código ya fue usado." : x.usado === 2 ? "Este código fue reemplazado por uno más nuevo." : Date.now() > x.expira ? "El código venció (dura 2 minutos). Pide que generen uno nuevo." :
      !def || def.tipo !== x.tipo ? "El trabajo ya no está en esta etapa." : x.entrega_rut === u.rut ? "No puedes recibir un traspaso que tú mismo generaste." : !def.recibe(u, t) ? `Este traspaso debe recibirlo ${quien(def, t)}.` : "";
    const motivo = x.usado === 0 && Date.now() <= x.expira && labMal ? labMal : motivo0;
    if (m === "GET") {
      const ent = await env.DB.prepare("SELECT * FROM usuarios WHERE rut=?").bind(x.entrega_rut).first();
      return json({ valido: !motivo, motivo, texto: def?.texto, confirmar: def?.confirmar || "Confirmo que recibo este trabajo", invertir: !!def?.invertir, entrega: nombreDe(ent), trabajo: motivo ? null : { id: t.id, num_orden: t.num_orden, presupuesto: t.presupuesto, paciente_nombre: t.paciente_nombre, paciente_rut: t.paciente_rut, tipo_trabajo: t.tipo_trabajo, diente: t.diente, laboratorio: t.laboratorio, estudiante_nombre: t.estudiante_nombre } });
    }
    if (m === "POST" && seg[2] === "aceptar") {
      if (motivo) fail(409, motivo);
      const r = await env.DB.prepare("UPDATE traspasos SET usado=1 WHERE token=? AND usado=0 AND expira>=?").bind(x.token, Date.now()).run();
      if (!r.meta.changes) fail(409, "El código ya no es válido.");
      await aplicarTraspaso(env, t, def, x.entrega_rut, u, null);
      return json({ ok: true, id: t.id });
    }
  }

  if (seg[0] === "fotos" && seg[1]) { // ver o borrar una foto (con permiso sobre su trabajo)
    const f = await env.DB.prepare("SELECT * FROM fotos WHERE id=?").bind(+seg[1]).first(); if (!f) fail(404, "Foto no encontrada.");
    const t = await trabajo(env, u, f.trabajo_id);
    if (m === "DELETE") {
      if (!(admin || f.rut === u.rut)) fail(403, "Solo quien subió la foto (o el administrador) puede borrarla.");
      await env.DB.batch([env.DB.prepare("DELETE FROM fotos WHERE id=?").bind(f.id), evento(env, t.id, u, "FOTO ELIMINADA", f.nota || "")]);
      return json({ ok: true });
    }
    const d = f.data; const bytes = d instanceof ArrayBuffer ? new Uint8Array(d) : ArrayBuffer.isView(d) ? new Uint8Array(d.buffer, d.byteOffset, d.byteLength) : new Uint8Array(d);
    return new Response(bytes, { headers: { "content-type": f.mime, "cache-control": "private, max-age=86400" } });
  }

  if (seg[0] === "laboratorios" && seg[2] === "contactos" && m === "GET") { // a quién avisar en un laboratorio (personal del CSU)
    if (!esCSU && !admin) fail(403, "Sin acceso.");
    return json((await env.DB.prepare("SELECT nombre,apellido,telefono,correo FROM usuarios WHERE rol='laboratorio' AND laboratorio_id=? AND estado='ACTIVO' ORDER BY nombre").bind(+seg[1]).all()).results);
  }
  if (seg[0] === "encuestas") {
    await asegurarColor(env);
    if (seg[1] === "mias" && m === "GET") return json((await env.DB.prepare("SELECT trabajo_id FROM encuestas WHERE rut=?").bind(u.rut).all()).results.map(x => x.trabajo_id));
    if (seg[1] === "preguntas" && m === "GET") return json(encPreg(await cfgGet(env)));
    if (!admin) fail(403, "Solo el administrador.");
    const pr = new URL(req.url).searchParams.get("prueba") === "1" ? 1 : 0;
    const rows = (await env.DB.prepare(`SELECT e.*, l.nombre AS laboratorio, t.num_orden FROM encuestas e LEFT JOIN laboratorios l ON l.id=e.laboratorio_id LEFT JOIN trabajos t ON t.id=e.trabajo_id WHERE e.prueba=? ORDER BY e.id`).bind(pr).all()).results;
    if (seg[1] === "lista" && m === "GET") { // detalle de cada encuesta aplicada (solo el DT)
      const us = new Map((await env.DB.prepare("SELECT rut,nombre,apellido FROM usuarios").all()).results.map(x => [x.rut, `${x.nombre || ""} ${x.apellido || ""}`.trim()]));
      return json(rows.slice().reverse().map(e => ({ id: e.id, en: e.creado_en, trabajo_id: e.trabajo_id, num_orden: e.num_orden, laboratorio: e.laboratorio || "—", tipo_trabajo: e.tipo_trabajo, rol: e.rol,
        nombre: us.get(e.rut) || e.rut, omitida: !!e.omitida, preguntas: JSON.parse(e.preguntas || "[]"), respuestas: JSON.parse(e.respuestas || "[]"), comentario: e.comentario || "" }))); }
    if (seg[1] === "resumen" && m === "GET") {
      const out = {}; rows.forEach(e => { const k = `${e.laboratorio || "—"}|${e.rol}`; const o = out[k] ||= { laboratorio: e.laboratorio || "—", rol: e.rol, n: 0, omitidas: 0, preguntas: {} };
        if (e.omitida) { o.omitidas++; return; } o.n++; const P = JSON.parse(e.preguntas || "[]"), R_ = JSON.parse(e.respuestas || "[]");
        P.forEach((q, i) => { const s_ = o.preguntas[q] ||= { suma: 0, n: 0, top: 0 }; if (R_[i]) { s_.suma += R_[i]; s_.n++; if (R_[i] >= 4) s_.top++; } }); });
      return json(Object.values(out)); }
    if (seg[1] === "export.csv" && m === "GET") {
      const us = new Map((await env.DB.prepare("SELECT rut,nombre,apellido FROM usuarios").all()).results.map(x => [x.rut, `${x.nombre || ""} ${x.apellido || ""}`.trim()]));
      const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`, max = Math.max(1, ...rows.map(e => JSON.parse(e.preguntas || "[]").length));
      const head = ["fecha", "laboratorio", "orden", "tipo_trabajo", "quien_responde", "nombre", "omitida", ...Array.from({ length: max }, (_, i) => [`pregunta_${i + 1}`, `respuesta_${i + 1}`]).flat(), "comentario"];
      const lines = rows.map(e => { const P = JSON.parse(e.preguntas || "[]"), R_ = JSON.parse(e.respuestas || "[]");
        return [new Date(e.creado_en.replace(" ", "T") + "Z").toLocaleString("es-CL", { timeZone: "America/Santiago" }), e.laboratorio, e.num_orden, e.tipo_trabajo, e.rol, us.get(e.rut) || e.rut, e.omitida ? "Sí" : "No", ...Array.from({ length: max }, (_, i) => [P[i] || "", R_[i] || ""]).flat(), e.comentario].map(esc).join(";"); });
      return new Response("\ufeff" + [head.join(";"), ...lines].join("\r\n"), { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="encuestas-laboratorio.csv"`, "cache-control": "no-store" } }); }
    fail(404, "Ruta no encontrada.");
  }
  if (seg[0] === "export.csv" && m === "GET") {
    if (!esCSU) fail(403, "Sin acceso.");
    const r = (await env.DB.prepare(`SELECT t.id,t.presupuesto,t.num_orden,t.intento,t.orden_padre,t.fecha_recepcion,t.paciente_nombre,t.paciente_rut,t.codigo_smile,t.estudiante_rut,t.estudiante_nombre,t.estudiante_telefono,t.estudiante_correo,t.docente_rut,t.docente_nombre,t.docente_telefono,t.docente_correo,t.tipo_trabajo,t.arancel,t.plazo_dias,t.diente,l.nombre AS laboratorio,
      t.estado,t.etapa_lab,t.docente_aprobado_en,t.docente_aprobado_por,t.entrega_orden_en,t.entrega_orden_entrega,t.entrega_orden_recibe,t.retiro_lab_en,t.retiro_lab_entrega,t.retiro_lab_recibe,t.entrega_csu_en,t.entrega_csu_entrega,t.entrega_csu_recibe,t.retiro_est_en,t.retiro_est_entrega,t.retiro_est_recibe,
      t.prueba_est_en,t.prueba_est_resultado,t.prueba_est_obs,t.prueba_en,t.prueba_resultado,t.prueba_por,t.prueba_obs,t.color,CASE WHEN t.origen='privada' THEN 'clínica privada' ELSE 'docencia' END AS origen,COALESCE(t.garantia,'') AS garantia,COALESCE(t.garantia_motivo,'') AS garantia_motivo FROM trabajos t JOIN laboratorios l ON l.id=t.laboratorio_id WHERE upper(trim(t.presupuesto)) NOT LIKE 'PRUEBA%' ORDER BY t.id`).all()).results;
    r.forEach(x => { x.color = colorTxt(x.color); });
    { const byId = new Map(r.map(x => [x.id, x])), raiz = x => { let y = x, g = 0; while (y.orden_padre && byId.has(y.orden_padre) && g++ < 50) y = byId.get(y.orden_padre); return y; };
      const par = new Map(), f = k => { while (par.get(k) !== k) { par.set(k, par.get(par.get(k))); k = par.get(k); } return k; }, un = (a, b) => { [a, b].forEach(k => par.has(k) || par.set(k, k)); par.set(f(a), f(b)); };
      r.forEach(x => { const ks = [txt(x.paciente_rut) && "R" + txt(x.paciente_rut), txt(x.codigo_smile) && "S" + txt(x.codigo_smile)].filter(Boolean); ks.forEach(k => un(k, ks[0])); });
      const pac = x => { const k = txt(x.paciente_rut) ? "R" + txt(x.paciente_rut) : txt(x.codigo_smile) ? "S" + txt(x.codigo_smile) : ""; return k ? f(k) : ""; };
      const casos = new Map(); r.forEach(x => { const k = pac(x); if (!k) return; if (!casos.has(k)) casos.set(k, new Set()); casos.get(k).add(raiz(x).id); });
      r.forEach(x => { const z = raiz(x); x.caso_orden_original = z.num_orden; x.es_ajuste = (x.intento || 1) > 1 ? "Sí" : "No"; x.casos_del_paciente = casos.get(pac(x))?.size || 1; delete x.orden_padre; }); }
    const cols = (r.length ? Object.keys(r[0]) : ["id"]).filter(c => admin || c !== "arancel");
    const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = "﻿" + [cols.join(";"), ...r.map(x => cols.map(c => esc(x[c])).join(";"))].join("\r\n");
    return new Response(csv, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="trabajos-laboratorio.csv"`, "cache-control": "no-store" } });
  }

  fail(404, "Ruta no encontrada.");
}

export async function onRequest({ request, env, params }) {
  try {
    if (!env.DB) fail(500, "Falta conectar la base de datos (binding DB).");
    return await rutear(request, env, (params.path || []).join("/"));
  } catch (e) {
    if (e instanceof HttpErr) return json({ error: e.message, ...(e.extra || {}) }, e.s);
    return json({ error: "Error interno: " + (e?.message || e) }, 500);
  }
}
