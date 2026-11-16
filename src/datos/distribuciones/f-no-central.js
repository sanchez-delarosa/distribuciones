import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'f-no-central',
  nombre: 'F no central',
  tipo: 'continua',
  materia: 'inferencia',
  notacion: 'X \\sim F(\\nu_1, \\nu_2, \\delta)',
  descripcion:
    'Distribución del cociente $\\frac{U_1 / \\nu_1}{U_2 / \\nu_2}$ donde $U_1 \\sim \\chi^2(\\nu_1, \\delta)$ es chi-cuadrada no central y $U_2 \\sim \\chi^2(\\nu_2)$ es chi-cuadrada central independiente. Es la distribución del estadístico $F$ de ANOVA y regresión lineal múltiple cuando la hipótesis nula de igualdad de medias o coeficientes es falsa.',
  alias: ['fisher no central', 'snedecor no central'],
  parametros: [
    { id: 'nu1', tex: '\\nu_1', nombre: 'grados de libertad numerador', restriccion: '\\nu_1 > 0', min: 1, max: 30, paso: 1, valor: 6 },
    { id: 'nu2', tex: '\\nu_2', nombre: 'grados de libertad denominador', restriccion: '\\nu_2 > 0', min: 1, max: 35, paso: 1, valor: 14 },
    { id: 'delta', tex: '\\delta', nombre: 'no centralidad', restriccion: '\\delta \\ge 0', min: 0, max: 16, paso: 0.5, valor: 4 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\sum_{k=0}^{\\infty} \\frac{e^{-\\delta/2}(\\delta/2)^{k}}{k!}\\,\\frac{1}{\\operatorname{B}\\!\\left(\\frac{\\nu_1}{2} + k,\\, \\frac{\\nu_2}{2}\\right)}\\left(\\frac{\\nu_1}{\\nu_2}\\right)^{\\frac{\\nu_1}{2} + k} x^{\\frac{\\nu_1}{2} + k - 1}\\left(1 + \\frac{\\nu_1}{\\nu_2}x\\right)^{-\\left(\\frac{\\nu_1 + \\nu_2}{2} + k\\right)}',
    fda: 'F(x) = \\sum_{k=0}^{\\infty} \\frac{e^{-\\delta/2}(\\delta/2)^{k}}{k!}\\,I_{\\frac{\\nu_1 x}{\\nu_1 x + \\nu_2}}\\!\\left(\\frac{\\nu_1}{2} + k,\\, \\frac{\\nu_2}{2}\\right)',
    media: 'E[X] = \\frac{\\nu_2(\\nu_1 + \\delta)}{\\nu_1(\\nu_2 - 2)}, \\quad \\nu_2 > 2',
    varianza:
      '\\operatorname{Var}(X) = 2\\left(\\frac{\\nu_2}{\\nu_1}\\right)^{2}\\frac{(\\nu_1 + \\delta)^{2} + (\\nu_1 + 2\\delta)(\\nu_2 - 2)}{(\\nu_2 - 2)^{2}(\\nu_2 - 4)}, \\quad \\nu_2 > 4',
  },
  extras: [
    {
      etiqueta: 'Construcción estocástica',
      tex: 'X = \\frac{U_1 / \\nu_1}{U_2 / \\nu_2} \\sim F(\\nu_1, \\nu_2, \\delta), \\quad U_1 \\sim \\chi^2(\\nu_1, \\delta) \\perp U_2 \\sim \\chi^2(\\nu_2)',
    },
    {
      etiqueta: 'Representación como mezcla Poisson',
      tex: 'K \\sim \\text{Poisson}(\\delta / 2),\\; \\frac{\\nu_1}{\\nu_1 + 2k}\\,X \\mid K = k \\sim F(\\nu_1 + 2k,\\, \\nu_2)',
    },
  ],
  propiedades: [],
  notas: [
    'En ANOVA de un factor con tamaños $n_i$ y medias verdaderas $\\mu_i$, el parámetro de no centralidad es $\\delta = \\frac{1}{\\sigma^2}\\sum_i n_i(\\mu_i - \\bar{\\mu})^2$.',
    'Con $\\delta = 0$ se reduce a la distribución $F(\\nu_1, \\nu_2)$ central.',
  ],
  superficie: { param: 'delta', min: 0, max: 14 },
  calc: {
    densidad: (x, { nu1, nu2, delta }) => {
      if (x <= 0) return 0;
      const lam = delta / 2;
      const r = nu1 / nu2;
      const b = nu2 / 2;
      const lnX = Math.log(x);
      const lnR = Math.log(r);
      const ln1p = Math.log(1 + r * x);
      let suma = 0;
      for (let k = 0; k <= 45; k++) {
        if (k > 0 && lam === 0) break;
        const a = nu1 / 2 + k;
        const lnPeso = k === 0 && lam === 0 ? 0 : -lam + (k > 0 ? k * Math.log(lam) - lgamma(k + 1) : 0);
        const lnB = lgamma(a) + lgamma(b) - lgamma(a + b);
        const lnF = a * lnR + (a - 1) * lnX - (a + b) * ln1p - lnB;
        suma += Math.exp(lnPeso + lnF);
      }
      return suma;
    },
    rango: () => [0, 35],
    media: ({ nu1, nu2, delta }) => (nu2 > 2 ? (nu2 * (nu1 + delta)) / (nu1 * (nu2 - 2)) : Infinity),
    varianza: ({ nu1, nu2, delta }) =>
      nu2 > 4
        ? 2 *
          (nu2 / nu1) ** 2 *
          (((nu1 + delta) ** 2 + (nu1 + 2 * delta) * (nu2 - 2)) / ((nu2 - 2) ** 2 * (nu2 - 4)))
        : Infinity,
  },
};
