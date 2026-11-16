// Validador de integridad de los datos: referencias, LaTeX y comprobación numérica.

import katex from 'katex';
import { DISTRIBUCIONES, RELS, TIPOS_RELACION, PROPIEDADES, MATERIAS, parametrosIniciales } from './index.js';
import { fragmentosTex } from '../ui/tex.js';

function probarTex(cadena, donde, errores) {
  if (!cadena) return;
  try {
    katex.renderToString(cadena, { throwOnError: true, strict: 'ignore' });
  } catch (e) {
    errores.push(`LaTeX inválido en ${donde}: «${cadena}» (${e.message})`);
  }
}

export function validarDatos() {
  /** @type {string[]} */
  const errores = [];
  const ids = new Set();

  for (const d of DISTRIBUCIONES) {
    if (ids.has(d.id)) errores.push(`ID de distribución duplicado: ${d.id}`);
    ids.add(d.id);
    if (!MATERIAS[d.materia]) errores.push(`Materia desconocida «${d.materia}» en ${d.id}`);

    probarTex(d.notacion, `${d.id}.notacion`, errores);
    probarTex(d.soporte, `${d.id}.soporte`, errores);
    for (const frag of fragmentosTex(d.descripcion)) probarTex(frag, `${d.id}.descripcion`, errores);
    for (const [k, v] of Object.entries(d.formulas)) probarTex(v, `${d.id}.formulas.${k}`, errores);
    for (const e of d.extras ?? []) probarTex(e.tex, `${d.id}.extras.${e.etiqueta}`, errores);
    if (d.claseAB) {
      for (const [k, v] of Object.entries(d.claseAB)) probarTex(v, `${d.id}.claseAB.${k}`, errores);
    }
    for (const p of d.parametros) {
      probarTex(p.tex, `${d.id}.param.${p.id}.tex`, errores);
      probarTex(p.restriccion, `${d.id}.param.${p.id}.restriccion`, errores);
    }
    for (const q of d.propiedades ?? []) {
      if (!PROPIEDADES[q.letra]) errores.push(`Propiedad desconocida «${q.letra}» en ${d.id}`);
      probarTex(q.detalle, `${d.id}.prop.${q.letra}`, errores);
    }
    for (const n of d.notas ?? []) {
      for (const frag of fragmentosTex(n)) probarTex(frag, `${d.id}.notas`, errores);
    }

    // Comprobación numérica con los parámetros iniciales.
    const p = parametrosIniciales(d);
    const [a, b] = d.calc.rango(p);
    let masa = 0;
    let m1 = 0;
    let m2 = 0;
    if (d.tipo === 'discreta') {
      for (let x = Math.ceil(a); x <= Math.floor(b); x++) {
        const y = d.calc.densidad(x, p);
        if (y < -1e-12 || Number.isNaN(y)) errores.push(`fmp inválida en ${d.id} para x=${x}: ${y}`);
        masa += y;
        m1 += x * y;
        m2 += x * x * y;
      }
    } else {
      const N = 4000;
      if (b - a > 1000) {
        const du = 1 / N;
        for (let i = 0; i <= N; i++) {
          const u = i * du;
          const x = a + (b - a) * u * u * u;
          const y = d.calc.densidad(x, p);
          const peso = (i === 0 || i === N ? 0.5 * du : du) * 3 * (b - a) * u * u;
          masa += y * peso;
          m1 += x * y * peso;
          m2 += x * x * y * peso;
        }
      } else if (b - a <= 10) {
        const dth = Math.PI / N;
        const mid = 0.5 * (a + b);
        const rad = 0.5 * (b - a);
        for (let i = 0; i < N; i++) {
          const th = (i + 0.5) * dth;
          const x = mid - rad * Math.cos(th);
          const y = d.calc.densidad(x, p);
          const peso = rad * Math.sin(th) * dth;
          masa += y * peso;
          m1 += x * y * peso;
          m2 += x * x * y * peso;
        }
      } else {
        const h = (b - a) / N;
        for (let i = 0; i <= N; i++) {
          const x = a + i * h;
          const y = d.calc.densidad(x, p);
          const peso = i === 0 || i === N ? 0.5 * h : h;
          masa += y * peso;
          m1 += x * y * peso;
          m2 += x * x * y * peso;
        }
      }
    }
    const mediaTeorica = d.calc.media(p);
    const varTeorica = d.calc.varianza(p);
    const varNum = m2 - m1 * m1;
    if (Math.abs(masa - 1) > 2e-3) {
      errores.push(`${d.id}: la densidad suma/integra ${masa.toFixed(5)} ≠ 1`);
    }
    if (Math.abs(m1 - mediaTeorica) > 5e-3) {
      errores.push(`${d.id}: media numérica ${m1.toFixed(4)} ≠ teórica ${mediaTeorica.toFixed(4)}`);
    }
    if (Math.abs(varNum - varTeorica) / Math.max(1, varTeorica) > 1e-2) {
      errores.push(`${d.id}: varianza numérica ${varNum.toFixed(4)} ≠ teórica ${varTeorica.toFixed(4)}`);
    }
  }

  const idsRel = new Set();
  for (const r of RELS) {
    if (idsRel.has(r.id)) errores.push(`Relación duplicada: ${r.id}`);
    idsRel.add(r.id);
    if (!ids.has(r.de)) errores.push(`Relación ${r.id}: origen desconocido «${r.de}»`);
    if (!ids.has(r.a)) errores.push(`Relación ${r.id}: destino desconocido «${r.a}»`);
    if (!TIPOS_RELACION[r.tipo]) errores.push(`Relación ${r.id}: tipo desconocido «${r.tipo}»`);
    probarTex(r.condicion, `rel(${r.id}).condicion`, errores);
    for (const frag of fragmentosTex(r.explicacion)) probarTex(frag, `rel(${r.id}).explicacion`, errores);
  }

  return {
    ok: errores.length === 0,
    errores,
    resumen: {
      distribuciones: DISTRIBUCIONES.length,
      discretas: DISTRIBUCIONES.filter((d) => d.tipo === 'discreta').length,
      continuas: DISTRIBUCIONES.filter((d) => d.tipo === 'continua').length,
      relaciones: RELS.length,
    },
  };
}
