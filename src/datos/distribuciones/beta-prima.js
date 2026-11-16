import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'beta-prima',
  nombre: 'Beta prima',
  tipo: 'continua',
  materia: 'probabilidad-avanzada',
  notacion: 'X \\sim \\text{Beta}^{\\prime}(\\alpha, \\beta)',
  descripcion:
    'También llamada distribución Beta de segunda especie o Pareto tipo VI estándar. Modela la razón de momios $Y / (1 - Y)$ de una variable $Y \\sim \\text{Beta}(\\alpha, \\beta)$ y el cociente $X_1 / X_2$ de dos variables Gamma independientes con la misma escala.',
  alias: ['beta de segunda especie', 'pareto tipo vi', 'pearson vi'],
  parametros: [
    { id: 'alpha', tex: '\\alpha', nombre: 'forma 1 (numerador)', restriccion: '\\alpha > 0', min: 0.5, max: 12, paso: 0.5, valor: 3 },
    { id: 'beta', tex: '\\beta', nombre: 'forma 2 (cola)', restriccion: '\\beta > 0', min: 1, max: 15, paso: 0.5, valor: 6 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{1}{\\operatorname{B}(\\alpha, \\beta)}\\,\\frac{x^{\\alpha - 1}}{(1 + x)^{\\alpha + \\beta}}',
    fda: 'F(x) = I_{\\frac{x}{1 + x}}(\\alpha, \\beta)',
    media: 'E[X] = \\frac{\\alpha}{\\beta - 1}, \\quad \\beta > 1',
    varianza:
      '\\operatorname{Var}(X) = \\frac{\\alpha(\\alpha + \\beta - 1)}{(\\beta - 2)(\\beta - 1)^{2}}, \\quad \\beta > 2',
  },
  extras: [
    {
      etiqueta: 'Momentos',
      tex: 'E[X^{k}] = \\frac{\\operatorname{B}(\\alpha + k,\\, \\beta - k)}{\\operatorname{B}(\\alpha, \\beta)}, \\quad -\\alpha < k < \\beta',
    },
    {
      etiqueta: 'Moda',
      tex: '\\text{Moda}(X) = \\frac{\\alpha - 1}{\\beta + 1}, \\quad \\alpha \\ge 1',
    },
  ],
  propiedades: [
    {
      letra: 'I',
      detalle: 'X \\sim \\text{Beta}^{\\prime}(\\alpha, \\beta) \\Rightarrow \\frac{1}{X} \\sim \\text{Beta}^{\\prime}(\\beta, \\alpha)',
    },
  ],
  notas: [
    'Con $\\alpha = 1$ se reduce a una $\\text{Pareto}_{II}(\\beta, 1)$ con escala unitaria.',
    'Si $X \\sim \\text{Beta}^{\\prime}(\\alpha, \\beta)$, entonces $\\frac{\\beta}{\\alpha}X \\sim F(2\\alpha, 2\\beta)$.',
  ],
  superficie: { param: 'alpha', min: 1, max: 10 },
  calc: {
    densidad: (x, { alpha, beta }) => {
      if (x <= 0) return alpha === 1 ? beta : 0;
      const lnB = lgamma(alpha) + lgamma(beta) - lgamma(alpha + beta);
      return Math.exp((alpha - 1) * Math.log(x) - (alpha + beta) * Math.log(1 + x) - lnB);
    },
    rango: () => [0, 25],
    media: ({ alpha, beta }) => (beta > 1 ? alpha / (beta - 1) : Infinity),
    varianza: ({ alpha, beta }) =>
      beta > 2 ? (alpha * (alpha + beta - 1)) / ((beta - 2) * (beta - 1) ** 2) : Infinity,
  },
};
