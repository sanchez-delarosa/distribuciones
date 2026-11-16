import { lcomb, lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'dirichlet-multinomial',
  nombre: 'Dirichlet-Multinomial',
  tipo: 'discreta',
  materia: 'bayesiana',
  notacion: '\\mathbf{X} \\sim \\text{DirMult}(n, \\boldsymbol{\\alpha})',
  descripcion:
    'Generalización multivariada de la distribución Beta-Binomial: modela el vector de conteos $\\mathbf{X} = (X_1, \\dots, X_k)$ cuando $\\mathbf{X} \\mid \\mathbf{p} \\sim \\text{Mult}(n, \\mathbf{p})$ y el vector de probabilidades tiene priori conjugada $\\mathbf{p} \\sim \\text{Dir}(\\alpha_1, \\dots, \\alpha_k)$. La gráfica muestra la distribución marginal $X_i \\sim \\text{BetaBin}(n, \\alpha_i, \\alpha_0 - \\alpha_i)$.',
  alias: ['multinomial compuesta', 'urna de polya multivariada'],
  parametros: [
    { id: 'n', tex: 'n', nombre: 'total de ensayos', restriccion: 'n \\in \\{1, 2, \\dots\\}', min: 1, max: 50, paso: 1, valor: 15 },
    { id: 'alpha', tex: '\\alpha_i', nombre: 'concentración de la categoría i', restriccion: '\\alpha_i > 0', min: 0.5, max: 12, paso: 0.5, valor: 3 },
    { id: 'resto', tex: '\\alpha_0 - \\alpha_i', nombre: 'concentración del resto', restriccion: '\\alpha_0 = \\sum_{j=1}^k \\alpha_j > \\alpha_i', min: 0.5, max: 15, paso: 0.5, valor: 6 },
  ],
  soporte: 'x_i \\in \\{0, 1, \\dots, n\\}, \\quad \\sum_{i=1}^{k} x_i = n',
  formulas: {
    densidad:
      'P(X_1 = x_1, \\dots, X_k = x_k) = \\frac{n!\\,\\Gamma(\\alpha_0)}{\\Gamma(n + \\alpha_0)}\\,\\prod_{i=1}^{k} \\frac{\\Gamma(x_i + \\alpha_i)}{x_i!\\,\\Gamma(\\alpha_i)}, \\quad \\alpha_0 = \\sum_{i=1}^{k} \\alpha_i',
    media: 'E[X_i] = n\\,\\frac{\\alpha_i}{\\alpha_0}',
    varianza:
      '\\operatorname{Var}(X_i) = n\\,\\frac{\\alpha_i(\\alpha_0 - \\alpha_i)(\\alpha_0 + n)}{\\alpha_0^{2}(\\alpha_0 + 1)}',
  },
  extras: [
    {
      etiqueta: 'Covarianza entre categorías',
      tex: '\\operatorname{Cov}(X_i, X_j) = -n\\,\\frac{\\alpha_i\\,\\alpha_j\\,(\\alpha_0 + n)}{\\alpha_0^{2}(\\alpha_0 + 1)}, \\quad i \\ne j',
    },
    {
      etiqueta: 'Actualización bayesiana y credibilidad multivariada',
      tex: '\\mathbf{p} \\mid \\mathbf{X} = \\mathbf{x} \\sim \\text{Dir}(\\boldsymbol{\\alpha} + \\mathbf{x}), \\qquad E[p_i \\mid \\mathbf{x}] = \\frac{n}{n + \\alpha_0}\\frac{x_i}{n} + \\frac{\\alpha_0}{n + \\alpha_0}\\frac{\\alpha_i}{\\alpha_0}',
    },
  ],
  propiedades: [],
  notas: [
    'Cada componente marginal $X_i$ sigue exactamente una $\\text{BetaBin}(n,\\, \\alpha_i,\\, \\alpha_0 - \\alpha_i)$.',
    'En seguros de automóviles (sistemas Bonus-Malus o clasificación en $k$ niveles de severidad), permite estimar simultáneamente las probabilidades de transición o clasificación con credibilidad exacta.',
  ],
  superficie: { param: 'alpha', min: 0.5, max: 10 },
  calc: {
    densidad: (x, { n, alpha, resto }) => {
      if (!Number.isInteger(x) || x < 0 || x > n) return 0;
      const lnB1 = lgamma(x + alpha) + lgamma(n - x + resto) - lgamma(n + alpha + resto);
      const lnB0 = lgamma(alpha) + lgamma(resto) - lgamma(alpha + resto);
      return Math.exp(lcomb(n, x) + lnB1 - lnB0);
    },
    rango: ({ n }) => [0, n],
    media: ({ n, alpha, resto }) => (n * alpha) / (alpha + resto),
    varianza: ({ n, alpha, resto }) => {
      const a0 = alpha + resto;
      return (n * alpha * resto * (a0 + n)) / (a0 * a0 * (a0 + 1));
    },
  },
};
