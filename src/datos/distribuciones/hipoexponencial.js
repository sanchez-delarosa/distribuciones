/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'hipoexponencial',
  nombre: 'Hipoexponencial',
  tipo: 'continua',
  materia: 'procesos-estocasticos',
  notacion: 'X \\sim \\text{Hipoexp}(\\lambda_1, \\lambda_2)',
  descripcion:
    'Distribución de tipo fase en serie: mide el tiempo total $X = T_1 + T_2$ para completar dos etapas sucesivas e independientes con tiempos $\\text{Exp}(\\lambda_1)$ y $\\text{Exp}(\\lambda_2)$ de tasas distintas en una cadena de Markov a tiempo continuo. Su coeficiente de variación es menor que $1$ (proceso más regular que el exponencial).',
  alias: ['tipo fase serie', 'erlang generalizada'],
  parametros: [
    { id: 'lambda1', tex: '\\lambda_1', nombre: 'tasa de la etapa 1', restriccion: '\\lambda_1 > 0', min: 0.25, max: 5, paso: 0.25, valor: 1 },
    { id: 'lambda2', tex: '\\lambda_2', nombre: 'tasa de la etapa 2', restriccion: '\\lambda_2 > 0', min: 0.25, max: 5, paso: 0.25, valor: 2.5 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{\\lambda_1\\,\\lambda_2}{\\lambda_2 - \\lambda_1}\\,\\big(e^{-\\lambda_1 x} - e^{-\\lambda_2 x}\\big), \\quad \\lambda_1 \\ne \\lambda_2',
    fda: 'F(x) = 1 - \\frac{\\lambda_2}{\\lambda_2 - \\lambda_1}\\,e^{-\\lambda_1 x} + \\frac{\\lambda_1}{\\lambda_2 - \\lambda_1}\\,e^{-\\lambda_2 x}',
    supervivencia:
      'S(x) = \\frac{\\lambda_2}{\\lambda_2 - \\lambda_1}\\,e^{-\\lambda_1 x} - \\frac{\\lambda_1}{\\lambda_2 - \\lambda_1}\\,e^{-\\lambda_2 x}',
    media: 'E[X] = \\frac{1}{\\lambda_1} + \\frac{1}{\\lambda_2}',
    varianza: '\\operatorname{Var}(X) = \\frac{1}{\\lambda_1^{2}} + \\frac{1}{\\lambda_2^{2}}',
    fgm: 'M_X(t) = \\left(\\frac{\\lambda_1}{\\lambda_1 - t}\\right)\\left(\\frac{\\lambda_2}{\\lambda_2 - t}\\right), \\quad t < \\min(\\lambda_1, \\lambda_2)',
  },
  extras: [
    {
      etiqueta: 'Coeficiente de variación (subdispersión frente a Exp)',
      tex: '\\operatorname{CV}(X) = \\frac{\\sqrt{\\lambda_1^{2} + \\lambda_2^{2}}}{\\lambda_1 + \\lambda_2} \\in \\left[\\frac{1}{\\sqrt{2}},\\, 1\\right)',
    },
    {
      etiqueta: 'Moda',
      tex: '\\text{Moda}(X) = \\frac{\\ln(\\lambda_2 / \\lambda_1)}{\\lambda_2 - \\lambda_1}',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Hipoexp}(\\lambda_1 / c,\\, \\lambda_2 / c), \\quad c > 0',
    },
  ],
  notas: [
    'Cuando $\\lambda_2 \\to \\lambda_1 = \\lambda$, por la regla de L’Hôpital $f(x) \\to \\lambda^2 x e^{-\\lambda x}$, que es la distribución $\\text{Gamma}(2, \\lambda)$ (Erlang de $2$ etapas).',
    'Para $k$ etapas con tasas distintas $\\lambda_1, \\dots, \\lambda_k$, la densidad es combinación lineal $\\sum_{i=1}^k c_i \\lambda_i e^{-\\lambda_i x}$ con pesos de Lagrange $c_i = \\prod_{j \\ne i} \\frac{\\lambda_j}{\\lambda_j - \\lambda_i}$.',
  ],
  superficie: { param: 'lambda2', min: 0.5, max: 4.5 },
  calc: {
    densidad: (x, { lambda1, lambda2 }) => {
      if (x <= 0) return 0;
      if (Math.abs(lambda1 - lambda2) < 1e-6) {
        return lambda1 * lambda1 * x * Math.exp(-lambda1 * x);
      }
      return ((lambda1 * lambda2) / (lambda2 - lambda1)) * (Math.exp(-lambda1 * x) - Math.exp(-lambda2 * x));
    },
    rango: ({ lambda1, lambda2 }) => [0, 16 / Math.min(lambda1, lambda2)],
    media: ({ lambda1, lambda2 }) => 1 / lambda1 + 1 / lambda2,
    varianza: ({ lambda1, lambda2 }) => 1 / (lambda1 * lambda1) + 1 / (lambda2 * lambda2),
  },
};
