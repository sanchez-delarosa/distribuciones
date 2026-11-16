import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'beta',
  nombre: 'Beta',
  tipo: 'continua',
  notacion: 'X \\sim \\text{Beta}(\\alpha, \\beta)',
  descripcion:
    'Familia continua de soporte acotado $(0, 1)$ con dos parámetros de forma $\\alpha$ y $\\beta$. En actuaría modela proporciones de siniestralidad, tasas de recuperación o severidad relativa (*LGD*) y distribuciones a priori conjugadas para probabilidades de siniestro.',
  alias: ['arcoseno', 'beta estandar'],
  parametros: [
    { id: 'alpha', tex: '\\alpha', nombre: 'forma 1', restriccion: '\\alpha > 0', min: 0.5, max: 10, paso: 0.25, valor: 2 },
    { id: 'beta', tex: '\\beta', nombre: 'forma 2', restriccion: '\\beta > 0', min: 0.5, max: 10, paso: 0.25, valor: 5 },
  ],
  soporte: 'x \\in (0, 1)',
  formulas: {
    densidad:
      'f(x) = \\frac{1}{\\operatorname{B}(\\alpha, \\beta)}\\, x^{\\alpha - 1}(1 - x)^{\\beta - 1}, \\quad \\operatorname{B}(\\alpha, \\beta) = \\frac{\\Gamma(\\alpha)\\Gamma(\\beta)}{\\Gamma(\\alpha + \\beta)}',
    fda: 'F(x) = I_x(\\alpha, \\beta) = \\frac{\\operatorname{B}(x;\\, \\alpha, \\beta)}{\\operatorname{B}(\\alpha, \\beta)} = \\int_{0}^{x} \\frac{t^{\\alpha - 1}(1 - t)^{\\beta - 1}}{\\operatorname{B}(\\alpha, \\beta)}\\, dt',
    media: 'E[X] = \\frac{\\alpha}{\\alpha + \\beta}',
    varianza: '\\operatorname{Var}(X) = \\frac{\\alpha\\beta}{(\\alpha + \\beta)^{2}(\\alpha + \\beta + 1)}',
    fgm: 'M_X(t) = 1 + \\sum_{k=1}^{\\infty} \\left(\\prod_{r=0}^{k-1} \\frac{\\alpha + r}{\\alpha + \\beta + r}\\right) \\frac{t^{k}}{k!}',
  },
  extras: [
    {
      etiqueta: 'Momentos',
      tex: 'E[X^{k}] = \\frac{\\operatorname{B}(\\alpha + k, \\beta)}{\\operatorname{B}(\\alpha, \\beta)} = \\prod_{r=0}^{k-1} \\frac{\\alpha + r}{\\alpha + \\beta + r}',
    },
    {
      etiqueta: 'Moda',
      tex: '\\text{Moda}(X) = \\frac{\\alpha - 1}{\\alpha + \\beta - 2}, \\quad \\alpha > 1,\\ \\beta > 1',
    },
    {
      etiqueta: 'Simetría por reflexión',
      tex: '1 - X \\sim \\text{Beta}(\\beta, \\alpha)',
    },
    {
      etiqueta: 'Dualidad con la binomial',
      tex: 'P\\big(\\text{Bin}(n, p) \\ge k\\big) = I_p(k,\\, n - k + 1) = P\\big(\\text{Beta}(k,\\, n - k + 1) \\le p\\big)',
    },
  ],
  propiedades: [],
  notas: [
    'Es la distribución conjugada natural de las familias Bernoulli, binomial, geométrica y binomial negativa: con priori $p \\sim \\text{Beta}(\\alpha, \\beta)$ y $x$ éxitos en $n$ ensayos, la posteriori es $p \\mid x \\sim \\text{Beta}(\\alpha + x,\\, \\beta + n - x)$ y la media predictiva $E[p \\mid x]$ es una combinación de credibilidad exacta.',
    'Según sus parámetros adopta formas muy distintas: uniforme ($\\alpha = \\beta = 1$), en forma de U ($\\alpha < 1, \\beta < 1$; con $\\alpha = \\beta = 1/2$ es la distribución arcoseno), unimodal sesgada o simétrica ($\\alpha, \\beta > 1$) y de potencia ($\\alpha = 1$ o $\\beta = 1$).',
  ],
  superficie: { param: 'alpha', min: 1, max: 8 },
  calc: {
    densidad: (x, { alpha, beta }) => {
      if (x <= 0) return alpha === 1 ? beta : 0;
      if (x >= 1) return beta === 1 ? alpha : 0;
      const lnB = lgamma(alpha) + lgamma(beta) - lgamma(alpha + beta);
      return Math.exp((alpha - 1) * Math.log(x) + (beta - 1) * Math.log(1 - x) - lnB);
    },
    rango: () => [0, 1],
    media: ({ alpha, beta }) => alpha / (alpha + beta),
    varianza: ({ alpha, beta }) => (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1)),
  },
};
