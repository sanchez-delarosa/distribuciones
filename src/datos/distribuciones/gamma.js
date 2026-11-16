import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'gamma',
  nombre: 'Gamma',
  tipo: 'continua',
  notacion: 'X \\sim \\text{Gamma}(\\alpha, \\lambda)',
  descripcion:
    'Familia continua en $(0, \\infty)$ con parámetro de forma $\\alpha$ y de tasa $\\lambda$. Cuando $\\alpha$ es entero (distribución de Erlang), mide el tiempo hasta el $\\alpha$-ésimo evento de un proceso de Poisson.',
  alias: ['erlang'],
  parametros: [
    { id: 'alpha', tex: '\\alpha', nombre: 'forma', restriccion: '\\alpha > 0', min: 0.5, max: 15, paso: 0.25, valor: 2.5 },
    { id: 'lambda', tex: '\\lambda', nombre: 'tasa', restriccion: '\\lambda > 0', min: 0.2, max: 5, paso: 0.1, valor: 1 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad: 'f(x) = \\frac{\\lambda^{\\alpha}}{\\Gamma(\\alpha)}\\, x^{\\alpha - 1} e^{-\\lambda x}',
    fda: 'F(x) = \\frac{\\gamma(\\alpha, \\lambda x)}{\\Gamma(\\alpha)} = \\int_{0}^{x} \\frac{\\lambda^{\\alpha}}{\\Gamma(\\alpha)}\\, t^{\\alpha - 1} e^{-\\lambda t}\\, dt',
    media: 'E[X] = \\frac{\\alpha}{\\lambda}',
    varianza: '\\operatorname{Var}(X) = \\frac{\\alpha}{\\lambda^{2}}',
    fgm: 'M_X(t) = \\left(\\frac{\\lambda}{\\lambda - t}\\right)^{\\alpha}, \\quad t < \\lambda',
  },
  extras: [
    { etiqueta: 'Momentos', tex: 'E[X^{k}] = \\frac{\\Gamma(\\alpha + k)}{\\Gamma(\\alpha)\\,\\lambda^{k}} = \\frac{\\alpha(\\alpha + 1)\\cdots(\\alpha + k - 1)}{\\lambda^{k}}' },
    { etiqueta: 'Moda', tex: '\\text{Moda}(X) = \\frac{\\alpha - 1}{\\lambda}, \\quad \\alpha \\ge 1' },
  ],
  propiedades: [
    { letra: 'C', detalle: 'X_i \\sim \\text{Gamma}(\\alpha_i, \\lambda) \\Rightarrow \\sum_i X_i \\sim \\text{Gamma}\\Big(\\sum_i \\alpha_i,\\, \\lambda\\Big)' },
    { letra: 'S', detalle: 'cX \\sim \\text{Gamma}(\\alpha,\\, \\lambda / c), \\quad c > 0' },
  ],
  notas: [
    'La suma conserva la familia solo si todas las variables tienen la misma tasa $\\lambda$.',
    'En *Loss Models* se parametriza con la escala $\\theta = 1/\\lambda$, de modo que $E[X] = \\alpha\\theta$ y $\\operatorname{Var}(X) = \\alpha\\theta^2$.',
  ],
  superficie: { param: 'alpha', min: 1, max: 10 },
  calc: {
    densidad: (x, { alpha, lambda }) =>
      x <= 0 ? 0 : Math.exp(alpha * Math.log(lambda) - lgamma(alpha) + (alpha - 1) * Math.log(x) - lambda * x),
    rango: ({ alpha, lambda }) => [0, (alpha + 12 * Math.sqrt(alpha) + 12) / lambda],
    media: ({ alpha, lambda }) => alpha / lambda,
    varianza: ({ alpha, lambda }) => alpha / (lambda * lambda),
  },
};
