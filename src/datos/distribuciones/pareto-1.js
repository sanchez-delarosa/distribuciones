const media = ({ alpha, theta }) => (alpha > 1 ? (alpha * theta) / (alpha - 1) : Infinity);
const varianza = ({ alpha, theta }) =>
  alpha > 2 ? (alpha * theta * theta) / ((alpha - 1) * (alpha - 1) * (alpha - 2)) : Infinity;

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'pareto-1',
  nombre: 'Pareto I (clásica)',
  tipo: 'continua',
  notacion: 'X \\sim \\text{Pareto}_{I}(\\alpha, \\theta)',
  descripcion:
    'Distribución de cola pesada con ley de potencias a partir de un umbral mínimo $\\theta > 0$. Se usa para modelar grandes siniestros por encima de una prioridad de reaseguro y distribución de la riqueza.',
  alias: ['pareto', 'pareto tipo 1', 'pareto clasica', 'single-parameter pareto'],
  parametros: [
    { id: 'alpha', tex: '\\alpha', nombre: 'forma (índice de cola)', restriccion: '\\alpha > 0', min: 2.2, max: 10, paso: 0.2, valor: 6 },
    { id: 'theta', tex: '\\theta', nombre: 'mínimo (umbral)', restriccion: '\\theta > 0', min: 0.5, max: 5, paso: 0.25, valor: 2 },
  ],
  soporte: 'x \\in [\\theta, \\infty)',
  formulas: {
    densidad: 'f(x) = \\frac{\\alpha\\,\\theta^{\\alpha}}{x^{\\alpha + 1}}',
    fda: 'F(x) = 1 - \\left(\\frac{\\theta}{x}\\right)^{\\alpha}, \\quad x \\ge \\theta',
    supervivencia: 'S(x) = \\left(\\frac{\\theta}{x}\\right)^{\\alpha}, \\quad x \\ge \\theta',
    riesgo: 'h(x) = \\frac{\\alpha}{x}, \\quad x \\ge \\theta',
    media: 'E[X] = \\frac{\\alpha\\,\\theta}{\\alpha - 1}, \\quad \\alpha > 1',
    varianza: '\\operatorname{Var}(X) = \\frac{\\alpha\\,\\theta^{2}}{(\\alpha - 1)^{2}(\\alpha - 2)}, \\quad \\alpha > 2',
  },
  extras: [
    { etiqueta: 'Momentos', tex: 'E[X^{k}] = \\frac{\\alpha\\,\\theta^{k}}{\\alpha - k}, \\quad k < \\alpha' },
    { etiqueta: 'Valor en riesgo', tex: '\\operatorname{VaR}_{p}(X) = \\theta\\,(1 - p)^{-1/\\alpha}' },
    { etiqueta: 'TVaR', tex: '\\operatorname{TVaR}_{p}(X) = \\frac{\\alpha}{\\alpha - 1}\\,\\operatorname{VaR}_{p}(X), \\quad \\alpha > 1' },
    { etiqueta: 'Esperanza limitada', tex: 'E[X \\wedge d] = \\frac{\\alpha\\,\\theta - \\theta^{\\alpha} d^{1 - \\alpha}}{\\alpha - 1}, \\quad d \\ge \\theta,\\ \\alpha \\ne 1' },
  ],
  propiedades: [
    { letra: 'S', detalle: 'cX \\sim \\text{Pareto}_{I}(\\alpha,\\, c\\theta), \\quad c > 0' },
    { letra: 'M', detalle: 'X_i \\sim \\text{Pareto}_{I}(\\alpha_i, \\theta) \\Rightarrow \\min_i X_i \\sim \\text{Pareto}_{I}\\Big(\\sum_i \\alpha_i,\\, \\theta\\Big)' },
    { letra: 'R', detalle: 'X \\mid X > d \\sim \\text{Pareto}_{I}(\\alpha,\\, d), \\quad d > \\theta' },
    { letra: 'V', detalle: 'X = \\theta\\,U^{-1/\\alpha}, \\quad U \\sim \\text{Uniforme}(0, 1)' },
  ],
  notas: [
    'El $k$-ésimo momento existe únicamente si $k < \\alpha$; su función generadora de momentos no existe para $t > 0$.',
    'En *Loss Models* se le llama *single-parameter Pareto* porque a menudo el umbral $\\theta$ se conoce de antemano (por ejemplo, el deducible o prioridad).',
  ],
  superficie: { param: 'alpha', min: 2.5, max: 8 },
  calc: {
    densidad: (x, { alpha, theta }) => (x < theta ? 0 : (alpha * Math.pow(theta, alpha)) / Math.pow(x, alpha + 1)),
    rango: ({ alpha, theta }) => [theta, theta * Math.pow(1e-8, -1 / alpha)],
    media,
    varianza,
  },
};
