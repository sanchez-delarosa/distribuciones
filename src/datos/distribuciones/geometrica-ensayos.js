import { techo } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'geometrica-ensayos',
  nombre: 'Geométrica (ensayos)',
  tipo: 'discreta',
  notacion: 'Y \\sim \\text{Geo}_{E}(p)',
  descripcion:
    'Número de ensayos Bernoulli independientes necesarios para obtener el primer éxito, contando el ensayo del éxito. El soporte empieza en $1$.',
  alias: ['geometrica', 'geométrica', 'geometrica desde uno'],
  parametros: [
    { id: 'p', tex: 'p', nombre: 'probabilidad de éxito', restriccion: '0 < p < 1', min: 0.02, max: 0.98, paso: 0.01, valor: 0.3 },
  ],
  soporte: 'y \\in \\{1, 2, 3, \\dots\\}',
  formulas: {
    densidad: 'P(Y = y) = p\\,(1-p)^{y-1}',
    fda: 'F(y) = 1 - (1-p)^{\\lfloor y \\rfloor}, \\quad y \\ge 1',
    supervivencia: 'S(y) = P(Y > y) = (1-p)^{\\lfloor y \\rfloor}, \\quad y \\ge 1',
    riesgo: 'h(y) = \\frac{P(Y = y)}{P(Y \\ge y)} = p',
    media: 'E[Y] = \\frac{1}{p}',
    varianza: '\\operatorname{Var}(Y) = \\frac{1-p}{p^{2}}',
    fgm: 'M_Y(t) = \\frac{p\\,e^{t}}{1 - (1-p)\\,e^{t}}, \\quad t < -\\ln(1-p)',
    fgp: 'P_Y(z) = \\frac{p\\,z}{1 - (1-p)\\,z}, \\quad |z| < \\frac{1}{1-p}',
  },
  claseAB: { clase: '(a, b, 1)', a: '1-p', b: '0', p0: '0' },
  propiedades: [
    { letra: 'F', detalle: 'P(Y > m + n \\mid Y > m) = P(Y > n)' },
    { letra: 'M', detalle: 'Y_i \\sim \\text{Geo}_{E}(p_i) \\Rightarrow \\min_i Y_i \\sim \\text{Geo}_{E}\\Big(1 - \\prod_i (1-p_i)\\Big)' },
    { letra: 'V', detalle: 'Y = \\left\\lceil \\frac{\\ln U}{\\ln(1-p)} \\right\\rceil, \\quad U \\sim \\text{Uniforme}(0, 1)' },
  ],
  notas: [
    'Es la geométrica de fracasos truncada en cero; por eso pertenece a la clase $(a, b, 1)$ con $p_0 = 0$.',
  ],
  superficie: { param: 'p', min: 0.1, max: 0.9 },
  calc: {
    densidad: (y, { p }) => (y < 1 ? 0 : p * Math.pow(1 - p, y - 1)),
    rango: ({ p }) => [1, 1 + techo(Math.log(1e-12) / Math.log(1 - p))],
    media: ({ p }) => 1 / p,
    varianza: ({ p }) => (1 - p) / (p * p),
  },
};
