const CATALOGO = {
  alto: { uf: 1.0, label: "Nivel alto", desc: "Fiscalización sectorial activa, certificación de vigencia limitada y riesgo a las personas.", items: [
    "Ascensores, montacargas y escaleras mecánicas",
    "Gas: red centralizada, estanques de GLP a granel o sala de medidores",
    "Calderas, agua caliente sanitaria centralizada y climatización central",
    "Piscina, spa o espejo de agua de uso recreativo",
    "Planta elevadora o planta de tratamiento de aguas servidas",
    "Subestación eléctrica propia o empalme en media tensión"
  ]},
  medio: { uf: 0.5, label: "Nivel medio", desc: "Mantención obligatoria o certificación periódica, sin fiscalización permanente.", items: [
    "Red seca, red húmeda y sistemas fijos de extinción",
    "Grupo electrógeno",
    "Bombeo, presurización y acumulación de agua potable",
    "Control de acceso motorizado: portones, barreras y torniquetes",
    "CCTV con grabación y retención de imágenes",
    "Estacionamiento subterráneo con ventilación forzada o detección de CO",
    "Detección de humo o alarma centralizada"
  ]},
  bajo: { uf: 0.3, label: "Nivel bajo", desc: "Inspección y mantención programada, con riesgo acotado.", items: [
    "Juegos infantiles y equipamiento deportivo comunitario",
    "Áreas verdes con riego automatizado, sobre 1.000 m²",
    "Alumbrado de vías y espacios comunes, sobre 40 luminarias",
    "Recintos reservables: sala multiuso, quincho, gimnasio",
    "Sala de residuos con acopio y retiro contratado"
  ]}
};

const PARAMS_DEFAULT = {
  baseUF: 10, dotacionUF: 0.75, tope: 30, pmInicial: 40, pmEtapa: 15, iva: 19, garantiaPct: 50,
  t1Hasta: 80, t1Coef: 0.070, t2Hasta: 180, t2Coef: 0.055, t3Coef: 0.045,
  ufAlto: 1.0, ufMedio: 0.5, ufBajo: 0.3
};
const tramosDe = (p) => [
  { hasta: p.t1Hasta, coef: p.t1Coef, label: "Unidades · tramo 1 a " + p.t1Hasta },
  { hasta: p.t2Hasta, coef: p.t2Coef, label: "Unidades · tramo " + (p.t1Hasta + 1) + " a " + p.t2Hasta },
  { hasta: Infinity, coef: p.t3Coef, label: "Unidades · tramo " + (p.t2Hasta + 1) + " y siguientes" }
];
const ufNivel = (p) => ({ alto: p.ufAlto, medio: p.ufMedio, bajo: p.ufBajo });

