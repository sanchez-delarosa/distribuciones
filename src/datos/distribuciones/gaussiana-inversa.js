/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'gaussiana-inversa',
  nombre: 'Gaussiana inversa',
  tipo: 'continua',
  materia: 'procesos-estocasticos',
  notacion: 'X \\sim \\text{IG}(\\mu, \\lambda)',
  descripcion:
    'También llamada distribución de Wald: es la distribución exacta del **tiempo de primer paso** $T_a = \\inf\\{t > 0 : B_t + \\nu t = a\\}$ que tarda un movimiento browniano con deriva positiva $\\nu > 0$ en alcanzar una barrera $a > 0$ (con $\\mu = a/\\nu$ y $\\lambda = a^2$). Es fundamental en teoría de ruina continua, riesgo de crédito estructural y procesos de Lévy.',
  alias: ['wald', 'tiempo de primer paso', 'browniano con deriva'],
  parametros: [
    { id: 'mu', tex: '\\mu', nombre: 'media', restriccion: '\\mu > 0', min: 0.5, max: 8, paso: 0.25, valor: 2 },
    { id: 'lambda', tex: '\\lambda', nombre: 'forma (precisión)', restriccion: '\\lambda > 0', min: 0.5, max: 20, paso: 0.5, valor: 6 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\sqrt{\\frac{\\lambda}{2\\pi x^{3}}}\\,\\exp\\!\\left[-\\frac{\\lambda(x - \\mu)^{2}}{2\\mu^{2} x}\\right]',
    fda: 'F(x) = \\Phi\\!\\left(\\sqrt{\\frac{\\lambda}{x}}\\left(\\frac{x}{\\mu} - 1\\right)\\right) + e^{2\\lambda/\\mu}\\,\\Phi\\!\\left(-\\sqrt{\\frac{\\lambda}{x}}\\left(\\frac{x}{\\mu} + 1\\right)\\right)',
    media: 'E[X] = \\mu',
    varianza: '\\operatorname{Var}(X) = \\frac{\\mu^{3}}{\\lambda}',
    fgm: 'M_X(t) = \\exp\\!\\left[\\frac{\\lambda}{\\mu}\\left(1 - \\sqrt{1 - \\frac{2\\mu^{2}t}{\\lambda}}\\right)\\right], \\quad t \\le \\frac{\\lambda}{2\\mu^{2}}',
  },
  extras: [
    {
      etiqueta: 'Transformación exacta a Chi-cuadrada (Shuster)',
      tex: 'X \\sim \\text{IG}(\\mu, \\lambda) \\implies \\frac{\\lambda(X - \\mu)^{2}}{\\mu^{2} X} \\sim \\chi^{2}(1)',
    },
    {
      etiqueta: 'Moda',
      tex: '\\text{Moda}(X) = \\mu\\left[\\sqrt{1 + \\frac{9\\mu^{2}}{4\\lambda^{2}}} - \\frac{3\\mu}{2\\lambda}\\right]',
    },
    {
      etiqueta: 'Asimetría y exceso de curtosis',
      tex: '\\gamma_1 = 3\\sqrt{\\frac{\\mu}{\\lambda}}, \\qquad \\gamma_2 = \\frac{15\\mu}{\\lambda}',
    },
  ],
  propiedades: [
    {
      letra: 'C',
      detalle: 'X_i \\perp \\text{IG}(\\mu_i,\\, c\\mu_i^{2}) \\Rightarrow \\sum_i X_i \\sim \\text{IG}\\!\\Big(\\sum_i \\mu_i,\\; c\\Big(\\sum_i \\mu_i\\Big)^{2}\\Big)',
    },
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{IG}(c\\mu,\\, c\\lambda), \\quad c > 0',
    },
  ],
  notas: [
    'La propiedad $\\frac{\\lambda(X - \\mu)^2}{\\mu^2 X} \\sim \\chi^2(1)$ permite simular exactamente variables $\\text{IG}(\\mu, \\lambda)$ en tiempo constante a partir de una normal estándar $Z$ y una uniforme $U$ (algoritmo de Michael–Schucany–Haas).',
    'Pertenece a la familia de Tweedie con potencia de varianza $p = 3$ ($\\operatorname{Var}(X) \\propto \\mu^3$).',
  ],
  superficie: { param: 'lambda', min: 1, max: 16 },
  calc: {
    densidad: (x, { mu, lambda }) => {
      if (x <= 0) return 0;
      return Math.sqrt(lambda / (2 * Math.PI * x * x * x)) * Math.exp((-lambda * (x - mu) * (x - mu)) / (2 * mu * mu * x));
    },
    rango: ({ mu, lambda }) => [0, mu + 12 * Math.sqrt((mu * mu * mu) / lambda) + 6],
    media: ({ mu }) => mu,
    varianza: ({ mu, lambda }) => (mu * mu * mu) / lambda,
  },
};
