import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'chi-cuadrada',
  nombre: 'Chi-cuadrada',
  tipo: 'continua',
  notacion: 'X \\sim \\chi^{2}(\\nu)',
  descripcion:
    'Distribución de la suma de los cuadrados de $\\nu$ variables normales estándar independientes. Es un caso particular de la familia Gamma y aparece en la inferencia sobre varianzas y en pruebas de bondad de ajuste.',
  alias: ['ji-cuadrada', 'ji cuadrada', 'chi cuadrada', 'chi2'],
  parametros: [
    { id: 'nu', tex: '\\nu', nombre: 'grados de libertad', restriccion: '\\nu \\in \\{1, 2, \\dots\\}', min: 1, max: 30, paso: 1, valor: 4 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad: 'f(x) = \\frac{1}{2^{\\nu/2}\\,\\Gamma(\\nu/2)}\\, x^{\\nu/2 - 1} e^{-x/2}',
    fda: 'F(x) = \\frac{\\gamma(\\nu/2,\\, x/2)}{\\Gamma(\\nu/2)}',
    media: 'E[X] = \\nu',
    varianza: '\\operatorname{Var}(X) = 2\\nu',
    fgm: 'M_X(t) = (1 - 2t)^{-\\nu/2}, \\quad t < \\frac{1}{2}',
  },
  extras: [
    { etiqueta: 'Momentos', tex: 'E[X^{k}] = 2^{k}\\,\\frac{\\Gamma(\\nu/2 + k)}{\\Gamma(\\nu/2)}' },
    { etiqueta: 'Moda', tex: '\\text{Moda}(X) = \\max(\\nu - 2,\\, 0)' },
  ],
  propiedades: [
    { letra: 'C', detalle: 'X_i \\sim \\chi^{2}(\\nu_i) \\Rightarrow \\sum_i X_i \\sim \\chi^{2}\\Big(\\sum_i \\nu_i\\Big)' },
  ],
  notas: [
    'Equivale a una $\\text{Gamma}(\\alpha = \\nu/2,\\, \\lambda = 1/2)$, donde $\\nu$ también puede tomar cualquier valor real positivo.',
    'Si $X_1, \\dots, X_n$ es una muestra aleatoria de $N(\\mu, \\sigma^2)$ y $S^2$ es la varianza muestral, entonces $\\frac{(n-1)S^2}{\\sigma^2} \\sim \\chi^2(n-1)$.',
  ],
  superficie: { param: 'nu', min: 2, max: 20 },
  calc: {
    densidad: (x, { nu }) => {
      if (x <= 0) return 0;
      const a = nu / 2;
      return Math.exp(-a * Math.LN2 - lgamma(a) + (a - 1) * Math.log(x) - 0.5 * x);
    },
    rango: ({ nu }) => [0, nu + 12 * Math.sqrt(2 * nu) + 25],
    media: ({ nu }) => nu,
    varianza: ({ nu }) => 2 * nu,
  },
};
