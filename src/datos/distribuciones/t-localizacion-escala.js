import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 't-localizacion-escala',
  nombre: 't de localización-escala',
  tipo: 'continua',
  materia: 'bayesiana',
  notacion: 'X \\sim t_{\\nu}(\\mu, \\sigma^{2})',
  descripcion:
    'Generalización afín $X = \\mu + \\sigma T$ de la distribución $t(\\nu)$ de Student. En estadística bayesiana es la **distribución posterior marginal** de la media $\\mu \\mid \\mathbf{x}$ y la **distribución predictiva posterior** de una futura observación $\\tilde{X} \\mid \\mathbf{x}$ en un modelo normal con media y varianza desconocidas.',
  alias: ['t predictiva', 'student localizacion escala'],
  parametros: [
    { id: 'nu', tex: '\\nu', nombre: 'grados de libertad', restriccion: '\\nu > 0', min: 1, max: 35, paso: 1, valor: 8 },
    { id: 'mu', tex: '\\mu', nombre: 'localización (media)', restriccion: '\\mu \\in \\mathbb{R}', min: -5, max: 5, paso: 0.25, valor: 1 },
    { id: 'sigma', tex: '\\sigma', nombre: 'escala', restriccion: '\\sigma > 0', min: 0.25, max: 4, paso: 0.25, valor: 1.5 },
  ],
  soporte: 'x \\in (-\\infty, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{\\Gamma\\!\\left(\\frac{\\nu + 1}{2}\\right)}{\\sigma\\sqrt{\\nu\\pi}\\;\\Gamma\\!\\left(\\frac{\\nu}{2}\\right)}\\left[1 + \\frac{1}{\\nu}\\left(\\frac{x - \\mu}{\\sigma}\\right)^{2}\\right]^{-(\\nu + 1)/2}',
    media: 'E[X] = \\mu, \\quad \\nu > 1',
    varianza: '\\operatorname{Var}(X) = \\sigma^{2}\\,\\frac{\\nu}{\\nu - 2}, \\quad \\nu > 2',
  },
  extras: [
    {
      etiqueta: 'Distribución posterior de μ (priori de Jeffreys)',
      tex: '\\mu \\mid \\mathbf{x} \\sim t_{n - 1}\\!\\left(\\bar{x},\\; \\frac{s^{2}}{n}\\right)',
    },
    {
      etiqueta: 'Distribución predictiva de una nueva reclamación X̃',
      tex: '\\tilde{X} \\mid \\mathbf{x} \\sim t_{n - 1}\\!\\left(\\bar{x},\\; s^{2}\\Big(1 + \\frac{1}{n}\\Big)\\right)',
    },
    {
      etiqueta: 'Mezcla Normal–Chi-cuadrada inversa escalada',
      tex: 'X \\mid V \\sim N(\\mu, V),\\; V \\sim \\text{Inv-}\\chi^{2}(\\nu, \\sigma^{2}) \\implies X \\sim t_{\\nu}(\\mu, \\sigma^{2})',
    },
  ],
  propiedades: [
    {
      letra: 'L',
      detalle: 'aX + b \\sim t_{\\nu}(a\\mu + b,\\, a^{2}\\sigma^{2})',
    },
    {
      letra: 'S',
      detalle: 'cX \\sim t_{\\nu}(c\\mu,\\, c^{2}\\sigma^{2}), \\quad c > 0',
    },
  ],
  notas: [
    'La varianza predictiva $\\operatorname{Var}(\\tilde{X} \\mid \\mathbf{x})$ incorpora tanto la incertidumbre aleatoria del proceso ($1$) como la incertidumbre de estimación del parámetro ($1/n$) y el factor $\\frac{\\nu}{\\nu - 2}$ por desconocer $\\sigma^2$.',
  ],
  superficie: { param: 'nu', min: 2, max: 25 },
  calc: {
    densidad: (x, { nu, mu, sigma }) => {
      const z = (x - mu) / sigma;
      const lnC = lgamma((nu + 1) / 2) - Math.log(sigma) - 0.5 * Math.log(nu * Math.PI) - lgamma(nu / 2);
      return Math.exp(lnC - ((nu + 1) / 2) * Math.log(1 + (z * z) / nu));
    },
    rango: ({ mu, sigma }) => [mu - 24 * sigma, mu + 24 * sigma],
    rangoGrafica: ({ mu, sigma }) => [mu - 6 * sigma, mu + 6 * sigma],
    media: ({ nu, mu }) => (nu > 1 ? mu : NaN),
    varianza: ({ nu, sigma }) => (nu > 2 ? (sigma * sigma * nu) / (nu - 2) : nu > 1 ? Infinity : NaN),
  },
};
