import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'dirichlet',
  nombre: 'Dirichlet',
  tipo: 'continua',
  materia: 'probabilidad-avanzada',
  notacion: '\\mathbf{X} \\sim \\text{Dir}(\\alpha_1, \\dots, \\alpha_k)',
  descripcion:
    'Generalización multivariada de la distribución Beta sobre el símplex $\\Delta_{k-1} = \\{(x_1, \\dots, x_k) : x_i > 0,\\ \\sum_{i=1}^k x_i = 1\\}$. Modela vectores aleatorios de proporciones y es la familia conjugada de la distribución multinomial. La gráfica muestra la componente marginal $X_i \\sim \\text{Beta}(\\alpha_i,\\, \\alpha_0 - \\alpha_i)$ con $\\alpha_0 = \\sum_{j=1}^k \\alpha_j$.',
  alias: ['beta multivariada', 'simplex'],
  parametros: [
    { id: 'alpha', tex: '\\alpha_i', nombre: 'concentración de la categoría i', restriccion: '\\alpha_i > 0', min: 0.5, max: 10, paso: 0.25, valor: 2.5 },
    { id: 'resto', tex: '\\alpha_0 - \\alpha_i', nombre: 'suma del resto de categorías', restriccion: '\\alpha_0 = \\sum_{j=1}^k \\alpha_j > \\alpha_i', min: 0.5, max: 15, paso: 0.25, valor: 5.5 },
  ],
  soporte: 'x_i \\in (0, 1), \\quad \\sum_{i=1}^{k} x_i = 1',
  formulas: {
    densidad:
      'f(x_1, \\dots, x_k) = \\frac{\\Gamma(\\alpha_0)}{\\prod_{i=1}^{k} \\Gamma(\\alpha_i)}\\,\\prod_{i=1}^{k} x_i^{\\alpha_i - 1}, \\quad \\alpha_0 = \\sum_{i=1}^{k} \\alpha_i',
    media: 'E[X_i] = \\frac{\\alpha_i}{\\alpha_0}',
    varianza: '\\operatorname{Var}(X_i) = \\frac{\\alpha_i(\\alpha_0 - \\alpha_i)}{\\alpha_0^{2}(\\alpha_0 + 1)}',
  },
  extras: [
    {
      etiqueta: 'Covarianza entre componentes',
      tex: '\\operatorname{Cov}(X_i, X_j) = -\\frac{\\alpha_i\\,\\alpha_j}{\\alpha_0^{2}(\\alpha_0 + 1)}, \\quad i \\ne j',
    },
    {
      etiqueta: 'Marginal de cada componente',
      tex: 'X_i \\sim \\text{Beta}(\\alpha_i,\\, \\alpha_0 - \\alpha_i)',
    },
    {
      etiqueta: 'Construcción mediante Gammas',
      tex: 'Y_i \\perp \\text{Gamma}(\\alpha_i, \\lambda) \\implies X_i = \\frac{Y_i}{\\sum_{j=1}^{k} Y_j} \\sim \\text{Dir}(\\alpha_1, \\dots, \\alpha_k)',
    },
    {
      etiqueta: 'Propiedad de agregación',
      tex: '(X_1 + X_2, X_3, \\dots, X_k) \\sim \\text{Dir}(\\alpha_1 + \\alpha_2, \\alpha_3, \\dots, \\alpha_k)',
    },
  ],
  propiedades: [],
  notas: [
    'Con $\\alpha_1 = \\dots = \\alpha_k = 1$ se obtiene la distribución uniforme sobre el símplex $(k-1)$-dimensional.',
    'En inferencia bayesiana, si el vector de conteos sigue $\\mathbf{N} \\mid \\mathbf{p} \\sim \\text{Mult}(n, \\mathbf{p})$ y la priori es $\\mathbf{p} \\sim \\text{Dir}(\\boldsymbol{\\alpha})$, la posteriori es $\\mathbf{p} \\mid \\mathbf{N} \\sim \\text{Dir}(\\boldsymbol{\\alpha} + \\mathbf{N})$.',
  ],
  superficie: { param: 'alpha', min: 1, max: 8 },
  calc: {
    densidad: (x, { alpha, resto }) => {
      if (x <= 0) return alpha === 1 ? resto : 0;
      if (x >= 1) return resto === 1 ? alpha : 0;
      const lnB = lgamma(alpha) + lgamma(resto) - lgamma(alpha + resto);
      return Math.exp((alpha - 1) * Math.log(x) + (resto - 1) * Math.log(1 - x) - lnB);
    },
    rango: () => [0, 1],
    media: ({ alpha, resto }) => alpha / (alpha + resto),
    varianza: ({ alpha, resto }) => (alpha * resto) / ((alpha + resto) ** 2 * (alpha + resto + 1)),
  },
};
