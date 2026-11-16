import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'gamma-inversa',
  nombre: 'Gamma inversa',
  tipo: 'continua',
  materia: 'teoria-del-riesgo',
  notacion: 'X \\sim \\text{Gamma}^{-1}(\\alpha, \\theta)',
  descripcion:
    'Distribución de la recíproca $X = 1 / Y$ de una variable $Y \\sim \\text{Gamma}(\\alpha, \\theta)$. En teoría del riesgo modela severidades de cola derecha polinomial pesada ($f(x) \\propto x^{-\\alpha - 1}$ cuando $x \\to \\infty$) y con caída exponencial rápida cerca de cero ($e^{-\\theta/x}$), además de ser la priori conjugada clásica para la varianza normal.',
  alias: ['pearson tipo v', 'vinci'],
  parametros: [
    { id: 'alpha', tex: '\\alpha', nombre: 'forma (cola)', restriccion: '\\alpha > 0', min: 1, max: 12, paso: 0.5, valor: 5 },
    { id: 'theta', tex: '\\theta', nombre: 'escala', restriccion: '\\theta > 0', min: 0.5, max: 12, paso: 0.5, valor: 4 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad: 'f(x) = \\frac{\\theta^{\\alpha}}{\\Gamma(\\alpha)}\\,x^{-(\\alpha + 1)}\\,e^{-\\theta / x}',
    fda: 'F(x) = \\frac{\\Gamma(\\alpha,\\, \\theta / x)}{\\Gamma(\\alpha)} = 1 - F_{\\text{Gamma}(\\alpha, 1)}\\!\\left(\\frac{\\theta}{x}\\right)',
    media: 'E[X] = \\frac{\\theta}{\\alpha - 1}, \\quad \\alpha > 1',
    varianza: '\\operatorname{Var}(X) = \\frac{\\theta^{2}}{(\\alpha - 1)^{2}(\\alpha - 2)}, \\quad \\alpha > 2',
    fgm: '\\text{No existe para } t > 0 \\text{ (cola derecha polinomial)}',
  },
  extras: [
    {
      etiqueta: 'Momentos de orden k',
      tex: 'E[X^{k}] = \\frac{\\theta^{k}\\,\\Gamma(\\alpha - k)}{\\Gamma(\\alpha)} = \\frac{\\theta^{k}}{(\\alpha - 1)(\\alpha - 2)\\cdots(\\alpha - k)}, \\quad k < \\alpha',
    },
    {
      etiqueta: 'Moda',
      tex: '\\text{Moda}(X) = \\frac{\\theta}{\\alpha + 1}',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Gamma}^{-1}(\\alpha,\\, c\\theta), \\quad c > 0',
    },
  ],
  notas: [
    'Si la media condicional de una exponencial sigue $\\Theta \\sim \\text{Gamma}^{-1}(\\alpha, \\theta)$ (equivalentemente la tasa sigue $\\Lambda = 1/\\Theta \\sim \\text{Gamma}(\\alpha, \\theta)$), la distribución marginal de la pérdida es $\\text{Pareto}_{II}(\\alpha, \\theta)$.',
  ],
  superficie: { param: 'alpha', min: 2, max: 10 },
  calc: {
    densidad: (x, { alpha, theta }) => {
      if (x <= 0) return 0;
      return Math.exp(alpha * Math.log(theta) - lgamma(alpha) - (alpha + 1) * Math.log(x) - theta / x);
    },
    rango: ({ theta }) => [0, 6 * theta],
    media: ({ alpha, theta }) => (alpha > 1 ? theta / (alpha - 1) : Infinity),
    varianza: ({ alpha, theta }) =>
      alpha > 2 ? (theta * theta) / ((alpha - 1) ** 2 * (alpha - 2)) : Infinity,
  },
};
