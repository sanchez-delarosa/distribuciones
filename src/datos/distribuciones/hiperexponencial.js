/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'hiperexponencial',
  nombre: 'Hiperexponencial',
  tipo: 'continua',
  materia: 'procesos-estocasticos',
  notacion: 'X \\sim \\text{Hiperexp}(p, \\lambda_1, \\lambda_2)',
  descripcion:
    'Distribución de tipo fase en paralelo (mezcla finita de exponenciales): en teoría de colas ($M/H_2/1$) modela tiempos de atención donde con probabilidad $p$ el cliente requiere un servicio de tasa $\\lambda_1$ y con probabilidad $1 - p$ uno de tasa $\\lambda_2$. Presenta coeficiente de variación mayor o igual a $1$ y tasa de riesgo decreciente.',
  alias: ['tipo fase paralelo', 'mezcla de exponenciales', 'h2'],
  parametros: [
    { id: 'p', tex: 'p', nombre: 'probabilidad de la rama 1', restriccion: 'p \\in (0, 1)', min: 0.05, max: 0.95, paso: 0.05, valor: 0.4 },
    { id: 'lambda1', tex: '\\lambda_1', nombre: 'tasa de la rama 1', restriccion: '\\lambda_1 > 0', min: 0.25, max: 5, paso: 0.25, valor: 0.8 },
    { id: 'lambda2', tex: '\\lambda_2', nombre: 'tasa de la rama 2', restriccion: '\\lambda_2 > 0', min: 0.25, max: 5, paso: 0.25, valor: 2.5 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = p\\,\\lambda_1 e^{-\\lambda_1 x} + (1 - p)\\,\\lambda_2 e^{-\\lambda_2 x}',
    fda: 'F(x) = 1 - p\\,e^{-\\lambda_1 x} - (1 - p)\\,e^{-\\lambda_2 x}',
    supervivencia: 'S(x) = p\\,e^{-\\lambda_1 x} + (1 - p)\\,e^{-\\lambda_2 x}',
    riesgo:
      'h(x) = \\frac{p\\,\\lambda_1 e^{-\\lambda_1 x} + (1 - p)\\,\\lambda_2 e^{-\\lambda_2 x}}{p\\,e^{-\\lambda_1 x} + (1 - p)\\,e^{-\\lambda_2 x}} \\quad (\\text{decreciente})',
    media: 'E[X] = \\frac{p}{\\lambda_1} + \\frac{1 - p}{\\lambda_2}',
    varianza:
      '\\operatorname{Var}(X) = 2\\left(\\frac{p}{\\lambda_1^{2}} + \\frac{1 - p}{\\lambda_2^{2}}\\right) - \\left(\\frac{p}{\\lambda_1} + \\frac{1 - p}{\\lambda_2}\\right)^{2}',
    fgm: 'M_X(t) = p\\,\\frac{\\lambda_1}{\\lambda_1 - t} + (1 - p)\\,\\frac{\\lambda_2}{\\lambda_2 - t}, \\quad t < \\min(\\lambda_1, \\lambda_2)',
  },
  extras: [
    {
      etiqueta: 'Momentos de orden k',
      tex: 'E[X^{k}] = k!\\left(\\frac{p}{\\lambda_1^{k}} + \\frac{1 - p}{\\lambda_2^{k}}\\right)',
    },
    {
      etiqueta: 'Sobredispersión (CV ≥ 1)',
      tex: '\\operatorname{CV}(X) \\ge 1 \\quad (\\text{con igualdad si y sólo si } \\lambda_1 = \\lambda_2)',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Hiperexp}(p,\\, \\lambda_1 / c,\\, \\lambda_2 / c), \\quad c > 0',
    },
  ],
  notas: [
    'La tasa de riesgo $h(x)$ es estrictamente decreciente cuando $\\lambda_1 \\ne \\lambda_2$ y tiende asintóticamente a $\\min(\\lambda_1, \\lambda_2)$ cuando $x \\to \\infty$, porque la supervivencia a largo plazo queda dominada por el grupo de menor tasa de salida.',
  ],
  superficie: { param: 'p', min: 0.05, max: 0.95 },
  calc: {
    densidad: (x, { p, lambda1, lambda2 }) => {
      if (x < 0) return 0;
      return p * lambda1 * Math.exp(-lambda1 * x) + (1 - p) * lambda2 * Math.exp(-lambda2 * x);
    },
    rango: ({ lambda1, lambda2 }) => [0, 16 / Math.min(lambda1, lambda2)],
    media: ({ p, lambda1, lambda2 }) => p / lambda1 + (1 - p) / lambda2,
    varianza: ({ p, lambda1, lambda2 }) => {
      const m1 = p / lambda1 + (1 - p) / lambda2;
      const m2 = 2 * (p / (lambda1 * lambda1) + (1 - p) / (lambda2 * lambda2));
      return m2 - m1 * m1;
    },
  },
};
