import { lcomb } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'multinomial',
  nombre: 'Multinomial',
  tipo: 'discreta',
  materia: 'probabilidad-avanzada',
  notacion: '\\mathbf{X} \\sim \\text{Mult}(n, \\mathbf{p})',
  descripcion:
    'Generalización multivariada de la distribución binomial: en $n$ ensayos independientes donde cada ensayo cae en una de $k$ categorías mutuamente excluyentes con probabilidades $p_1, \\dots, p_k$ ($\\sum_{i=1}^k p_i = 1$), el vector $\\mathbf{X} = (X_1, \\dots, X_k)$ cuenta las frecuencias de cada categoría. La gráfica muestra la distribución marginal $X_i \\sim \\text{Bin}(n, p_i)$.',
  alias: ['polinomial', 'multivariada discreta'],
  parametros: [
    { id: 'n', tex: 'n', nombre: 'número de ensayos', restriccion: 'n \\in \\{1, 2, \\dots\\}', min: 1, max: 50, paso: 1, valor: 12 },
    { id: 'p', tex: 'p_i', nombre: 'probabilidad de la categoría i', restriccion: 'p_i \\in (0, 1),\\ \\sum_{i=1}^{k} p_i = 1', min: 0.05, max: 0.95, paso: 0.05, valor: 0.35 },
  ],
  soporte: 'x_i \\in \\{0, 1, \\dots, n\\}, \\quad \\sum_{i=1}^{k} x_i = n',
  formulas: {
    densidad:
      'P(X_1 = x_1, \\dots, X_k = x_k) = \\frac{n!}{x_1!\\cdots x_k!}\\, p_1^{x_1}\\cdots p_k^{x_k}',
    media: 'E[X_i] = n\\,p_i',
    varianza: '\\operatorname{Var}(X_i) = n\\,p_i(1 - p_i)',
    fgm: 'M_{\\mathbf{X}}(t_1, \\dots, t_k) = \\left(\\sum_{i=1}^{k} p_i\\,e^{t_i}\\right)^{n}',
    fgp: 'G_{\\mathbf{X}}(s_1, \\dots, s_k) = \\left(\\sum_{i=1}^{k} p_i\\,s_i\\right)^{n}',
  },
  extras: [
    {
      etiqueta: 'Covarianza entre categorías',
      tex: '\\operatorname{Cov}(X_i, X_j) = -n\\,p_i\\,p_j, \\quad i \\ne j',
    },
    {
      etiqueta: 'Correlación entre categorías',
      tex: '\\rho(X_i, X_j) = -\\sqrt{\\frac{p_i\\,p_j}{(1 - p_i)(1 - p_j)}}, \\quad i \\ne j',
    },
    {
      etiqueta: 'Distribución marginal',
      tex: 'X_i \\sim \\text{Bin}(n, p_i)',
    },
    {
      etiqueta: 'Distribución condicional',
      tex: 'X_i \\mid X_j = x_j \\sim \\text{Bin}\\!\\left(n - x_j,\\; \\frac{p_i}{1 - p_j}\\right)',
    },
  ],
  propiedades: [
    {
      letra: 'C',
      detalle: '\\mathbf{X} \\sim \\text{Mult}(n_1, \\mathbf{p}),\\ \\mathbf{Y} \\sim \\text{Mult}(n_2, \\mathbf{p}) \\Rightarrow \\mathbf{X} + \\mathbf{Y} \\sim \\text{Mult}(n_1 + n_2, \\mathbf{p})',
    },
  ],
  notas: [
    'Al agrupar cualquier subconjunto de categorías se conserva la estructura multinomial sumando sus probabilidades.',
    'Si $N_1, \\dots, N_k$ son independientes con $N_i \\sim \\text{Poisson}(\\lambda_i)$, entonces dado $\\sum_{i=1}^k N_i = n$, el vector $(N_1, \\dots, N_k)$ sigue una distribución $\\text{Mult}(n;\\, p_1, \\dots, p_k)$ con $p_i = \\lambda_i / \\sum_j \\lambda_j$.',
  ],
  superficie: { param: 'p', min: 0.05, max: 0.95 },
  calc: {
    densidad: (x, { n, p }) => {
      if (x < 0 || x > n || !Number.isInteger(x)) return 0;
      return Math.exp(lcomb(n, x) + x * Math.log(p) + (n - x) * Math.log(1 - p));
    },
    rango: ({ n }) => [0, n],
    media: ({ n, p }) => n * p,
    varianza: ({ n, p }) => n * p * (1 - p),
  },
};
