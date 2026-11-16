/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'rayleigh',
  nombre: 'Rayleigh',
  tipo: 'continua',
  materia: 'procesos-estocasticos',
  notacion: 'X \\sim \\text{Rayleigh}(\\sigma)',
  descripcion:
    'Distribución de la norma euclidiana $R = \\sqrt{X_1^2 + X_2^2}$ de un vector con componentes independientes $X_1, X_2 \\sim N(0, \\sigma^2)$, como la distancia al origen de un movimiento browniano bidimensional en el instante $t$ ($\\sigma = \\sqrt{t}$). Es además la pieza radial de la transformación de **Box–Muller** para simular variables normales.',
  alias: ['box-muller', 'norma radial'],
  parametros: [
    { id: 'sigma', tex: '\\sigma', nombre: 'escala', restriccion: '\\sigma > 0', min: 0.25, max: 5, paso: 0.25, valor: 1.5 },
  ],
  soporte: 'x \\in [0, \\infty)',
  formulas: {
    densidad: 'f(x) = \\frac{x}{\\sigma^{2}}\\,\\exp\\!\\left(-\\frac{x^{2}}{2\\sigma^{2}}\\right)',
    fda: 'F(x) = 1 - \\exp\\!\\left(-\\frac{x^{2}}{2\\sigma^{2}}\\right)',
    supervivencia: 'S(x) = \\exp\\!\\left(-\\frac{x^{2}}{2\\sigma^{2}}\\right)',
    riesgo: 'h(x) = \\frac{x}{\\sigma^{2}} \\quad (\\text{crecimiento lineal})',
    media: 'E[X] = \\sigma\\sqrt{\\frac{\\pi}{2}} \\approx 1.2533\\,\\sigma',
    varianza: '\\operatorname{Var}(X) = \\frac{4 - \\pi}{2}\\,\\sigma^{2} \\approx 0.4292\\,\\sigma^{2}',
  },
  extras: [
    {
      etiqueta: 'Transformación de Box–Muller (simulación)',
      tex: 'R \\sim \\text{Rayleigh}(1) = \\sqrt{-2\\ln U_1},\\; \\Theta \\sim \\text{Uniforme}(0, 2\\pi) \\implies (R\\cos\\Theta,\\, R\\sin\\Theta) \\sim N_2(\\mathbf{0}, \\mathbf{I})',
    },
    {
      etiqueta: 'Moda y mediana',
      tex: '\\text{Moda}(X) = \\sigma, \\qquad \\text{Med}(X) = \\sigma\\sqrt{2\\ln 2}',
    },
    {
      etiqueta: 'Momentos de orden k',
      tex: 'E[X^{k}] = \\sigma^{k}\\,2^{k/2}\\,\\Gamma\\!\\left(1 + \\frac{k}{2}\\right)',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Rayleigh}(c\\sigma), \\quad c > 0',
    },
    {
      letra: 'M',
      detalle: 'X_i \\perp \\text{Rayleigh}(\\sigma_i) \\Rightarrow \\min_i X_i \\sim \\text{Rayleigh}\\!\\left(\\Big(\\sum_i \\sigma_i^{-2}\\Big)^{-1/2}\\right)',
    },
    {
      letra: 'V',
      detalle: 'X = \\sigma\\sqrt{-2\\ln U}, \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Es el caso particular de la distribución $\\text{Weibull}(\\tau, \\lambda)$ con forma $\\tau = 2$ y $\\lambda = \\frac{1}{\\sqrt{2}\\,\\sigma}$.',
  ],
  superficie: { param: 'sigma', min: 0.5, max: 4 },
  calc: {
    densidad: (x, { sigma }) => {
      if (x < 0) return 0;
      const s2 = sigma * sigma;
      return (x / s2) * Math.exp((-x * x) / (2 * s2));
    },
    rango: ({ sigma }) => [0, 6 * sigma],
    media: ({ sigma }) => sigma * Math.sqrt(Math.PI / 2),
    varianza: ({ sigma }) => ((4 - Math.PI) / 2) * sigma * sigma,
  },
};
