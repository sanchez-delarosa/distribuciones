import { techo } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'geometrica-fracasos',
  nombre: 'Geométrica (fracasos)',
  tipo: 'discreta',
  notacion: 'X \\sim \\text{Geo}_{F}(p)',
  descripcion:
    'Número de fracasos antes del primer éxito en ensayos Bernoulli independientes con probabilidad de éxito $p$. El soporte empieza en $0$.',
  alias: ['geometrica', 'geométrica', 'geometrica desde cero'],
  parametros: [
    { id: 'p', tex: 'p', nombre: 'probabilidad de éxito', restriccion: '0 < p < 1', min: 0.02, max: 0.98, paso: 0.01, valor: 0.3 },
  ],
  soporte: 'x \\in \\{0, 1, 2, \\dots\\}',
  formulas: {
    densidad: 'P(X = x) = p\\,(1-p)^{x}',
    fda: 'F(x) = 1 - (1-p)^{\\lfloor x \\rfloor + 1}, \\quad x \\ge 0',
    supervivencia: 'S(x) = P(X > x) = (1-p)^{\\lfloor x \\rfloor + 1}, \\quad x \\ge 0',
    riesgo: 'h(x) = \\frac{P(X = x)}{P(X \\ge x)} = p',
    media: 'E[X] = \\frac{1-p}{p}',
    varianza: '\\operatorname{Var}(X) = \\frac{1-p}{p^{2}}',
    fgm: 'M_X(t) = \\frac{p}{1 - (1-p)\\,e^{t}}, \\quad t < -\\ln(1-p)',
    fgp: 'P_X(z) = \\frac{p}{1 - (1-p)\\,z}, \\quad |z| < \\frac{1}{1-p}',
  },
  claseAB: { clase: '(a, b, 0)', a: '1-p', b: '0', p0: 'p' },
  propiedades: [
    { letra: 'F', detalle: 'P(X \\ge m + n \\mid X \\ge m) = P(X \\ge n)' },
    { letra: 'M', detalle: 'X_i \\sim \\text{Geo}_{F}(p_i) \\Rightarrow \\min_i X_i \\sim \\text{Geo}_{F}\\Big(1 - \\prod_i (1-p_i)\\Big)' },
    { letra: 'V', detalle: 'X = \\left\\lfloor \\frac{\\ln U}{\\ln(1-p)} \\right\\rfloor, \\quad U \\sim \\text{Uniforme}(0, 1)' },
  ],
  notas: [
    'Es la única distribución discreta con falta de memoria (junto con su versión de ensayos) y tiene riesgo constante.',
    'En *Loss Models* (Klugman, Panjer y Willmot) se parametriza con $\\beta = (1-p)/p$, de modo que $E[X] = \\beta$ y $\\operatorname{Var}(X) = \\beta(1+\\beta)$.',
  ],
  superficie: { param: 'p', min: 0.1, max: 0.9 },
  calc: {
    densidad: (x, { p }) => p * Math.pow(1 - p, x),
    rango: ({ p }) => [0, techo(Math.log(1e-12) / Math.log(1 - p))],
    media: ({ p }) => (1 - p) / p,
    varianza: ({ p }) => (1 - p) / (p * p),
  },
};
