// Punto único de acceso a los datos: normaliza relaciones y arma índices.

import { DISTRIBUCIONES as RAW_DISTRIBUCIONES } from './distribuciones/index.js';
import { RELACIONES } from './relaciones.js';
import { TIPOS_RELACION } from './tiposRelacion.js';
import { PROPIEDADES } from './propiedades.js';
import { MATERIAS } from './materias.js';

/** @type {import('./tipos.js').Distribucion[]} */
export const DISTRIBUCIONES = RAW_DISTRIBUCIONES.map((d) => ({
  ...d,
  materia: d.materia ?? 'probabilidad',
}));

export { TIPOS_RELACION, PROPIEDADES, MATERIAS };

/** Devuelve la definición de la materia a la que pertenece una distribución. */
export const materiaDe = (d) => MATERIAS[d.materia ?? 'probabilidad'] ?? MATERIAS.probabilidad;

/** @type {Map<string, import('./tipos.js').Distribucion>} */
export const porId = new Map(DISTRIBUCIONES.map((d) => [d.id, d]));

/** Relaciones con `id` garantizado. */
export const RELS = RELACIONES.map((r) => ({ ...r, id: r.id ?? `${r.de}__${r.tipo}__${r.a}` }));

/** @type {Map<string, typeof RELS[number]>} */
export const relPorId = new Map(RELS.map((r) => [r.id, r]));

/** Relaciones que salen de / llegan a cada distribución. */
export const salientes = new Map(DISTRIBUCIONES.map((d) => [d.id, []]));
export const entrantes = new Map(DISTRIBUCIONES.map((d) => [d.id, []]));
for (const r of RELS) {
  salientes.get(r.de)?.push(r);
  entrantes.get(r.a)?.push(r);
}

/** Tipos de relación que aparecen al menos una vez, en el orden del catálogo. */
export const tiposUsados = Object.keys(TIPOS_RELACION).filter((t) => RELS.some((r) => r.tipo === t));

/** Valores iniciales de los parámetros de una distribución. */
export function parametrosIniciales(d) {
  const p = Object.fromEntries(d.parametros.map((q) => [q.id, q.valor]));
  return d.calc.ajustar ? d.calc.ajustar(p) : p;
}

/** Evalúa un valor que puede ser número o función de los parámetros. */
export const resolver = (v, p) => (typeof v === 'function' ? v(p) : v);
