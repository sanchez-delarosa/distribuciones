import { lgamma } from '../../mate/especiales.js';

const gamma = (z) => Math.exp(lgamma(z));
const media = ({ tau, lambda }) => gamma(1 + 1 / tau) / lambda;
const varianza = ({ tau, lambda }) => {
  const g1 = gamma(1 + 1 / tau);
  const g2 = gamma(1 + 2 / tau);
  return (g2 - g1 * g1) / (lambda * lambda);
};

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'weibull',
  nombre: 'Weibull',
  tipo: 'continua',
  notacion: 'X \\sim \\text{Weibull}(\\tau, \\lambda)',
  descripcion:
    'Generaliza a la exponencial permitiendo tasas de riesgo monótonas: decreciente si $\\tau < 1$, constante si $\\tau = 1$ y creciente si $\\tau > 1$. Se usa en supervivencia, confiabilidad y severidad de siniestros.',
  alias: ['weibull'],
  parametros: [
    { id: 'tau', tex: '\\tau', nombre: 'forma', restriccion: '\\tau > 0', min: 0.5, max: 5, paso: 0.1, valor: 2 },
    { id: 'lambda', tex: '\\lambda', nombre: 'escala inversa', restriccion: '\\lambda > 0', min: 0.2, max: 4, paso: 0.1, valor: 1 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad: 'f(x) = \\tau\\,\\lambda^{\\tau} x^{\\tau - 1} e^{-(\\lambda x)^{\\tau}}',
    fda: 'F(x) = 1 - e^{-(\\lambda x)^{\\tau}}, \\quad x \\ge 0',
    supervivencia: 'S(x) = e^{-(\\lambda x)^{\\tau}}, \\quad x \\ge 0',
    riesgo: 'h(x) = \\tau\\,\\lambda^{\\tau} x^{\\tau - 1}',
    media: 'E[X] = \\frac{1}{\\lambda}\\,\\Gamma\\!\\left(1 + \\frac{1}{\\tau}\\right)',
    varianza: '\\operatorname{Var}(X) = \\frac{1}{\\lambda^{2}}\\left[\\Gamma\\!\\left(1 + \\frac{2}{\\tau}\\right) - \\Gamma\\!\\left(1 + \\frac{1}{\\tau}\\right)^{2}\\right]',
  },
  extras: [
    { etiqueta: 'Momentos', tex: 'E[X^{k}] = \\frac{1}{\\lambda^{k}}\\,\\Gamma\\!\\left(1 + \\frac{k}{\\tau}\\right)' },
    { etiqueta: 'Valor en riesgo', tex: '\\operatorname{VaR}_{\\alpha}(X) = \\frac{\\big(-\\ln(1 - \\alpha)\\big)^{1/\\tau}}{\\lambda}' },
    { etiqueta: 'Mediana', tex: '\\text{Mediana}(X) = \\frac{(\\ln 2)^{1/\\tau}}{\\lambda}' },
  ],
  propiedades: [
    { letra: 'S', detalle: 'cX \\sim \\text{Weibull}(\\tau,\\, \\lambda / c), \\quad c > 0' },
    { letra: 'M', detalle: 'X_i \\sim \\text{Weibull}(\\tau, \\lambda_i) \\Rightarrow \\min_i X_i \\sim \\text{Weibull}\\Big(\\tau,\\, \\Big(\\sum_i \\lambda_i^{\\tau}\\Big)^{1/\\tau}\\Big)' },
    { letra: 'V', detalle: 'X = \\frac{(-\\ln U)^{1/\\tau}}{\\lambda}, \\quad U \\sim \\text{Uniforme}(0, 1)' },
  ],
  notas: [
    'Con $\\tau = 2$ se obtiene la distribución de Rayleigh.',
    'En *Loss Models* se parametriza con la escala $\\theta = 1/\\lambda$, de modo que $S(x) = e^{-(x/\\theta)^\\tau}$ y $E[X] = \\theta\\,\\Gamma(1 + 1/\\tau)$.',
  ],
  superficie: { param: 'tau', min: 0.8, max: 4 },
  calc: {
    densidad: (x, { tau, lambda }) =>
      x <= 0 ? 0 : tau * Math.pow(lambda, tau) * Math.pow(x, tau - 1) * Math.exp(-Math.pow(lambda * x, tau)),
    rango: ({ tau, lambda }) => [0, Math.pow(20, 1 / tau) / lambda],
    media,
    varianza,
  },
};
