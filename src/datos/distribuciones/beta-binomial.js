import { lcomb, lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'beta-binomial',
  nombre: 'Beta-Binomial',
  tipo: 'discreta',
  materia: 'bayesiana',
  notacion: 'X \\sim \\text{BetaBin}(n, \\alpha, \\beta)',
  descripcion:
    'Distribución predictiva y marginal que surge al combinar una verosimilitud binomial $X \\mid p \\sim \\text{Bin}(n, p)$ con una distribución a priori conjugada $p \\sim \\text{Beta}(\\alpha, \\beta)$ para la probabilidad de siniestro. En teoría de la credibilidad produce el estimador lineal exacto con peso $Z = \\frac{n}{n + \\alpha + \\beta}$.',
  alias: ['polya-eggenberger', 'binomial compuesta'],
  parametros: [
    { id: 'n', tex: 'n', nombre: 'número de ensayos o pólizas', restriccion: 'n \\in \\{1, 2, \\dots\\}', min: 1, max: 50, paso: 1, valor: 15 },
    { id: 'alpha', tex: '\\alpha', nombre: 'éxitos a priori', restriccion: '\\alpha > 0', min: 0.5, max: 15, paso: 0.5, valor: 2.5 },
    { id: 'beta', tex: '\\beta', nombre: 'fracasos a priori', restriccion: '\\beta > 0', min: 0.5, max: 15, paso: 0.5, valor: 5 },
  ],
  soporte: 'x \\in \\{0, 1, \\dots, n\\}',
  formulas: {
    densidad:
      'P(X = x) = \\binom{n}{x}\\,\\frac{\\operatorname{B}(x + \\alpha,\\, n - x + \\beta)}{\\operatorname{B}(\\alpha, \\beta)}',
    media: 'E[X] = n\\,\\frac{\\alpha}{\\alpha + \\beta}',
    varianza:
      '\\operatorname{Var}(X) = n\\,\\frac{\\alpha\\beta(\\alpha + \\beta + n)}{(\\alpha + \\beta)^{2}(\\alpha + \\beta + 1)}',
  },
  extras: [
    {
      etiqueta: 'Actualización bayesiana conjugada',
      tex: 'p \\sim \\text{Beta}(\\alpha, \\beta),\\; X \\mid p \\sim \\text{Bin}(n, p) \\implies p \\mid X = x \\sim \\text{Beta}(\\alpha + x,\\, \\beta + n - x)',
    },
    {
      etiqueta: 'Prima de credibilidad exacta (Jewell / Bühlmann)',
      tex: 'E[p \\mid X = x] = Z\\,\\frac{x}{n} + (1 - Z)\\,\\frac{\\alpha}{\\alpha + \\beta}, \\qquad Z = \\frac{n}{n + \\alpha + \\beta}',
    },
    {
      etiqueta: 'Factor de sobredispersión frente a la binomial',
      tex: '\\frac{\\operatorname{Var}(X)}{n\\,\\mu_p(1 - \\mu_p)} = 1 + \\frac{n - 1}{\\alpha + \\beta + 1}',
    },
  ],
  propiedades: [],
  notas: [
    'También se interpreta mediante el esquema de **urna de Pólya** con contagio positivo: cada vez que se extrae una bola de un color, se devuelve junto con otra bola adicional del mismo color.',
    'Con $\\alpha = 1$ y $\\beta = 1$ (priori uniforme en $(0, 1)$), todos los conteos $x \\in \\{0, 1, \\dots, n\\}$ resultan equiprobables: $\\text{BetaBin}(n, 1, 1) = \\text{Unif}_D(0, n)$ (regla de sucesión de Laplace).',
  ],
  superficie: { param: 'alpha', min: 0.5, max: 10 },
  calc: {
    densidad: (x, { n, alpha, beta }) => {
      if (!Number.isInteger(x) || x < 0 || x > n) return 0;
      const lnB1 = lgamma(x + alpha) + lgamma(n - x + beta) - lgamma(n + alpha + beta);
      const lnB0 = lgamma(alpha) + lgamma(beta) - lgamma(alpha + beta);
      return Math.exp(lcomb(n, x) + lnB1 - lnB0);
    },
    rango: ({ n }) => [0, n],
    media: ({ n, alpha, beta }) => (n * alpha) / (alpha + beta),
    varianza: ({ n, alpha, beta }) =>
      (n * alpha * beta * (alpha + beta + n)) / ((alpha + beta) ** 2 * (alpha + beta + 1)),
  },
};
