import { lcomb } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'hipergeometrica',
  nombre: 'Hipergeométrica',
  tipo: 'discreta',
  notacion: 'X \\sim \\text{Hiper}(N, K, n)',
  descripcion:
    'Número de éxitos en una muestra de tamaño $n$ tomada sin reemplazo de una población de $N$ elementos, de los cuales $K$ son éxitos.',
  parametros: [
    { id: 'N', tex: 'N', nombre: 'tamaño de la población', restriccion: 'N \\in \\{1, 2, \\dots\\}', min: 2, max: 100, paso: 1, valor: 50 },
    { id: 'K', tex: 'K', nombre: 'éxitos en la población', restriccion: 'K \\in \\{0, 1, \\dots, N\\}', min: 0, max: (p) => p.N, paso: 1, valor: 20 },
    { id: 'n', tex: 'n', nombre: 'tamaño de la muestra', restriccion: 'n \\in \\{1, 2, \\dots, N\\}', min: 1, max: (p) => p.N, paso: 1, valor: 10 },
  ],
  soporte: 'x \\in \\{\\max(0,\\, n - N + K), \\dots, \\min(n, K)\\}',
  formulas: {
    densidad: 'P(X = x) = \\frac{\\binom{K}{x} \\binom{N-K}{n-x}}{\\binom{N}{n}}',
    fda: 'F(x) = \\sum_{k \\le x} \\frac{\\binom{K}{k} \\binom{N-K}{n-k}}{\\binom{N}{n}}',
    media: 'E[X] = n \\frac{K}{N}',
    varianza: '\\operatorname{Var}(X) = n \\frac{K}{N} \\left(1 - \\frac{K}{N}\\right) \\frac{N-n}{N-1}',
  },
  notas: [
    'El factor $\\frac{N-n}{N-1}$ es la corrección por población finita: sin reemplazo, la varianza es menor que la de una binomial con $p = K/N$.',
    'Su función generadora de momentos no tiene una forma cerrada sencilla (se expresa con la función hipergeométrica).',
  ],
  superficie: { param: 'K', min: 0, max: (p) => p.N },
  calc: {
    densidad: (x, { N, K, n }) => Math.exp(lcomb(K, x) + lcomb(N - K, n - x) - lcomb(N, n)),
    rango: ({ N, K, n }) => [Math.max(0, n - N + K), Math.min(n, K)],
    media: ({ N, K, n }) => (n * K) / N,
    varianza: ({ N, K, n }) => n * (K / N) * (1 - K / N) * ((N - n) / (N - 1)),
    ajustar: (p) => ({ ...p, K: Math.min(p.K, p.N), n: Math.min(p.n, p.N) }),
  },
};
