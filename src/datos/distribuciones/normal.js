import { fiNormal } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'normal',
  nombre: 'Normal',
  tipo: 'continua',
  notacion: 'X \\sim N(\\mu, \\sigma^{2})',
  descripcion:
    'Distribución simétrica en forma de campana, centrada en $\\mu$ y con dispersión $\\sigma$. Aparece como límite de sumas de muchas variables independientes (teorema del límite central).',
  alias: ['gaussiana', 'gauss'],
  parametros: [
    { id: 'mu', tex: '\\mu', nombre: 'media', restriccion: '\\mu \\in \\mathbb{R}', min: -5, max: 5, paso: 0.1, valor: 1 },
    { id: 'sigma2', tex: '\\sigma^{2}', nombre: 'varianza', restriccion: '\\sigma^{2} > 0', min: 0.1, max: 9, paso: 0.05, valor: 2 },
  ],
  soporte: 'x \\in \\mathbb{R}',
  formulas: {
    densidad: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(x-\\mu)^{2}}{2\\sigma^{2}}\\right)',
    fda: 'F(x) = \\Phi\\left(\\frac{x-\\mu}{\\sigma}\\right)',
    media: 'E[X] = \\mu',
    varianza: '\\operatorname{Var}(X) = \\sigma^{2}',
    fgm: 'M_X(t) = \\exp\\left(\\mu t + \\frac{\\sigma^{2} t^{2}}{2}\\right)',
  },
  extras: [
    { etiqueta: 'Valor en riesgo', tex: '\\operatorname{VaR}_{\\alpha}(X) = \\mu + \\sigma z_{\\alpha}, \\quad z_{\\alpha} = \\Phi^{-1}(\\alpha)' },
    { etiqueta: 'TVaR', tex: '\\operatorname{TVaR}_{\\alpha}(X) = \\mu + \\sigma \\frac{\\phi(z_{\\alpha})}{1 - \\alpha}' },
    {
      etiqueta: 'Esperanza limitada',
      tex: 'E[X \\wedge d] = \\mu\\,\\Phi(z_d) - \\sigma\\,\\phi(z_d) + d\\,\\big(1 - \\Phi(z_d)\\big), \\quad z_d = \\frac{d - \\mu}{\\sigma}',
    },
  ],
  propiedades: [
    { letra: 'C', detalle: 'X_i \\sim N(\\mu_i, \\sigma_i^{2}) \\Rightarrow \\sum_i X_i \\sim N\\Big(\\sum_i \\mu_i,\\, \\sum_i \\sigma_i^{2}\\Big)' },
    { letra: 'L', detalle: 'b + \\sum_i a_i X_i \\sim N\\Big(b + \\sum_i a_i \\mu_i,\\, \\sum_i a_i^{2} \\sigma_i^{2}\\Big)' },
    { letra: 'S', detalle: 'cX \\sim N(c\\mu,\\, c^{2}\\sigma^{2})' },
  ],
  notas: [
    'Aquí el segundo parámetro es la varianza $\\sigma^2$, no la desviación estándar. Revisa qué convención usa cada libro o software.',
  ],
  superficie: { param: 'sigma2', min: 0.25, max: 4 },
  calc: {
    densidad: (x, { mu, sigma2 }) => fiNormal((x - mu) / Math.sqrt(sigma2)) / Math.sqrt(sigma2),
    rango: ({ mu, sigma2 }) => [mu - 10 * Math.sqrt(sigma2), mu + 10 * Math.sqrt(sigma2)],
    media: ({ mu }) => mu,
    varianza: ({ sigma2 }) => sigma2,
  },
};
