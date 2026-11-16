import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 't-no-central',
  nombre: 't no central',
  tipo: 'continua',
  materia: 'inferencia',
  notacion: 'X \\sim t(\\nu, \\delta)',
  descripcion:
    'Distribución del cociente $\\frac{Z + \\delta}{\\sqrt{V/\\nu}}$ donde $Z \\sim N(0, 1)$ y $V \\sim \\chi^2(\\nu)$ son independientes y $\\delta \\in \\mathbb{R}$ es el parámetro de no centralidad. Determina la distribución exacta del estadístico $t$ bajo la hipótesis alternativa $\\mu \\ne \\mu_0$, permitiendo calcular la potencia $1 - \\beta$ y el tamaño de muestra.',
  alias: ['student no central'],
  parametros: [
    { id: 'nu', tex: '\\nu', nombre: 'grados de libertad', restriccion: '\\nu > 0', min: 1, max: 35, paso: 1, valor: 8 },
    { id: 'delta', tex: '\\delta', nombre: 'no centralidad', restriccion: '\\delta \\in \\mathbb{R}', min: -4, max: 4, paso: 0.25, valor: 1.5 },
  ],
  soporte: 'x \\in (-\\infty, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{e^{-\\delta^{2}/2}}{\\sqrt{\\nu\\pi}\\;\\Gamma(\\nu/2)}\\left(1 + \\frac{x^{2}}{\\nu}\\right)^{-(\\nu + 1)/2} \\sum_{k=0}^{\\infty} \\frac{(\\delta\\sqrt{2})^{k}}{k!}\\,\\Gamma\\!\\left(\\frac{\\nu + k + 1}{2}\\right)\\left(\\frac{x}{\\sqrt{x^{2} + \\nu}}\\right)^{k}',
    media:
      'E[X] = \\delta\\,\\sqrt{\\frac{\\nu}{2}}\\,\\frac{\\Gamma\\!\\left(\\frac{\\nu - 1}{2}\\right)}{\\Gamma\\!\\left(\\frac{\\nu}{2}\\right)}, \\quad \\nu > 1',
    varianza:
      '\\operatorname{Var}(X) = \\frac{\\nu(1 + \\delta^{2})}{\\nu - 2} - \\big(E[X]\\big)^{2}, \\quad \\nu > 2',
  },
  extras: [
    {
      etiqueta: 'Estadístico t bajo H₁',
      tex: 'T = \\frac{\\bar{X} - \\mu_0}{S / \\sqrt{n}} \\sim t(n - 1,\\, \\delta), \\quad \\delta = \\frac{\\mu - \\mu_0}{\\sigma / \\sqrt{n}}',
    },
    {
      etiqueta: 'Simetría respecto a δ',
      tex: '-X \\sim t(\\nu,\\, -\\delta)',
    },
    {
      etiqueta: 'Cuadrado',
      tex: 'X^{2} \\sim F(1,\\, \\nu,\\, \\delta^{2})',
    },
  ],
  propiedades: [],
  notas: [
    'A diferencia de la $t(\\nu)$ central, para $\\delta \\ne 0$ la distribución es asimétrica (sesgada hacia el signo de $\\delta$).',
    'Cuando $\\delta = 0$ se recupera la distribución $t(\\nu)$ de Student central.',
  ],
  superficie: { param: 'delta', min: -3, max: 3 },
  calc: {
    densidad: (x, { nu, delta }) => {
      const u = x / Math.sqrt(x * x + nu);
      const pref =
        -0.5 * delta * delta -
        0.5 * Math.log(nu * Math.PI) -
        lgamma(nu / 2) -
        ((nu + 1) / 2) * Math.log(1 + (x * x) / nu);
      const d2 = delta * Math.SQRT2;
      let serie = 0;
      let pot = 1;
      for (let k = 0; k <= 55; k++) {
        const coef = Math.exp(lgamma((nu + k + 1) / 2) - lgamma(k + 1));
        serie += pot * coef;
        pot *= d2 * u;
      }
      return Math.max(0, Math.exp(pref) * serie);
    },
    rango: ({ delta }) => [delta - 25, delta + 25],
    media: ({ nu, delta }) => {
      if (nu <= 1) return NaN;
      return delta * Math.sqrt(nu / 2) * Math.exp(lgamma((nu - 1) / 2) - lgamma(nu / 2));
    },
    varianza: ({ nu, delta }) => {
      if (nu <= 2) return nu > 1 ? Infinity : NaN;
      const m = delta * Math.sqrt(nu / 2) * Math.exp(lgamma((nu - 1) / 2) - lgamma(nu / 2));
      return (nu * (1 + delta * delta)) / (nu - 2) - m * m;
    },
  },
};
