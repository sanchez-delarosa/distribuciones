import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'burr',
  nombre: 'Burr',
  tipo: 'continua',
  materia: 'teoria-del-riesgo',
  notacion: 'X \\sim \\text{Burr}(\\alpha, \\gamma, \\theta)',
  descripcion:
    'Familia continua de tres parámetros (tipo XII de Burr o Pareto tipo IV) con soporte $(0, \\infty)$. En seguros de daños y reaseguro es uno de los modelos de severidad más versátiles porque combina flexibilidad en el origen ($x^{\\gamma - 1}$) y en la cola derecha ($x^{-\\alpha\\gamma - 1}$) manteniendo funciones de distribución, supervivencia y cuantiles en forma cerrada.',
  alias: ['burr xii', 'pareto tipo iv', 'singh-maddala'],
  parametros: [
    { id: 'alpha', tex: '\\alpha', nombre: 'forma de cola', restriccion: '\\alpha > 0', min: 0.5, max: 10, paso: 0.5, valor: 3 },
    { id: 'gamma', tex: '\\gamma', nombre: 'forma de potencia', restriccion: '\\gamma > 0', min: 0.5, max: 8, paso: 0.5, valor: 3 },
    { id: 'theta', tex: '\\theta', nombre: 'escala', restriccion: '\\theta > 0', min: 0.5, max: 10, paso: 0.5, valor: 2 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{\\alpha\\,\\gamma\\,(x / \\theta)^{\\gamma - 1}}{\\theta\\,\\big[1 + (x / \\theta)^{\\gamma}\\big]^{\\alpha + 1}}',
    fda: 'F(x) = 1 - \\big[1 + (x / \\theta)^{\\gamma}\\big]^{-\\alpha}',
    supervivencia: 'S(x) = \\big[1 + (x / \\theta)^{\\gamma}\\big]^{-\\alpha}',
    riesgo: 'h(x) = \\frac{\\alpha\\,\\gamma\\,(x / \\theta)^{\\gamma - 1}}{\\theta\\,\\big[1 + (x / \\theta)^{\\gamma}\\big]}',
    media:
      'E[X] = \\theta\\,\\frac{\\Gamma\\!\\left(1 + \\frac{1}{\\gamma}\\right)\\Gamma\\!\\left(\\alpha - \\frac{1}{\\gamma}\\right)}{\\Gamma(\\alpha)}, \\quad \\alpha\\gamma > 1',
    varianza:
      '\\operatorname{Var}(X) = \\theta^{2}\\,\\frac{\\Gamma\\!\\left(1 + \\frac{2}{\\gamma}\\right)\\Gamma\\!\\left(\\alpha - \\frac{2}{\\gamma}\\right)}{\\Gamma(\\alpha)} - \\big(E[X]\\big)^{2}, \\quad \\alpha\\gamma > 2',
  },
  extras: [
    {
      etiqueta: 'Momentos de orden k',
      tex: 'E[X^{k}] = \\theta^{k}\\,\\frac{\\Gamma\\!\\left(1 + \\frac{k}{\\gamma}\\right)\\Gamma\\!\\left(\\alpha - \\frac{k}{\\gamma}\\right)}{\\Gamma(\\alpha)}, \\quad -\\gamma < k < \\alpha\\gamma',
    },
    {
      etiqueta: 'Valor en riesgo (VaR)',
      tex: '\\operatorname{VaR}_p(X) = \\theta\\,\\big[(1 - p)^{-1/\\alpha} - 1\\big]^{1/\\gamma}',
    },
    {
      etiqueta: 'Moda',
      tex: '\\text{Moda}(X) = \\theta\\,\\left(\\frac{\\gamma - 1}{\\alpha\\gamma + 1}\\right)^{1/\\gamma}, \\quad \\gamma > 1',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Burr}(\\alpha,\\, \\gamma,\\, c\\theta), \\quad c > 0',
    },
    {
      letra: 'V',
      detalle: 'X = \\theta\\,\\big(U^{-1/\\alpha} - 1\\big)^{1/\\gamma}, \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'El índice de cola pesada depende del producto $\\alpha\\gamma$: sólo existen los momentos de orden $k < \\alpha\\gamma$.',
    'Con $\\gamma = 1$ se reduce a $\\text{Pareto}_{II}(\\alpha, \\theta)$, y con $\\alpha = 1$ a la distribución $\\text{LogLog}(\\gamma, \\theta)$.',
  ],
  superficie: { param: 'gamma', min: 1, max: 6 },
  calc: {
    densidad: (x, { alpha, gamma, theta }) => {
      if (x <= 0) return 0;
      const u = Math.pow(x / theta, gamma);
      return (alpha * gamma * Math.pow(x / theta, gamma - 1)) / (theta * Math.pow(1 + u, alpha + 1));
    },
    rango: ({ theta }) => [0, 10 * theta],
    media: ({ alpha, gamma, theta }) => {
      if (alpha * gamma <= 1) return Infinity;
      return theta * Math.exp(lgamma(1 + 1 / gamma) + lgamma(alpha - 1 / gamma) - lgamma(alpha));
    },
    varianza: ({ alpha, gamma, theta }) => {
      if (alpha * gamma <= 2) return Infinity;
      const m1 = theta * Math.exp(lgamma(1 + 1 / gamma) + lgamma(alpha - 1 / gamma) - lgamma(alpha));
      const m2 = theta * theta * Math.exp(lgamma(1 + 2 / gamma) + lgamma(alpha - 2 / gamma) - lgamma(alpha));
      return m2 - m1 * m1;
    },
  },
};
