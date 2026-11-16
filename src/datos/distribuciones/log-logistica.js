import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'log-logistica',
  nombre: 'Log-logística',
  tipo: 'continua',
  materia: 'teoria-del-riesgo',
  notacion: 'X \\sim \\text{LogLog}(\\gamma, \\theta)',
  descripcion:
    'También llamada distribución de Fisk: variable continua en $(0, \\infty)$ cuyo logaritmo sigue una distribución logística. Es el caso especial $\\alpha = 1$ de la familia de Burr y se emplea en modelos de supervivencia y severidad de siniestros con tasa de riesgo unimodal y cola derecha polinomial.',
  alias: ['fisk', 'pareto tipo iii'],
  parametros: [
    { id: 'gamma', tex: '\\gamma', nombre: 'forma (cola)', restriccion: '\\gamma > 0', min: 1, max: 10, paso: 0.5, valor: 5 },
    { id: 'theta', tex: '\\theta', nombre: 'escala (mediana)', restriccion: '\\theta > 0', min: 0.5, max: 10, paso: 0.5, valor: 2 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{\\gamma\\,(x / \\theta)^{\\gamma - 1}}{\\theta\\,\\big[1 + (x / \\theta)^{\\gamma}\\big]^{2}}',
    fda: 'F(x) = \\frac{(x / \\theta)^{\\gamma}}{1 + (x / \\theta)^{\\gamma}} = \\frac{1}{1 + (x / \\theta)^{-\\gamma}}',
    supervivencia: 'S(x) = \\frac{1}{1 + (x / \\theta)^{\\gamma}}',
    riesgo: 'h(x) = \\frac{\\gamma\\,(x / \\theta)^{\\gamma - 1}}{\\theta\\,\\big[1 + (x / \\theta)^{\\gamma}\\big]}',
    media:
      'E[X] = \\theta\\,\\frac{\\pi / \\gamma}{\\sin(\\pi / \\gamma)}, \\quad \\gamma > 1',
    varianza:
      '\\operatorname{Var}(X) = \\theta^{2}\\left[\\frac{2\\pi / \\gamma}{\\sin(2\\pi / \\gamma)} - \\left(\\frac{\\pi / \\gamma}{\\sin(\\pi / \\gamma)}\\right)^{2}\\right], \\quad \\gamma > 2',
  },
  extras: [
    {
      etiqueta: 'Momentos de orden k',
      tex: 'E[X^{k}] = \\theta^{k}\\,\\Gamma\\!\\left(1 + \\frac{k}{\\gamma}\\right)\\Gamma\\!\\left(1 - \\frac{k}{\\gamma}\\right) = \\theta^{k}\\,\\frac{\\pi k / \\gamma}{\\sin(\\pi k / \\gamma)}, \\quad k < \\gamma',
    },
    {
      etiqueta: 'Valor en riesgo (VaR)',
      tex: '\\operatorname{VaR}_p(X) = \\theta\\,\\left(\\frac{p}{1 - p}\\right)^{1/\\gamma}',
    },
    {
      etiqueta: 'Mediana',
      tex: '\\text{Med}(X) = \\theta',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{LogLog}(\\gamma,\\, c\\theta), \\quad c > 0',
    },
    {
      letra: 'I',
      detalle: 'X \\sim \\text{LogLog}(\\gamma, \\theta) \\Rightarrow \\frac{1}{X} \\sim \\text{LogLog}\\!\\left(\\gamma,\\, \\frac{1}{\\theta}\\right)',
    },
    {
      letra: 'V',
      detalle: 'X = \\theta\\,\\left(\\frac{U}{1 - U}\\right)^{1/\\gamma}, \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Si $X \\sim \\text{LogLog}(\\gamma, \\theta)$, entonces $\\ln X \\sim \\text{Logística}(\\ln\\theta,\\, 1/\\gamma)$.',
    'Para $\\gamma > 1$ la función de riesgo $h(x)$ crece desde $0$ hasta un máximo y luego decrece hacia $0$, lo que permite modelar siniestros o duraciones cuyo riesgo alcanza un pico intermedio.',
  ],
  superficie: { param: 'gamma', min: 1.5, max: 8 },
  calc: {
    densidad: (x, { gamma, theta }) => {
      if (x <= 0) return 0;
      const u = Math.pow(x / theta, gamma);
      return (gamma * Math.pow(x / theta, gamma - 1)) / (theta * (1 + u) * (1 + u));
    },
    rango: ({ theta }) => [0, 22 * theta],
    rangoGrafica: ({ theta }) => [0, 5 * theta],
    media: ({ gamma, theta }) => {
      if (gamma <= 1) return Infinity;
      return theta * Math.exp(lgamma(1 + 1 / gamma) + lgamma(1 - 1 / gamma));
    },
    varianza: ({ gamma, theta }) => {
      if (gamma <= 2) return Infinity;
      const m1 = theta * Math.exp(lgamma(1 + 1 / gamma) + lgamma(1 - 1 / gamma));
      const m2 = theta * theta * Math.exp(lgamma(1 + 2 / gamma) + lgamma(1 - 2 / gamma));
      return m2 - m1 * m1;
    },
  },
};
