// Muestreo numérico de una distribución para graficarla.

import { resolver } from '../datos/index.js';

/**
 * Puntos de la fmp/fdp y de la FDA, recortando las colas despreciables.
 * @param {import('../datos/tipos.js').Distribucion} d
 * @param {Record<string, number>} p
 */
export function muestrear(d, p) {
  const [a, b] = (d.calc.rangoGrafica ?? d.calc.rango)(p);
  const discreta = d.tipo === 'discreta';
  let xs = [];
  if (discreta) {
    for (let x = Math.ceil(a); x <= Math.floor(b); x++) xs.push(x);
  } else {
    const n = 2000;
    for (let i = 0; i <= n; i++) xs.push(a + ((b - a) * i) / n);
  }
  let ys = xs.map((x) => d.calc.densidad(x, p));

  // FDA acumulada sobre el rango completo.
  const fda = new Array(xs.length);
  let acum = 0;
  for (let i = 0; i < xs.length; i++) {
    if (discreta) acum += ys[i];
    else if (i > 0) acum += ((ys[i] + ys[i - 1]) / 2) * (xs[i] - xs[i - 1]);
    fda[i] = Math.min(acum, 1);
  }

  // Recorte de colas.
  const max = Math.max(...ys);
  const umbral = max * (discreta ? 1e-4 : 1e-3);
  let i0 = 0;
  let i1 = xs.length - 1;
  while (i0 < i1 && ys[i0] < umbral) i0++;
  while (i1 > i0 && ys[i1] < umbral) i1--;
  if (discreta) {
    // Conserva al menos los extremos del soporte cercano.
    i0 = Math.max(0, i0 - 1);
    i1 = Math.min(xs.length - 1, i1 + 1);
  }
  return {
    discreta,
    xs: xs.slice(i0, i1 + 1),
    ys: ys.slice(i0, i1 + 1),
    fda: fda.slice(i0, i1 + 1),
    max,
  };
}

/**
 * Malla para la superficie 3D: filas = valores del parámetro que varía.
 * @param {import('../datos/tipos.js').Distribucion} d
 * @param {Record<string, number>} p
 */
export function superficie(d, p, filasMax = 28) {
  const sup = d.superficie;
  const param = d.parametros.find((q) => q.id === sup.param);
  const entero = param.paso >= 1;
  const vmin = resolver(sup.min, p);
  const vmax = resolver(sup.max, p);
  let valores = [];
  for (let i = 0; i < filasMax; i++) {
    let v = vmin + ((vmax - vmin) * i) / (filasMax - 1);
    if (entero) v = Math.round(v);
    valores.push(v);
  }
  valores = [...new Set(valores)];

  const filas = valores.map((v) => {
    const q = { ...p, [sup.param]: v };
    return d.calc.ajustar ? d.calc.ajustar(q) : q;
  });

  // Rango de x común a todas las filas.
  let xmin = Infinity;
  let xmax = -Infinity;
  for (const q of filas) {
    const m = muestrear(d, q);
    xmin = Math.min(xmin, m.xs[0]);
    xmax = Math.max(xmax, m.xs[m.xs.length - 1]);
  }
  const discreta = d.tipo === 'discreta';
  const xs = [];
  if (discreta) {
    const paso = Math.max(1, Math.ceil((xmax - xmin + 1) / 70));
    for (let x = xmin; x <= xmax; x += paso) xs.push(x);
  } else {
    const n = 90;
    for (let i = 0; i <= n; i++) xs.push(xmin + ((xmax - xmin) * i) / n);
  }
  const z = filas.map((q) => xs.map((x) => d.calc.densidad(x, q)));
  const zmax = Math.max(...z.flat());
  return { xs, valores, z, zmax, discreta, param };
}

/** Marcas "bonitas" para un eje. */
export function marcas(min, max, cuantas = 6) {
  const rango = max - min || 1;
  const bruto = rango / cuantas;
  const pot = Math.pow(10, Math.floor(Math.log10(bruto)));
  const f = bruto / pot;
  const paso = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * pot;
  const res = [];
  for (let v = Math.ceil(min / paso) * paso; v <= max + paso * 1e-9; v += paso) res.push(+v.toFixed(10));
  return res;
}

/** Formato numérico con punto decimal y sin ceros sobrantes. */
export function fmt(v, dec = 4) {
  if (!Number.isFinite(v)) return '—';
  if (Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-3 && v !== 0)) return v.toExponential(2);
  return String(+v.toFixed(dec));
}
