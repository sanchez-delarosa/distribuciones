import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'poisson-compuesta',
  nombre: 'Poisson compuesta',
  tipo: 'continua',
  materia: 'teoria-del-riesgo',
  notacion: 'S = \\sum_{i=1}^{N} X_i \\sim \\text{CompPoisson}(\\lambda, \\alpha, \\beta)',
  descripcion:
    'Modelo colectivo de riesgo de Cramér–Lundberg (distribución de Tweedie Poisson-Gamma): representa el monto total agregado de reclamaciones $S = \\sum_{i=1}^N X_i$ cuando la frecuencia es $N \\sim \\text{Poisson}(\\lambda)$ y las severidades individuales son independientes $X_i \\sim \\text{Gamma}(\\alpha, \\beta)$. Posee una masa puntual $e^{-\\lambda}$ en $S = 0$ y densidad continua para $S > 0$.',
  alias: ['riesgo colectivo', 'cramer-lundberg', 'tweedie', 'panjer'],
  parametros: [
    { id: 'lambda', tex: '\\lambda', nombre: 'frecuencia esperada de siniestros', restriccion: '\\lambda > 0', min: 1, max: 20, paso: 0.5, valor: 10 },
    { id: 'alpha', tex: '\\alpha', nombre: 'forma de cada severidad Gamma', restriccion: '\\alpha > 0', min: 0.5, max: 6, paso: 0.5, valor: 2 },
    { id: 'beta', tex: '\\beta', nombre: 'tasa de cada severidad Gamma', restriccion: '\\beta > 0', min: 0.25, max: 4, paso: 0.25, valor: 1 },
  ],
  soporte: 's \\in [0, \\infty), \\quad P(S = 0) = e^{-\\lambda}',
  formulas: {
    densidad:
      'f_S(s) = \\sum_{n=1}^{\\infty} \\frac{e^{-\\lambda}\\lambda^{n}}{n!}\\,\\frac{\\beta^{n\\alpha}}{\\Gamma(n\\alpha)}\\,s^{n\\alpha - 1} e^{-\\beta s}, \\quad s > 0',
    fda: 'F_S(s) = e^{-\\lambda} + \\sum_{n=1}^{\\infty} \\frac{e^{-\\lambda}\\lambda^{n}}{n!}\\,F_{\\text{Gamma}(n\\alpha, \\beta)}(s), \\quad s \\ge 0',
    media: 'E[S] = E[N]\\,E[X] = \\lambda\\,\\frac{\\alpha}{\\beta}',
    varianza: '\\operatorname{Var}(S) = \\lambda\\,E[X^{2}] = \\lambda\\,\\frac{\\alpha(\\alpha + 1)}{\\beta^{2}}',
    fgm: 'M_S(t) = M_N\\!\\big(\\ln M_X(t)\\big) = \\exp\\!\\left[\\lambda\\left(\\left(\\frac{\\beta}{\\beta - t}\\right)^{\\alpha} - 1\\right)\\right], \\quad t < \\beta',
  },
  extras: [
    {
      etiqueta: 'Identidades de Wald (media y varianza colectivas)',
      tex: 'E[S] = E[N]\\,E[X], \\qquad \\operatorname{Var}(S) = E[N]\\,\\operatorname{Var}(X) + \\operatorname{Var}(N)\\,(E[X])^{2}',
    },
    {
      etiqueta: 'Teorema de aditividad de carteras Poisson compuestas',
      tex: 'S_1, S_2 \\perp \\text{Poisson compuestas} \\implies S_1 + S_2 \\sim \\text{Poisson compuesta}(\\lambda_1 + \\lambda_2)',
    },
    {
      etiqueta: 'Asimetría del riesgo colectivo',
      tex: '\\gamma_1(S) = \\frac{\\lambda\\,E[X^{3}]}{\\big(\\operatorname{Var}(S)\\big)^{3/2}} = \\frac{\\alpha + 2}{\\sqrt{\\lambda\\,\\alpha(\\alpha + 1)}}',
    },
  ],
  propiedades: [
    {
      letra: 'C',
      detalle: 'S_i \\perp \\text{CompPoisson}(\\lambda_i, \\alpha, \\beta) \\Rightarrow \\sum_i S_i \\sim \\text{CompPoisson}\\!\\Big(\\sum_i \\lambda_i,\\, \\alpha,\\, \\beta\\Big)',
    },
    {
      letra: 'S',
      detalle: 'cS \\sim \\text{CompPoisson}(\\lambda,\\, \\alpha,\\, \\beta / c), \\quad c > 0',
    },
  ],
  notas: [
    'Pertenece a la familia exponencial dispersiva de **Tweedie** con varianza potencia $V(\\mu) \\propto \\mu^p$, donde $p = \\frac{\\alpha + 2}{\\alpha + 1} \\in (1, 2)$, estándar en tarificación actuarial con modelos lineales generalizados (GLM).',
    'Para severidades discretizadas en múltiplos de una unidad monetaria, la distribución exacta de $S$ se calcula con la **fórmula recursiva de Panjer**.',
  ],
  superficie: { param: 'lambda', min: 2, max: 18 },
  calc: {
    densidad: (s, { lambda, alpha, beta }) => {
      if (s <= 0) return 0;
      const lnS = Math.log(s);
      const lnB = Math.log(beta);
      let suma = 0;
      const nMax = Math.ceil(lambda + 8 * Math.sqrt(lambda) + 20);
      for (let n = 1; n <= nMax; n++) {
        const a = n * alpha;
        const lnPeso = -lambda + n * Math.log(lambda) - lgamma(n + 1);
        const lnGam = a * lnB - lgamma(a) + (a - 1) * lnS - beta * s;
        suma += Math.exp(lnPeso + lnGam);
      }
      return suma;
    },
    rango: ({ lambda, alpha, beta }) => {
      const m = (lambda * alpha) / beta;
      const de = Math.sqrt((lambda * alpha * (alpha + 1)) / (beta * beta));
      return [0, m + 9 * de + 15 / beta];
    },
    media: ({ lambda, alpha, beta }) => (lambda * alpha) / beta,
    varianza: ({ lambda, alpha, beta }) => (lambda * alpha * (alpha + 1)) / (beta * beta),
  },
};
