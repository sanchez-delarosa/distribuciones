// Catálogo de materias del plan de estudios de la licenciatura en Actuaría.
// El campo `orden` define la secuencia curricular para el filtro acumulado.

/**
 * @typedef {Object} InfoMateria
 * @property {string} id
 * @property {string} nombre
 * @property {string} corto
 * @property {number} orden
 * @property {string} color
 * @property {string} descripcion
 */

/** @type {Record<string, InfoMateria>} */
export const MATERIAS = {
  probabilidad: {
    id: 'probabilidad',
    nombre: 'Probabilidad',
    corto: 'Prob. I',
    orden: 1,
    color: '#38bdf8',
    descripcion: 'Primer curso de probabilidad: modelos discretos y continuos fundamentales, transformaciones y teoremas límite.',
  },
  'probabilidad-avanzada': {
    id: 'probabilidad-avanzada',
    nombre: 'Probabilidad Avanzada',
    corto: 'Prob. Avanzada',
    orden: 2,
    color: '#a78bfa',
    descripcion: 'Segundo curso: familias adicionales, estadísticos de orden, mezclas, vectores aleatorios y convergencia.',
  },
  inferencia: {
    id: 'inferencia',
    nombre: 'Inferencia Estadística',
    corto: 'Inferencia',
    orden: 3,
    color: '#34d399',
    descripcion: 'Distribuciones muestrales exactas y asintóticas para estimación y pruebas de hipótesis (t, F, etc.).',
  },
  'matematicas-actuariales': {
    id: 'matematicas-actuariales',
    nombre: 'Matemáticas Actuariales',
    corto: 'Mat. Actuariales',
    orden: 4,
    color: '#f87171',
    descripcion: 'Modelos biométricos de supervivencia, tablas de mortalidad, fuerza de mortalidad (De Moivre, constante, Gompertz y Makeham) y tiempo de vida futuro.',
  },
  'teoria-del-riesgo': {
    id: 'teoria-del-riesgo',
    nombre: 'Teoría del Riesgo / Modelos Actuariales',
    corto: 'T. del Riesgo',
    orden: 5,
    color: '#fb923c',
    descripcion: 'Modelos de severidad de cola pesada, frecuencia de siniestros, distribuciones compuestas y familia de Burr/Pareto.',
  },
  'procesos-estocasticos': {
    id: 'procesos-estocasticos',
    nombre: 'Procesos Estocásticos / Simulación',
    corto: 'P. Estocásticos',
    orden: 6,
    color: '#f472b6',
    descripcion: 'Distribuciones de tiempos de espera, primera llegada, tipo fase, valores extremos y simulación.',
  },
  bayesiana: {
    id: 'bayesiana',
    nombre: 'Estadística Bayesiana / Credibilidad',
    corto: 'Bayesiana',
    orden: 7,
    color: '#facc15',
    descripcion: 'Familias conjugadas, distribuciones predictivas (Beta-Binomial, Gamma-Poisson, etc.) y modelos jerárquicos de credibilidad.',
  },
};
