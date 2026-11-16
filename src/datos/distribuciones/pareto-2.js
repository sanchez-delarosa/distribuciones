const media = ({ alpha, theta }) => (alpha > 1 ? theta / (alpha - 1) : Infinity);
const varianza = ({ alpha, theta }) =>
  alpha > 2 ? (alpha * theta * theta) / ((alpha - 1) * (alpha - 1) * (alpha - 2)) : Infinity;

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'pareto-2',
  nombre: 'Pareto II (Lomax)',
  tipo: 'continua',
  notacion: 'X \\sim \\text{Pareto}_{II}(\\alpha, \\theta)',
  descripcion:
    'Versión desplazada al origen ($x \\ge 0$) de la Pareto. Surge al mezclar una exponencial cuya tasa sigue una distribución Gamma y es el modelo estándar de severidad de cola pesada en *Loss Models*.',
  alias: ['pareto', 'lomax', 'pareto tipo 2', 'two-parameter pareto'],
  parametros: [
    { id: 'alpha', tex: '\\alpha', nombre: 'forma (índice de cola)', restriccion: '\\alpha > 0', min: 2.2, max: 10, paso: 0.2, valor: 6 },
    { id: 'theta', tex: '\\theta', nombre: 'escala', restriccion: '\\theta > 0', min: 0.5, max: 5, paso: 0.25, valor: 2 },
  ],
  soporte: 'x \\in [0, \\infty)',
  formulas: {
    densidad: 'f(x) = \\frac{\\alpha\\,\\theta^{\\alpha}}{(x + \\theta)^{\\alpha + 1}}',
    fda: 'F(x) = 1 - \\left(\\frac{\\theta}{x + \\theta}\\right)^{\\alpha}, \\quad x \\ge 0',
    supervivencia: 'S(x) = \\left(\\frac{\\theta}{x + \\theta}\\right)^{\\alpha}, \\quad x \\ge 0',
    riesgo: 'h(x) = \\frac{\\alpha}{x + \\theta}, \\quad x \\ge 0',
    media: 'E[X] = \\frac{\\theta}{\\alpha - 1}, \\quad \\alpha > 1',
    varianza: '\\operatorname{Var}(X) = \\frac{\\alpha\\,\\theta^{2}}{(\\alpha - 1)^{2}(\\alpha - 2)}, \\quad \\alpha > 2',
  },
  extras: [
    { etiqueta: 'Momentos', tex: 'E[X^{k}] = \\frac{\\theta^{k}\\,k!\\,\\Gamma(\\alpha - k)}{\\Gamma(\\alpha)}, \\quad k < \\alpha' },
    { etiqueta: 'Exceso medio', tex: 'e(d) = E[X - d \\mid X > d] = \\frac{d + \\theta}{\\alpha - 1}, \\quad \\alpha > 1' },
    { etiqueta: 'Valor en riesgo', tex: '\\operatorname{VaR}_{p}(X) = \\theta\\big((1 - p)^{-1/\\alpha} - 1\\big)' },
    { etiqueta: 'TVaR', tex: '\\operatorname{TVaR}_{p}(X) = \\operatorname{VaR}_{p}(X) + \\frac{\\theta\\,(1 - p)^{-1/\\alpha}}{\\alpha - 1}, \\quad \\alpha > 1' },
    {
      etiqueta: 'Esperanza limitada',
      tex: 'E[X \\wedge d] = \\frac{\\theta}{\\alpha - 1}\\left[1 - \\left(\\frac{\\theta}{d + \\theta}\\right)^{\\alpha - 1}\\right], \\quad \\alpha \\ne 1',
    },
  ],
  propiedades: [
    { letra: 'S', detalle: 'cX \\sim \\text{Pareto}_{II}(\\alpha,\\, c\\theta), \\quad c > 0' },
    { letra: 'R', detalle: 'X - d \\mid X > d \\sim \\text{Pareto}_{II}(\\alpha,\\, \\theta + d)' },
    { letra: 'V', detalle: 'X = \\theta\\big(U^{-1/\\alpha} - 1\\big), \\quad U \\sim \\text{Uniforme}(0, 1)' },
  ],
  notas: [
    'Al aplicar un deducible $d$, la pérdida en exceso $X - d \\mid X > d$ sigue siendo $\\text{Pareto}_{II}$ con el mismo $\\alpha$ y nueva escala $\\theta + d$.',
    'Su función de exceso medio $e(d) = \\frac{d + \\theta}{\\alpha - 1}$ crece linealmente con el deducible $d$, señal característica de una cola más pesada que la exponencial.',
  ],
  superficie: { param: 'alpha', min: 2.5, max: 8 },
  calc: {
    densidad: (x, { alpha, theta }) => (x < 0 ? 0 : (alpha * Math.pow(theta, alpha)) / Math.pow(x + theta, alpha + 1)),
    rango: ({ alpha, theta }) => [0, theta * (Math.pow(1e-8, -1 / alpha) - 1)],
    media,
    varianza,
  },
};
