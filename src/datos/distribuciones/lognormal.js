import { fiNormal } from '../../mate/especiales.js';

const media = ({ mu, sigma2 }) => Math.exp(mu + 0.5 * sigma2);
const varianza = ({ mu, sigma2 }) => Math.exp(2 * mu + sigma2) * (Math.exp(sigma2) - 1);

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'lognormal',
  nombre: 'Lognormal',
  tipo: 'continua',
  notacion: 'X \\sim \\text{Lognormal}(\\mu, \\sigma^{2})',
  descripcion:
    'Variable positiva cuyo logaritmo natural sigue una distribución normal $N(\\mu, \\sigma^2)$. Es asimétrica a la derecha y se usa para modelar montos de reclamaciones y precios de activos.',
  alias: ['log-normal', 'galton'],
  parametros: [
    { id: 'mu', tex: '\\mu', nombre: 'media del logaritmo', restriccion: '\\mu \\in \\mathbb{R}', min: -2, max: 2, paso: 0.1, valor: 0.2 },
    { id: 'sigma2', tex: '\\sigma^{2}', nombre: 'varianza del logaritmo', restriccion: '\\sigma^{2} > 0', min: 0.05, max: 1.5, paso: 0.05, valor: 0.25 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad: 'f(x) = \\frac{1}{x\\sigma\\sqrt{2\\pi}} \\exp\\!\\left(-\\frac{(\\ln x - \\mu)^{2}}{2\\sigma^{2}}\\right)',
    fda: 'F(x) = \\Phi\\!\\left(\\frac{\\ln x - \\mu}{\\sigma}\\right)',
    media: 'E[X] = e^{\\mu + \\sigma^{2}/2}',
    varianza: '\\operatorname{Var}(X) = e^{2\\mu + \\sigma^{2}}\\big(e^{\\sigma^{2}} - 1\\big)',
  },
  extras: [
    { etiqueta: 'Momentos', tex: 'E[X^{k}] = \\exp\\!\\left(k\\mu + \\frac{k^{2}\\sigma^{2}}{2}\\right)' },
    { etiqueta: 'Mediana y moda', tex: '\\text{Mediana}(X) = e^{\\mu}, \\quad \\text{Moda}(X) = e^{\\mu - \\sigma^{2}}' },
    { etiqueta: 'Valor en riesgo', tex: '\\operatorname{VaR}_{\\alpha}(X) = \\exp(\\mu + \\sigma z_{\\alpha}), \\quad z_{\\alpha} = \\Phi^{-1}(\\alpha)' },
    { etiqueta: 'TVaR', tex: '\\operatorname{TVaR}_{\\alpha}(X) = \\frac{e^{\\mu + \\sigma^{2}/2}}{1 - \\alpha}\\,\\Phi(\\sigma - z_{\\alpha})' },
    {
      etiqueta: 'Esperanza limitada',
      tex: 'E[X \\wedge d] = e^{\\mu + \\sigma^{2}/2}\\,\\Phi\\!\\left(\\frac{\\ln d - \\mu - \\sigma^{2}}{\\sigma}\\right) + d\\,\\left[1 - \\Phi\\!\\left(\\frac{\\ln d - \\mu}{\\sigma}\\right)\\right]',
    },
  ],
  propiedades: [
    { letra: 'P', detalle: 'X_i \\sim \\text{Lognormal}(\\mu_i, \\sigma_i^{2}) \\Rightarrow \\prod_i X_i \\sim \\text{Lognormal}\\Big(\\sum_i \\mu_i,\\, \\sum_i \\sigma_i^{2}\\Big)' },
    { letra: 'S', detalle: 'cX \\sim \\text{Lognormal}(\\mu + \\ln c,\\, \\sigma^{2}), \\quad c > 0' },
    { letra: 'I', detalle: '1/X \\sim \\text{Lognormal}(-\\mu,\\, \\sigma^{2})' },
    { letra: 'V', detalle: 'X = e^{\\mu + \\sigma Z}, \\quad Z \\sim N(0, 1)' },
  ],
  notas: [
    'Los parámetros $\\mu$ y $\\sigma^2$ son la media y la varianza de $\\ln X$, no de $X$.',
    'Aunque todos sus momentos $E[X^k]$ son finitos, su función generadora de momentos $M_X(t)$ diverge para todo $t > 0$.',
  ],
  superficie: { param: 'sigma2', min: 0.1, max: 1.0 },
  calc: {
    densidad: (x, { mu, sigma2 }) => {
      if (x <= 0) return 0;
      const s = Math.sqrt(sigma2);
      return fiNormal((Math.log(x) - mu) / s) / (x * s);
    },
    rango: ({ mu, sigma2 }) => [0, Math.exp(mu + 6.5 * Math.sqrt(sigma2))],
    media,
    varianza,
  },
};
