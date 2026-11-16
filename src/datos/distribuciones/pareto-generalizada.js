/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'pareto-generalizada',
  nombre: 'Pareto generalizada',
  tipo: 'continua',
  materia: 'teoria-del-riesgo',
  notacion: 'X \\sim \\text{GPD}(\\xi, \\beta)',
  descripcion:
    'Distribución límite universal de los excesos $Y = X - d \\mid X > d$ sobre un umbral alto $d$ según el teorema de Pickands–Balkema–de Haan. Es la herramienta central para tarificar contratos de reaseguro de exceso de pérdida (*excess-of-loss*) y estimar cuantiles extremos ($\\operatorname{VaR}$ y $\\operatorname{TVaR}$).',
  alias: ['gpd', 'pickands', 'balkema-de haan', 'picos sobre umbral', 'pot'],
  parametros: [
    { id: 'xi', tex: '\\xi', nombre: 'índice de cola (forma)', restriccion: '\\xi \\in \\mathbb{R}\\ (\\xi \\ge 0 \\text{ cola pesada})', min: 0.05, max: 0.45, paso: 0.05, valor: 0.1 },
    { id: 'beta', tex: '\\beta', nombre: 'escala', restriccion: '\\beta > 0', min: 0.5, max: 10, paso: 0.5, valor: 2 },
  ],
  soporte: 'x \\in [0, \\infty) \\text{ si } \\xi \\ge 0; \\quad x \\in [0, -\\beta/\\xi] \\text{ si } \\xi < 0',
  formulas: {
    densidad:
      'f(x) = \\frac{1}{\\beta}\\left(1 + \\frac{\\xi\\,x}{\\beta}\\right)^{-(1/\\xi + 1)}',
    fda: 'F(x) = 1 - \\left(1 + \\frac{\\xi\\,x}{\\beta}\\right)^{-1/\\xi}',
    supervivencia: 'S(x) = \\left(1 + \\frac{\\xi\\,x}{\\beta}\\right)^{-1/\\xi}',
    riesgo: 'h(x) = \\frac{1}{\\beta + \\xi\\,x}',
    media: 'E[X] = \\frac{\\beta}{1 - \\xi}, \\quad \\xi < 1',
    varianza: '\\operatorname{Var}(X) = \\frac{\\beta^{2}}{(1 - \\xi)^{2}(1 - 2\\xi)}, \\quad \\xi < \\frac{1}{2}',
  },
  extras: [
    {
      etiqueta: 'Exceso medio lineal sobre el umbral d',
      tex: 'e(d) = E[X - d \\mid X > d] = \\frac{\\beta + \\xi\\,d}{1 - \\xi}, \\quad \\xi < 1',
    },
    {
      etiqueta: 'Estabilidad bajo excesos (invarianza POT)',
      tex: 'X - d \\mid X > d \\sim \\text{GPD}(\\xi,\\, \\beta + \\xi\\,d)',
    },
    {
      etiqueta: 'Valor en riesgo (VaR) y TVaR',
      tex: '\\operatorname{VaR}_p(X) = \\frac{\\beta}{\\xi}\\big[(1 - p)^{-\\xi} - 1\\big], \\quad \\operatorname{TVaR}_p(X) = \\frac{\\operatorname{VaR}_p(X) + \\beta - \\xi\\,0}{1 - \\xi}',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{GPD}(\\xi,\\, c\\beta), \\quad c > 0',
    },
    {
      letra: 'R',
      detalle: 'X - d \\mid X > d \\sim \\text{GPD}(\\xi,\\, \\beta + \\xi\\,d)',
    },
    {
      letra: 'V',
      detalle: 'X = \\frac{\\beta}{\\xi}\\,(U^{-\\xi} - 1), \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Unifica tres regímenes de cola: para $\\xi > 0$ es una reparametrización de $\\text{Pareto}_{II}(\\alpha = 1/\\xi,\\, \\theta = \\beta/\\xi)$; cuando $\\xi \\to 0$ converge a $\\text{Exp}(1/\\beta)$; y para $\\xi = -1$ es $\\text{Uniforme}(0, \\beta)$.',
    'La linealidad de la función de exceso medio empírica $e_n(d)$ respecto al umbral $d$ es la gráfica diagnóstica estándar para elegir el umbral de reaseguro.',
  ],
  superficie: { param: 'xi', min: 0.05, max: 0.45 },
  calc: {
    densidad: (x, { xi, beta }) => {
      if (x < 0) return 0;
      if (Math.abs(xi) < 1e-6) return Math.exp(-x / beta) / beta;
      const u = 1 + (xi * x) / beta;
      if (u <= 0) return 0;
      return Math.pow(u, -(1 / xi + 1)) / beta;
    },
    rango: ({ beta }) => [0, 32 * beta],
    rangoGrafica: ({ beta }) => [0, 8 * beta],
    media: ({ xi, beta }) => (xi < 1 ? beta / (1 - xi) : Infinity),
    varianza: ({ xi, beta }) => (xi < 0.5 ? (beta * beta) / ((1 - xi) ** 2 * (1 - 2 * xi)) : Infinity),
  },
};