const r2 = (n) => Math.round(n * 100) / 100;
const ufC = (n) => n.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " UF";
const ufC3 = (n) => n.toLocaleString("es-CL", { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + " UF";
const ufFmt = (n) => n.toLocaleString("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " UF";
const uf3 = (n) => n.toLocaleString("es-CL", { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + " UF";
const clp = (n) => "$" + Math.round(n).toLocaleString("es-CL");

function calcular({ unidades, trabajadores, sistemas, etapasPosteriores, incluirPM, params }) {
  const p = { ...PARAMS_DEFAULT, ...(params || {}) };
  const niveles = ufNivel(p);
  let resto = Math.max(0, unidades), desde = 0;
  const tramos = tramosDe(p).map((t) => {
    const cupo = t.hasta === Infinity ? resto : Math.max(0, Math.min(resto, t.hasta - desde));
    desde = t.hasta;
    const n = Math.min(resto, cupo);
    resto -= n;
    return { ...t, n, subtotal: n * t.coef };
  });
  const unidadesUF = tramos.reduce((a, t) => a + t.subtotal, 0);
  const dotacionUF = trabajadores * p.dotacionUF;
  const instBruto = Object.entries(sistemas).reduce((a, [key, st]) => {
    if (!st.on) return a;
    const nivel = key.split("|")[0];
    return a + niveles[nivel] * (st.garantia ? p.garantiaPct / 100 : 1);
  }, 0);
  const tope = (p.baseUF + unidadesUF) * (p.tope / 100);
  const instUF = Math.min(instBruto, tope);
  const honorario = r2(p.baseUF + unidadesUF + dotacionUF + instUF);
  const pm = incluirPM ? p.pmInicial + p.pmEtapa * etapasPosteriores : 0;
  return { p, niveles, tramos, unidadesUF, dotacionUF, instBruto, instUF, tope, topeAplicado: instBruto > tope + 1e-9, honorario, pm,
    porUnidad: unidades > 0 ? honorario / unidades : 0 };
}

const C = { orange: "#d5863b", slate: "#4a5a68", ink: "#2b3138", paper: "#f4f1ec", line: "rgba(43,49,56,.14)", white: "#fff" };
const FD = "'Montserrat',system-ui,sans-serif";
const FB = "'Source Sans Pro',system-ui,sans-serif";

const cotStyles = {
  shell: { minHeight: "100vh", display: "grid", background: "#dedad4", fontFamily: FB, color: C.ink },
  panel: { background: C.white, borderRight: "1px solid " + C.line, padding: "34px 32px 60px", display: "flex", flexDirection: "column", gap: 30, overflowY: "auto", maxHeight: "100vh" },
  brandRow: { display: "flex", flexDirection: "column", gap: 14, paddingBottom: 22, borderBottom: "3px solid " + C.ink },
  eyebrow: { fontFamily: FD, fontSize: 11, fontWeight: 700, letterSpacing: ".22em", textTransform: "uppercase", color: C.orange },
  h1: { fontFamily: FD, fontSize: 27, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.1 },
  section: { display: "flex", flexDirection: "column", gap: 14 },
  legend: { fontFamily: FD, fontSize: 12, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.slate },
  field: { display: "flex", flexDirection: "column", gap: 7 },
  label: { fontSize: 14, color: C.slate },
  input: { fontFamily: FD, fontSize: 19, fontWeight: 600, padding: "12px 14px", border: "1px solid " + C.line, borderRadius: 2, background: C.paper, color: C.ink, width: "100%", outline: "none" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  catHead: { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginTop: 6 },
  catName: { fontFamily: FD, fontSize: 14, fontWeight: 700, letterSpacing: ".04em" },
  catUf: { fontFamily: FD, fontSize: 13, fontWeight: 700, color: C.orange, whiteSpace: "nowrap", flex: "0 0 auto" },
  catDesc: { fontSize: 13, lineHeight: 1.4, color: C.slate },
  row: { display: "grid", gridTemplateColumns: "22px 1fr auto", gap: 10, alignItems: "start", padding: "9px 0", borderBottom: "1px solid " + C.line, fontSize: 14, lineHeight: 1.35 },
  gar: { fontFamily: FD, fontSize: 10, fontWeight: 700, letterSpacing: ".1em", padding: "4px 8px", borderRadius: 2, cursor: "pointer", border: "1px solid " + C.line, background: "transparent", color: C.slate, whiteSpace: "nowrap" },
  garOn: { background: C.orange, color: C.white, borderColor: C.orange },
  main: { padding: "40px 46px 70px", overflowY: "auto", maxHeight: "100vh" },
  sheet: { background: C.white, padding: "48px 52px", maxWidth: 920, margin: "0 auto", display: "flex", flexDirection: "column", gap: 34, boxShadow: "0 1px 0 rgba(43,49,56,.08)" },
  sheetHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24, paddingBottom: 18, borderBottom: "3px solid " + C.ink },
  bigFig: { fontFamily: FD, fontSize: 74, fontWeight: 700, letterSpacing: "-.04em", lineHeight: .9, color: C.ink },
  th: { fontFamily: FD, fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.slate, textAlign: "left", padding: "0 0 10px", borderBottom: "2px solid " + C.ink },
  td: { fontSize: 15, padding: "12px 0", borderBottom: "1px solid " + C.line, verticalAlign: "top" },
  num: { fontFamily: FD, fontWeight: 600, textAlign: "right", whiteSpace: "nowrap" },
  totalRow: { fontFamily: FD, fontSize: 19, fontWeight: 700, padding: "16px 0", borderBottom: "3px solid " + C.ink },
  note: { fontSize: 13.5, lineHeight: 1.5, color: C.slate },
  cardRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 2, background: C.line },
  card: { background: C.paper, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 8 },
  cardK: { fontFamily: FD, fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.orange },
  cardV: { fontFamily: FD, fontSize: 27, fontWeight: 700, letterSpacing: "-.02em" },
  warn: { background: "#fdf3e6", borderLeft: "4px solid " + C.orange, padding: "14px 16px", fontSize: 14, lineHeight: 1.45 },
  btn: { fontFamily: FD, fontSize: 13, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", padding: "14px 26px", border: "2px solid " + C.ink, background: "transparent", color: C.ink, cursor: "pointer", borderRadius: 0 },
  btnFill: { background: C.orange, borderColor: C.orange, color: C.white },
  paramGrid: { display: "grid", gridTemplateColumns: "1fr 96px", gap: "8px 12px", alignItems: "center" },
  paramLab: { fontSize: 13.5, lineHeight: 1.3, color: C.ink },
  paramIn: { fontFamily: FD, fontSize: 15, fontWeight: 600, padding: "8px 10px", border: "1px solid " + C.line, borderRadius: 2, background: C.paper, color: C.ink, width: "100%", outline: "none", textAlign: "right" },
  paramSub: { fontFamily: FD, fontSize: 11, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: C.orange, marginTop: 8 },
  disclose: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", background: "transparent", border: "none", borderBottom: "2px solid " + C.ink, padding: "0 0 10px", cursor: "pointer", fontFamily: FD, fontSize: 12, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: C.slate }
};

function ParamRow({ label, value, onChange, step = 1, unit }) {
  return (
    <React.Fragment>
      <span style={cotStyles.paramLab}>{label}{unit ? <span style={{ color: C.slate }}> ({unit})</span> : null}</span>
      <input type="number" step={step} min={0} value={value} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} style={cotStyles.paramIn} />
    </React.Fragment>
  );
}

function Num({ label, value, onChange, min = 0, step = 1, suffix }) {
  return (
    <div style={cotStyles.field}>
      <span style={cotStyles.label}>{label}</span>
      <div style={{ position: "relative" }}>
        <input type="number" value={value} min={min} step={step} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} style={cotStyles.input} />
        {suffix ? <span style={{ position: "absolute", right: 14, top: 14, fontFamily: FD, fontSize: 13, fontWeight: 600, color: C.slate }}>{suffix}</span> : null}
      </div>
    </div>
  );
}

Object.assign(window, { ufC, ufC3, CATALOGO, PARAMS_DEFAULT, tramosDe, ufNivel, ParamRow, calcular, cotStyles, C, FD, FB, ufFmt, uf3, clp, r2, Num });
