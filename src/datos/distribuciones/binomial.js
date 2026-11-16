import { lcomb } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'binomial',
  nombre: 'Binomial',
  tipo: 'discreta',
  notacion: 'X \\sim \\text{Bin}(n, p)',
  descripcion:
    'Número de éxitos en $n$ ensayos Bernoulli independientes, todos con la misma probabilidad de éxito $p$.',
  parametros: [
    { id: 'n', tex: 'n', nombre: 'número de ensayos', restriccion: 'n \\in \\{1, 2, \\dots\\}', min: 1, max: 60, paso: 1, valor: 10 },
    { id: 'p', tex: 'p', nombre: 'probabilidad de éxito', restriccion: '0 < p < 1', min: 0.01, max: 0.99, paso: 0.01, valor: 0.3 },
  ],
  soporte: 'x \\in \\{0, 1, \\dots, n\\}',
  formulas: {
    densidad: 'P(X = x) = \\binom{n}{x} p^{x} (1-p)^{n-x}',
    fda: 'F(x) = \\sum_{k=0}^{\\lfloor x \\rfloor} \\binom{n}{k} p^{k} (1-p)^{n-k}',
    media: 'E[X] = np',
    varianza: '\\operatorname{Var}(X) = np(1-p)',
    fgm: 'M_X(t) = \\left(1 - p + p\\,e^{t}\\right)^{n}',
    fgp: 'P_X(z) = \\left(1 - p + p\\,z\\right)^{n}',
  },
  claseAB: {
    clase: '(a, b, 0)',
    a: '-\\frac{p}{1-p}',
    b: '\\frac{(n+1)\\,p}{1-p}',
    p0: '(1-p)^{n}',
  },
  propiedades: [
    { letra: 'C', detalle: 'X_i \\sim \\text{Bin}(n_i, p) \\Rightarrow \\sum_i X_i \\sim \\text{Bin}\\Big(\\sum_i n_i,\\, p\\Big)' },
  ],
  notas: [
    'Si $X \\sim \\text{Bin}(n, p)$, entonces $n - X \\sim \\text{Bin}(n, 1-p)$: contar fracasos en lugar de éxitos.',
    'La suma conserva la familia solo si todas las variables tienen la misma $p$.',
  ],
  superficie: { param: 'p', min: 0.02, max: 0.98 },
  calc: {
    densidad: (x, { n, p }) => Math.exp(lcomb(n, x) + x * Math.log(p) + (n - x) * Math.log1p(-p)),
    rango: ({ n }) => [0, n],
    media: ({ n, p }) => n * p,
    varianza: ({ n, p }) => n * p * (1 - p),
  },
};
