const { CATALOGO, calcular, cotStyles: S, C, FD, ufFmt, uf3, ufC, ufC3, clp, PARAMS_DEFAULT, ufNivel, ParamRow, Num } = window;
const { useState, useMemo } = React;

const KEY = "coproactiva.cotizador.v1";

function initSistemas() {
  const o = {};
  Object.entries(CATALOGO).forEach(([nivel, g]) => g.items.forEach((it, i) => { o[nivel + "|" + i] = { on: false, garantia: false }; }));
  return o;
}

function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return null;
}

function App() {
  const saved = load();
  const [f, setF] = useState(saved || {
    comunidad: "", comuna: "", contacto: "",
    unidades: 120, trabajadores: 3, etapasPosteriores: 0, incluirPM: true,
    valorUF: 40000, sistemas: initSistemas(), params: { ...PARAMS_DEFAULT }
  });
  const [abrirParams, setAbrirParams] = useState(false);
  const P = { ...PARAMS_DEFAULT, ...(f.params || {}) };
  const setP = (k, v) => set("params", { ...P, [k]: v });
  const niveles = ufNivel(P);
  const IVA = P.iva / 100;
  const set = (k, v) => setF((p) => { const n = { ...p, [k]: v }; try { localStorage.setItem(KEY, JSON.stringify(n)); } catch (e) {} return n; });
  const setSist = (key, patch) => set("sistemas", { ...f.sistemas, [key]: { ...f.sistemas[key], ...patch } });

  const c = useMemo(() => calcular(f), [f]);
  const netoMes = c.honorario * f.valorUF;
  const ivaMes = netoMes * IVA;
  const pmNeto = c.pm * f.valorUF;

  const activos = Object.entries(f.sistemas).filter(([, s]) => s.on)
    .map(([k, s]) => { const [nivel, i] = k.split("|"); return { nivel, name: CATALOGO[nivel].items[Number(i)], uf: niveles[nivel] * (s.garantia ? P.garantiaPct / 100 : 1), garantia: s.garantia }; });

  return (
    <div style={S.shell} className="shell">
      <aside style={S.panel} className="no-print panel">
        <div style={S.brandRow}>
          <span style={S.eyebrow}>Coproactiva · Modelo de cobro v1.0</span>
          <h1 style={S.h1}>Cotizador de honorarios de administración</h1>
        </div>

        <div style={S.section}>
          <span style={S.legend}>Identificación</span>
          <div style={S.field}><span style={S.label}>Condominio</span><input value={f.comunidad} placeholder="Nombre del condominio" onChange={(e) => set("comunidad", e.target.value)} style={{ ...S.input, fontSize: 16 }} /></div>
          <div style={S.grid2}>
            <div style={S.field}><span style={S.label}>Comuna</span><input value={f.comuna} onChange={(e) => set("comuna", e.target.value)} style={{ ...S.input, fontSize: 16 }} /></div>
            <div style={S.field}><span style={S.label}>Contacto</span><input value={f.contacto} onChange={(e) => set("contacto", e.target.value)} style={{ ...S.input, fontSize: 16 }} /></div>
          </div>
        </div>

        <div style={S.section}>
          <span style={S.legend}>Variables del cálculo</span>
          <div style={S.grid2}>
            <Num label="Unidades enajenables" value={f.unidades} onChange={(v) => set("unidades", v)} />
            <Num label="Trabajadores dependientes" value={f.trabajadores} onChange={(v) => set("trabajadores", v)} />
          </div>
          <div style={S.grid2}>
            <Num label="Valor UF" value={f.valorUF} step={100} onChange={(v) => set("valorUF", v)} suffix="$" />
            <Num label="Etapas posteriores" value={f.etapasPosteriores} onChange={(v) => set("etapasPosteriores", v)} />
          </div>
          <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14, cursor: "pointer" }}>
            <input type="checkbox" checked={f.incluirPM} onChange={(e) => set("incluirPM", e.target.checked)} />
            Incluir puesta en marcha ({ufC(P.pmInicial)} + {ufC(P.pmEtapa)} por etapa)
          </label>
        </div>

        <div style={S.section}>
          <button style={S.disclose} onClick={() => setAbrirParams(!abrirParams)}>
            <span>Parámetros del modelo</span>
            <span style={{ color: C.orange }}>{abrirParams ? "Ocultar −" : "Editar +"}</span>
          </button>
          {abrirParams ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={S.paramSub}>Componentes</span>
              <div style={S.paramGrid}>
                <ParamRow label="Base por comunidad" unit="UF" step={0.5} value={P.baseUF} onChange={(v) => setP("baseUF", v)} />
                <ParamRow label="Por trabajador" unit="UF" step={0.05} value={P.dotacionUF} onChange={(v) => setP("dotacionUF", v)} />
              </div>
              <span style={S.paramSub}>Tramos de unidades</span>
              <div style={S.paramGrid}>
                <ParamRow label="Tramo 1 · hasta unidad" value={P.t1Hasta} onChange={(v) => setP("t1Hasta", v)} />
                <ParamRow label="Tramo 1 · coeficiente" unit="UF" step={0.001} value={P.t1Coef} onChange={(v) => setP("t1Coef", v)} />
                <ParamRow label="Tramo 2 · hasta unidad" value={P.t2Hasta} onChange={(v) => setP("t2Hasta", v)} />
                <ParamRow label="Tramo 2 · coeficiente" unit="UF" step={0.001} value={P.t2Coef} onChange={(v) => setP("t2Coef", v)} />
                <ParamRow label="Tramo 3 · coeficiente" unit="UF" step={0.001} value={P.t3Coef} onChange={(v) => setP("t3Coef", v)} />
              </div>
              <span style={S.paramSub}>Instalaciones</span>
              <div style={S.paramGrid}>
                <ParamRow label="Nivel alto" unit="UF" step={0.05} value={P.ufAlto} onChange={(v) => setP("ufAlto", v)} />
                <ParamRow label="Nivel medio" unit="UF" step={0.05} value={P.ufMedio} onChange={(v) => setP("ufMedio", v)} />
                <ParamRow label="Nivel bajo" unit="UF" step={0.05} value={P.ufBajo} onChange={(v) => setP("ufBajo", v)} />
                <ParamRow label="Tope sobre base + unidades" unit="%" value={P.tope} onChange={(v) => setP("tope", v)} />
                <ParamRow label="Cómputo bajo garantía" unit="%" step={5} value={P.garantiaPct} onChange={(v) => setP("garantiaPct", v)} />
              </div>
              <span style={S.paramSub}>Puesta en marcha e impuestos</span>
              <div style={S.paramGrid}>
                <ParamRow label="Puesta en marcha inicial" unit="UF" value={P.pmInicial} onChange={(v) => setP("pmInicial", v)} />
                <ParamRow label="Por etapa posterior" unit="UF" value={P.pmEtapa} onChange={(v) => setP("pmEtapa", v)} />
                <ParamRow label="IVA" unit="%" value={P.iva} onChange={(v) => setP("iva", v)} />
              </div>
              <button style={{ ...S.btn, marginTop: 12, fontSize: 11, padding: "10px 18px" }} onClick={() => set("params", { ...PARAMS_DEFAULT })}>Restaurar valores del modelo</button>
            </div>
          ) : null}
        </div>

        <div style={S.section}>
          <span style={S.legend}>Instalaciones relevantes</span>
          {Object.entries(CATALOGO).map(([nivel, g]) => (
            <div key={nivel}>
              <div style={S.catHead}><span style={S.catName}>{g.label}</span><span style={S.catUf}>{ufC(niveles[nivel])}</span></div>
              <p style={{ ...S.catDesc, margin: "6px 0 8px" }}>{g.desc}</p>
              {g.items.map((it, i) => {
                const key = nivel + "|" + i, st = f.sistemas[key];
                return (
                  <div key={key} style={S.row}>
                    <input type="checkbox" checked={st.on} onChange={(e) => setSist(key, { on: e.target.checked })} style={{ marginTop: 3 }} />
                    <span style={{ opacity: st.on ? 1 : .62 }}>{it}</span>
                    <button onClick={() => setSist(key, { on: true, garantia: !st.garantia })} style={{ ...S.gar, ...(st.garantia ? S.garOn : null) }} title="Mantención a cargo del constructor: se computa parcialmente">{P.garantiaPct}% garantía</button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <button onClick={() => window.print()} style={{ ...S.btn, ...S.btnFill }}>Imprimir / Guardar PDF</button>
      </aside>

      <main style={S.main} className="mainpane">
        <div style={S.sheet} id="propuesta">
          <div style={S.sheetHead}>
            <div>
              <div style={{ ...S.eyebrow, marginBottom: 8 }}>Propuesta de honorarios</div>
              <div style={{ fontFamily: FD, fontSize: 34, fontWeight: 700, letterSpacing: "-.025em", lineHeight: 1.05 }}>{f.comunidad || "Condominio sin nombre"}</div>
              <div style={{ fontSize: 15, color: C.slate, marginTop: 6 }}>{[f.comuna, f.unidades + " unidades", f.trabajadores + " trabajadores"].filter(Boolean).join(" · ")}</div>
            </div>
            <img src="../ELEMENTOS sgv/COPRO - imagologo horizontal.svg" alt="Coproactiva" style={{ height: 42 }} />
          </div>

          <div style={S.cardRow}>
            <div style={S.card}><span style={S.cardK}>Honorario mensual</span><span style={S.cardV}>{ufFmt(c.honorario)}</span><span style={{ fontSize: 13, color: C.slate }}>{clp(netoMes)} neto · {clp(netoMes + ivaMes)} con IVA</span></div>
            <div style={S.card}><span style={S.cardK}>Por unidad</span><span style={S.cardV}>{uf3(c.porUnidad)}</span><span style={{ fontSize: 13, color: C.slate }}>{clp(c.porUnidad * f.valorUF)} neto</span></div>
            <div style={S.card}><span style={S.cardK}>Puesta en marcha</span><span style={S.cardV}>{f.incluirPM ? ufFmt(c.pm) : "—"}</span><span style={{ fontSize: 13, color: C.slate }}>{f.incluirPM ? clp(pmNeto) + " neto · cargo del propietario" : "No incluida"}</span></div>
          </div>

          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={S.th}>Componente</th><th style={{ ...S.th, textAlign: "right" }}>Cantidad</th><th style={{ ...S.th, textAlign: "right" }}>Coeficiente</th><th style={{ ...S.th, textAlign: "right" }}>Subtotal</th></tr></thead>
              <tbody>
                <tr><td style={S.td}>Base por comunidad</td><td style={{ ...S.td, ...S.num }}>1</td><td style={{ ...S.td, ...S.num }}>{ufC(P.baseUF)}</td><td style={{ ...S.td, ...S.num }}>{ufFmt(P.baseUF)}</td></tr>
                {c.tramos.map((t) => (
                  <tr key={t.label} style={{ opacity: t.n ? 1 : .45 }}>
                    <td style={S.td}>{t.label}</td><td style={{ ...S.td, ...S.num }}>{t.n}</td><td style={{ ...S.td, ...S.num }}>{ufC3(t.coef)}</td><td style={{ ...S.td, ...S.num }}>{ufFmt(t.subtotal)}</td>
                  </tr>
                ))}
                <tr><td style={S.td}>Trabajadores dependientes</td><td style={{ ...S.td, ...S.num }}>{f.trabajadores}</td><td style={{ ...S.td, ...S.num }}>{ufC(P.dotacionUF)}</td><td style={{ ...S.td, ...S.num }}>{ufFmt(c.dotacionUF)}</td></tr>
                {activos.map((a) => (
                  <tr key={a.name}><td style={S.td}>{a.name}<span style={{ color: C.slate }}>{a.garantia ? " · " + P.garantiaPct + "% garantía" : ""}</span></td><td style={{ ...S.td, ...S.num }}>1</td><td style={{ ...S.td, ...S.num }}>{ufC(a.uf)}</td><td style={{ ...S.td, ...S.num }}>{ufFmt(a.uf)}</td></tr>
                ))}
                {c.topeAplicado ? (
                  <tr><td style={{ ...S.td, color: C.orange }}>Ajuste por tope de instalaciones ({P.tope}%)</td><td style={S.td}></td><td style={S.td}></td><td style={{ ...S.td, ...S.num, color: C.orange }}>−{ufFmt(c.instBruto - c.instUF)}</td></tr>
                ) : null}
                <tr><td style={S.totalRow}>Honorario mensual neto</td><td style={S.totalRow}></td><td style={S.totalRow}></td><td style={{ ...S.totalRow, ...S.num }}>{ufFmt(c.honorario)}</td></tr>
              </tbody>
            </table>
          </div>

          {c.topeAplicado ? (
            <div style={S.warn}>El subtotal de instalaciones ({ufFmt(c.instBruto)}) excede el tope del {P.tope}% sobre Base más Unidades ({ufFmt(c.tope)}). Se aplica el tope conforme al punto 3 del modelo.</div>
          ) : null}

          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={S.th}>Facturación mensual referencial</th><th style={{ ...S.th, textAlign: "right" }}>UF</th><th style={{ ...S.th, textAlign: "right" }}>Pesos</th></tr></thead>
              <tbody>
                <tr><td style={S.td}>Honorario neto</td><td style={{ ...S.td, ...S.num }}>{ufFmt(c.honorario)}</td><td style={{ ...S.td, ...S.num }}>{clp(netoMes)}</td></tr>
                <tr><td style={S.td}>IVA {P.iva}%</td><td style={{ ...S.td, ...S.num }}>{ufFmt(c.honorario * IVA)}</td><td style={{ ...S.td, ...S.num }}>{clp(ivaMes)}</td></tr>
                <tr><td style={S.totalRow}>Total mensual</td><td style={{ ...S.totalRow, ...S.num }}>{ufFmt(c.honorario * (1 + IVA))}</td><td style={{ ...S.totalRow, ...S.num }}>{clp(netoMes + ivaMes)}</td></tr>
              </tbody>
            </table>
          </div>

          <p style={S.note}>Valores expresados en Unidades de Fomento; la equivalencia en pesos es referencial y se calcula con UF = {clp(f.valorUF)}. La facturación se emite en pesos según el valor de la UF del último día del mes facturado. Los valores son netos y el condominio no tiene derecho a crédito fiscal. Honorario devengado desde la designación por escritura pública, facturación mensual anticipada dentro de los primeros cinco días y pago dentro de los cinco días siguientes. Reajuste automático por variación de la UF y recálculo de pleno derecho en cada recepción definitiva parcial y al 1 de enero. Documento interno de referencia comercial: no constituye oferta mientras no se formalice en una propuesta suscrita.</p>
        </div>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
