import { lcomb } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'hipergeometrica-negativa',
  nombre: 'Hipergeométrica negativa',
  tipo: 'discreta',
  materia: 'inferencia',
  notacion: 'X \\sim \\text{HiperNeg}(N, K, r)',
  descripcion:
    'En una población finita de $N$ elementos con $K$ éxitos y $N - K$ fracasos, cuenta el número de fracasos $X$ observados antes de obtener el $r$-ésimo éxito en un muestreo sin reemplazo (muestreo inverso para estimar proporciones o tamaños poblacionales por captura-recaptura).',
  alias: ['muestreo inverso', 'beta-binomial'],
  parametros: [
    { id: 'N', tex: 'N', nombre: 'tamaño de la población', restriccion: 'N \\in \\{1, 2, \\dots\\}', min: 10, max: 100, paso: 1, valor: 30 },
    { id: 'K', tex: 'K', nombre: 'éxitos en la población', restriccion: 'K \\in \\{1, \\dots, N\\}', min: 2, max: (p) => p.N - 1, paso: 1, valor: 12 },
    { id: 'r', tex: 'r', nombre: 'éxitos requeridos', restriccion: 'r \\in \\{1, \\dots, K\\}', min: 1, max: (p) => p.K, paso: 1, valor: 4 },
  ],
  soporte: 'x \\in \\{0, 1, \\dots, N - K\\}',
  formulas: {
    densidad:
      'P(X = x) = \\frac{\\binom{x + r - 1}{r - 1}\\binom{N - r - x}{K - r}}{\\binom{N}{K}}',
    media: 'E[X] = r\\,\\frac{N - K}{K + 1}',
    varianza:
      '\\operatorname{Var}(X) = r\\,\\frac{(N + 1)(N - K)}{(K + 1)(K + 2)}\\left(1 - \\frac{r}{K + 1}\\right)',
  },
  extras: [
    {
      etiqueta: 'Total de extracciones hasta el r-ésimo éxito',
      tex: 'Y = X + r \\implies E[Y] = r\\,\\frac{N + 1}{K + 1}',
    },
    {
      etiqueta: 'Equivalencia con Beta-Binomial',
      tex: 'P(X = x) = \\binom{N - K}{x}\\frac{\\operatorname{B}(x + r,\\, N - K - x + K - r + 1)}{\\operatorname{B}(r,\\, K - r + 1)}',
    },
  ],
  propiedades: [],
  notas: [
    'Cuando $N, K \\to \\infty$ con $K/N \\to p$, el muestreo sin reemplazo converge al muestreo con reemplazo y $\\text{HiperNeg}(N, K, r) \\xrightarrow{d} \\text{BN}_F(r, p)$.',
    'En captura-recaptura con $K$ individuos marcados y muestreo inverso hasta recapturar $r$ marcados, $\\hat{N} = \\frac{K + 1}{r}(X + r) - 1$ es un estimador insesgado del tamaño poblacional $N$.',
  ],
  superficie: { param: 'r', min: 1, max: (p) => p.K },
  calc: {
    ajustar: (p) => {
      const K = Math.min(p.K, p.N - 1);
      const r = Math.min(p.r, K);
      return { ...p, K, r };
    },
    densidad: (x, { N, K, r }) => {
      if (!Number.isInteger(x) || x < 0 || x > N - K) return 0;
      return Math.exp(lcomb(x + r - 1, r - 1) + lcomb(N - r - x, K - r) - lcomb(N, K));
    },
    rango: ({ N, K }) => [0, N - K],
    media: ({ N, K, r }) => (r * (N - K)) / (K + 1),
    varianza: ({ N, K, r }) =>
      ((r * (N + 1) * (N - K)) / ((K + 1) * (K + 2))) * (1 - r / (K + 1)),
  },
};
