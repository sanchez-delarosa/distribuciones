import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'beta-binomial-negativa',
  nombre: 'Beta-Binomial negativa',
  tipo: 'discreta',
  materia: 'bayesiana',
  notacion: 'X \\sim \\text{BetaBN}(r, \\alpha, \\beta)',
  descripcion:
    'También llamada distribución de Waring generalizada: surge como la distribución marginal/predictiva cuando $X \\mid p \\sim \\text{BN}_F(r, p)$ y la probabilidad $p$ sigue una distribución conjugada $\\text{Beta}(\\alpha, \\beta)$. Posee cola derecha discreta de ley de potencias ($P(X = k) \\propto k^{-\\alpha - 1}$), ideal para frecuencias de siniestros con alta heterogeneidad.',
  alias: ['waring', 'yule', 'beta-geometrica'],
  parametros: [
    { id: 'r', tex: 'r', nombre: 'éxitos o dispersión base', restriccion: 'r > 0', min: 1, max: 12, paso: 0.5, valor: 3 },
    { id: 'alpha', tex: '\\alpha', nombre: 'forma de cola (Beta)', restriccion: '\\alpha > 0', min: 1, max: 15, paso: 0.5, valor: 8 },
    { id: 'beta', tex: '\\beta', nombre: 'forma 2 (Beta)', restriccion: '\\beta > 0', min: 0.5, max: 12, paso: 0.5, valor: 2 },
  ],
  soporte: 'x \\in \\{0, 1, 2, \\dots\\}',
  formulas: {
    densidad:
      'P(X = k) = \\frac{\\Gamma(r + k)}{k!\\,\\Gamma(r)}\\,\\frac{\\operatorname{B}(\\alpha + r,\\, \\beta + k)}{\\operatorname{B}(\\alpha, \\beta)}, \\quad k = 0, 1, 2, \\dots',
    media: 'E[X] = \\frac{r\\,\\beta}{\\alpha - 1}, \\quad \\alpha > 1',
    varianza:
      '\\operatorname{Var}(X) = \\frac{r\\,\\beta\\,(r + \\alpha - 1)(\\alpha + \\beta - 1)}{(\\alpha - 1)^{2}(\\alpha - 2)}, \\quad \\alpha > 2',
  },
  extras: [
    {
      etiqueta: 'Actualización bayesiana conjugada',
      tex: 'p \\sim \\text{Beta}(\\alpha, \\beta),\\; X \\mid p \\sim \\text{BN}_F(r, p) \\implies p \\mid X = k \\sim \\text{Beta}(\\alpha + r,\\, \\beta + k)',
    },
    {
      etiqueta: 'Caso Beta-Geométrica (r = 1)',
      tex: 'P(X = k) = \\frac{\\alpha\\,\\operatorname{B}(\\alpha + 1,\\, \\beta + k)}{\\operatorname{B}(\\alpha, \\beta)}, \\quad E[X] = \\frac{\\beta}{\\alpha - 1}',
    },
  ],
  propiedades: [],
  notas: [
    'Sólo existen los momentos finitos de orden $m < \\alpha$: es el análogo discreto directo de las distribuciones Pareto II y Beta prima.',
    'También se obtiene como mezcla Poisson–Beta prima (cuando la tasa $\\Lambda$ de una Poisson sigue una distribución $\\text{Beta}^{\\prime}(r, \\alpha)$ escalada).',
  ],
  superficie: { param: 'alpha', min: 3, max: 14 },
  calc: {
    densidad: (k, { r, alpha, beta }) => {
      if (!Number.isInteger(k) || k < 0) return 0;
      const lnC = lgamma(r + k) - lgamma(k + 1) - lgamma(r);
      const lnB1 = lgamma(alpha + r) + lgamma(beta + k) - lgamma(alpha + beta + r + k);
      const lnB0 = lgamma(alpha) + lgamma(beta) - lgamma(alpha + beta);
      return Math.exp(lnC + lnB1 - lnB0);
    },
    rango: () => [0, 120],
    media: ({ r, alpha, beta }) => (alpha > 1 ? (r * beta) / (alpha - 1) : Infinity),
    varianza: ({ r, alpha, beta }) =>
      alpha > 2
        ? (r * beta * (r + alpha - 1) * (alpha + beta - 1)) / ((alpha - 1) ** 2 * (alpha - 2))
        : Infinity,
  },
};
