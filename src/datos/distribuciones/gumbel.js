const GAMMA_EULER = 0.5772156649015329;

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'gumbel',
  nombre: 'Gumbel',
  tipo: 'continua',
  materia: 'procesos-estocasticos',
  notacion: 'X \\sim \\text{Gumbel}(\\mu, \\beta)',
  descripcion:
    'Distribución de valor extremo tipo I: límite universal del máximo $\\max_{1 \\le i \\le n} X_i$ (debidamente centrado) de variables independientes con colas exponenciales o gaussianas (Exponencial, Gamma, Normal, Lognormal, Weibull). Modela máximos históricos de reclamaciones, temperaturas, caudales y longevidad.',
  alias: ['valor extremo tipo i', 'doble exponencial extrema', 'fisher-tippett'],
  parametros: [
    { id: 'mu', tex: '\\mu', nombre: 'localización (moda)', restriccion: '\\mu \\in \\mathbb{R}', min: -5, max: 5, paso: 0.25, valor: 0 },
    { id: 'beta', tex: '\\beta', nombre: 'escala', restriccion: '\\beta > 0', min: 0.25, max: 4, paso: 0.25, valor: 1 },
  ],
  soporte: 'x \\in (-\\infty, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{1}{\\beta}\\,\\exp\\!\\left[-\\left(z + e^{-z}\\right)\\right], \\quad z = \\frac{x - \\mu}{\\beta}',
    fda: 'F(x) = \\exp\\!\\left(-e^{-(x - \\mu)/\\beta}\\right)',
    supervivencia: 'S(x) = 1 - \\exp\\!\\left(-e^{-(x - \\mu)/\\beta}\\right)',
    media: 'E[X] = \\mu + \\beta\\,\\gamma \\approx \\mu + 0.5772\\,\\beta \\quad (\\gamma \\text{ de Euler–Mascheroni})',
    varianza: '\\operatorname{Var}(X) = \\frac{\\pi^{2}}{6}\\,\\beta^{2} \\approx 1.6449\\,\\beta^{2}',
    fgm: 'M_X(t) = e^{\\mu t}\\,\\Gamma(1 - \\beta t), \\quad t < \\frac{1}{\\beta}',
  },
  extras: [
    {
      etiqueta: 'Cuantiles (VaR)',
      tex: '\\operatorname{VaR}_p(X) = \\mu - \\beta\\,\\ln(-\\ln p)',
    },
    {
      etiqueta: 'Moda y mediana',
      tex: '\\text{Moda}(X) = \\mu, \\qquad \\text{Med}(X) = \\mu - \\beta\\,\\ln(\\ln 2)',
    },
    {
      etiqueta: 'Diferencia de dos Gumbel independientes',
      tex: 'X_1, X_2 \\perp \\text{Gumbel}(\\mu, \\beta) \\implies X_1 - X_2 \\sim \\text{Logística}(0, \\beta)',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX + d \\sim \\text{Gumbel}(c\\mu + d,\\, c\\beta), \\quad c > 0',
    },
    {
      letra: 'X',
      detalle: 'X_1, \\dots, X_n \\perp \\text{Gumbel}(\\mu, \\beta) \\Rightarrow \\max_{i \\le n} X_i \\sim \\text{Gumbel}(\\mu + \\beta\\ln n,\\, \\beta)',
    },
    {
      letra: 'V',
      detalle: 'X = \\mu - \\beta\\,\\ln(-\\ln U), \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Si $T \\sim \\text{Exp}(1)$, entonces $-\\ln T \\sim \\text{Gumbel}(0, 1)$.',
    'Su asimetría ($\\gamma_1 \\approx 1.1395$) y su exceso de curtosis ($\\gamma_2 = 12/5 = 2.4$) son constantes independientes de $\\mu$ y $\\beta$.',
  ],
  superficie: { param: 'beta', min: 0.5, max: 3 },
  calc: {
    densidad: (x, { mu, beta }) => {
      const z = (x - mu) / beta;
      if (z < -15) return 0;
      return Math.exp(-(z + Math.exp(-z))) / beta;
    },
    rango: ({ mu, beta }) => [mu - 8 * beta, mu + 18 * beta],
    media: ({ mu, beta }) => mu + beta * GAMMA_EULER,
    varianza: ({ beta }) => (Math.PI * Math.PI * beta * beta) / 6,
  },
};
