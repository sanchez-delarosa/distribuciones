import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'weibull-inversa',
  nombre: 'Weibull inversa',
  tipo: 'continua',
  materia: 'teoria-del-riesgo',
  notacion: 'X \\sim \\text{Weibull}^{-1}(\\tau, \\theta)',
  descripcion:
    'También conocida como distribución de Fréchet (valor extremo tipo II): distribución de $X = 1 / Y$ cuando $Y$ sigue una Weibull. Es cerrada bajo el máximo de variables independientes y modela el siniestro máximo anual en carteras con severidades de cola pesada (Pareto, Burr, Cauchy).',
  alias: ['frechet', 'valor extremo tipo ii'],
  parametros: [
    { id: 'tau', tex: '\\tau', nombre: 'forma (cola)', restriccion: '\\tau > 0', min: 1, max: 10, paso: 0.5, valor: 4.5 },
    { id: 'theta', tex: '\\theta', nombre: 'escala', restriccion: '\\theta > 0', min: 0.5, max: 10, paso: 0.5, valor: 2 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{\\tau\\,\\theta^{\\tau}}{x^{\\tau + 1}}\\,\\exp\\!\\left[-\\left(\\frac{\\theta}{x}\\right)^{\\tau}\\right]',
    fda: 'F(x) = \\exp\\!\\left[-\\left(\\frac{\\theta}{x}\\right)^{\\tau}\\right]',
    supervivencia: 'S(x) = 1 - \\exp\\!\\left[-\\left(\\frac{\\theta}{x}\\right)^{\\tau}\\right]',
    media: 'E[X] = \\theta\\,\\Gamma\\!\\left(1 - \\frac{1}{\\tau}\\right), \\quad \\tau > 1',
    varianza:
      '\\operatorname{Var}(X) = \\theta^{2}\\left[\\Gamma\\!\\left(1 - \\frac{2}{\\tau}\\right) - \\Gamma^{2}\\!\\left(1 - \\frac{1}{\\tau}\\right)\\right], \\quad \\tau > 2',
  },
  extras: [
    {
      etiqueta: 'Momentos de orden k',
      tex: 'E[X^{k}] = \\theta^{k}\\,\\Gamma\\!\\left(1 - \\frac{k}{\\tau}\\right), \\quad k < \\tau',
    },
    {
      etiqueta: 'Valor en riesgo (VaR)',
      tex: '\\operatorname{VaR}_p(X) = \\theta\\,(-\\ln p)^{-1/\\tau}',
    },
    {
      etiqueta: 'Moda',
      tex: '\\text{Moda}(X) = \\theta\\,\\left(\\frac{\\tau}{\\tau + 1}\\right)^{1/\\tau}',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Weibull}^{-1}(\\tau,\\, c\\theta), \\quad c > 0',
    },
    {
      letra: 'X',
      detalle: 'X_i \\perp \\text{Weibull}^{-1}(\\tau, \\theta_i) \\Rightarrow \\max_i X_i \\sim \\text{Weibull}^{-1}\\!\\left(\\tau,\\, \\Big(\\sum_i \\theta_i^{\\tau}\\Big)^{1/\\tau}\\right)',
    },
    {
      letra: 'V',
      detalle: 'X = \\theta\\,(-\\ln U)^{-1/\\tau}, \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Por el teorema de Fisher–Tippett–Gnedenko, el máximo reescalado de variables independientes con cola regularmente variante $S(x) \\propto x^{-\\tau}$ converge en distribución a $\\text{Weibull}^{-1}(\\tau, \\theta)$.',
  ],
  superficie: { param: 'tau', min: 2, max: 8 },
  calc: {
    densidad: (x, { tau, theta }) => {
      if (x <= 0) return 0;
      const u = Math.pow(theta / x, tau);
      return ((tau * u) / x) * Math.exp(-u);
    },
    rango: ({ theta }) => [0, 15 * theta],
    media: ({ tau, theta }) => (tau > 1 ? theta * Math.exp(lgamma(1 - 1 / tau)) : Infinity),
    varianza: ({ tau, theta }) => {
      if (tau <= 2) return Infinity;
      const g1 = Math.exp(lgamma(1 - 1 / tau));
      const g2 = Math.exp(lgamma(1 - 2 / tau));
      return theta * theta * (g2 - g1 * g1);
    },
  },
};
