import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'chi-cuadrada-no-central',
  nombre: 'Chi-cuadrada no central',
  tipo: 'continua',
  materia: 'inferencia',
  notacion: 'X \\sim \\chi^{2}(\\nu, \\delta)',
  descripcion:
    'Distribución de la suma de cuadrados $\\sum_{i=1}^\\nu X_i^2$ de variables independientes $X_i \\sim N(\\mu_i, 1)$ con medias no nulas y parámetro de no centralidad $\\delta = \\sum_{i=1}^\\nu \\mu_i^2$. Es la base para calcular la potencia bajo la hipótesis alternativa $H_1$ en pruebas de razón de verosimilitud, tablas de contingencia y modelos lineales.',
  alias: ['ji cuadrada no central', 'chi2 no central'],
  parametros: [
    { id: 'nu', tex: '\\nu', nombre: 'grados de libertad', restriccion: '\\nu > 0', min: 1, max: 30, paso: 1, valor: 6 },
    { id: 'delta', tex: '\\delta', nombre: 'no centralidad', restriccion: '\\delta \\ge 0', min: 0, max: 16, paso: 0.5, valor: 4 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\sum_{k=0}^{\\infty} \\frac{e^{-\\delta/2}(\\delta/2)^{k}}{k!}\\,f_{\\chi^{2}(\\nu + 2k)}(x) = \\frac{1}{2}e^{-(x + \\delta)/2}\\left(\\frac{x}{\\delta}\\right)^{\\frac{\\nu - 2}{4}} I_{\\nu/2 - 1}\\!\\big(\\sqrt{\\delta x}\\big)',
    fda: 'F(x) = \\sum_{k=0}^{\\infty} \\frac{e^{-\\delta/2}(\\delta/2)^{k}}{k!}\\,F_{\\chi^{2}(\\nu + 2k)}(x)',
    media: 'E[X] = \\nu + \\delta',
    varianza: '\\operatorname{Var}(X) = 2(\\nu + 2\\delta)',
    fgm: 'M_X(t) = (1 - 2t)^{-\\nu/2}\\,\\exp\\!\\left(\\frac{\\delta t}{1 - 2t}\\right), \\quad t < \\frac{1}{2}',
  },
  extras: [
    {
      etiqueta: 'Construcción con normales no centradas',
      tex: 'X_i \\perp N(\\mu_i, 1) \\implies \\sum_{i=1}^{\\nu} X_i^{2} \\sim \\chi^{2}(\\nu, \\delta), \\quad \\delta = \\sum_{i=1}^{\\nu} \\mu_i^{2}',
    },
    {
      etiqueta: 'Representación como mezcla Poisson',
      tex: 'K \\sim \\text{Poisson}(\\delta / 2),\\; X \\mid K = k \\sim \\chi^{2}(\\nu + 2k)',
    },
    {
      etiqueta: 'Cumulantes',
      tex: '\\kappa_r = 2^{r - 1}(r - 1)!\\,(\\nu + r\\delta)',
    },
  ],
  propiedades: [
    {
      letra: 'C',
      detalle: 'X_i \\sim \\chi^{2}(\\nu_i, \\delta_i) \\Rightarrow \\sum_i X_i \\sim \\chi^{2}\\!\\Big(\\sum_i \\nu_i,\\, \\sum_i \\delta_i\\Big)',
    },
  ],
  notas: [
    'La distribución depende de las medias $\\mu_1, \\dots, \\mu_\\nu$ únicamente a través de la suma de sus cuadrados $\\delta = \\|\\boldsymbol{\\mu}\\|^2$ (invarianza ortogonal).',
    'Cuando $\\delta = 0$ se recupera la distribución $\\chi^2(\\nu)$ central.',
  ],
  superficie: { param: 'delta', min: 0, max: 14 },
  calc: {
    densidad: (x, { nu, delta }) => {
      if (x <= 0) return 0;
      const lam = delta / 2;
      let suma = 0;
      const lnX = Math.log(x);
      for (let k = 0; k <= 45; k++) {
        const a = nu / 2 + k;
        const lnPeso = k === 0 && lam === 0 ? 0 : -lam + (k > 0 ? k * Math.log(lam) - lgamma(k + 1) : 0);
        if (k > 0 && lam === 0) break;
        const lnChi = -a * Math.LN2 - lgamma(a) + (a - 1) * lnX - 0.5 * x;
        suma += Math.exp(lnPeso + lnChi);
      }
      return suma;
    },
    rango: ({ nu, delta }) => [0, nu + delta + 10 * Math.sqrt(2 * (nu + 2 * delta)) + 15],
    media: ({ nu, delta }) => nu + delta,
    varianza: ({ nu, delta }) => 2 * (nu + 2 * delta),
  },
};
