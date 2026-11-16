import { fiNormal } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'normal-gamma',
  nombre: 'Normal-Gamma (Credibilidad)',
  tipo: 'continua',
  materia: 'bayesiana',
  notacion: '(\\mu, \\tau) \\sim \\text{NG}(\\mu_0, \\kappa_0, \\alpha, \\beta)',
  descripcion:
    'Familia conjugada conjunta para la media $\\mu$ y la precisión $\\tau = 1/\\sigma^2$ de un modelo normal, donde $\\tau \\sim \\text{Gamma}(\\alpha, \\beta)$ y $\\mu \\mid \\tau \\sim N\\big(\\mu_0,\\, (\\kappa_0\\tau)^{-1}\\big)$. Sintetiza el **modelo de credibilidad de Bühlmann** Normal–Normal donde $\\kappa_0$ actúa como el número equivalente de observaciones previas. La gráfica muestra la distribución de $\\mu \\mid \\tau$.',
  alias: ['buhlmann', 'credibilidad normal', 'normal-gamma inversa'],
  parametros: [
    { id: 'mu0', tex: '\\mu_0', nombre: 'media colectiva a priori', restriccion: '\\mu_0 \\in \\mathbb{R}', min: -5, max: 5, paso: 0.25, valor: 0 },
    { id: 'kappa0', tex: '\\kappa_0', nombre: 'tamaño muestral virtual previo', restriccion: '\\kappa_0 > 0', min: 0.5, max: 10, paso: 0.5, valor: 2 },
    { id: 'tau', tex: '\\tau', nombre: 'precisión condicional (1/σ²)', restriccion: '\\tau > 0', min: 0.25, max: 5, paso: 0.25, valor: 1 },
  ],
  soporte: '(\\mu, \\tau) \\in \\mathbb{R} \\times (0, \\infty)',
  formulas: {
    densidad:
      'f(\\mu, \\tau) = f_{N\\!\\big(\\mu_0,\\, (\\kappa_0\\tau)^{-1}\\big)}(\\mu)\\,f_{\\text{Gamma}(\\alpha, \\beta)}(\\tau) = \\frac{\\beta^{\\alpha}\\sqrt{\\kappa_0}}{\\Gamma(\\alpha)\\sqrt{2\\pi}}\\,\\tau^{\\alpha - 1/2}\\,\\exp\\!\\left[-\\tau\\left(\\beta + \\frac{\\kappa_0(\\mu - \\mu_0)^{2}}{2}\\right)\\right]',
    media: 'E[\\mu] = \\mu_0, \\qquad E[\\tau] = \\frac{\\alpha}{\\beta}',
    varianza: '\\operatorname{Var}(\\mu \\mid \\tau) = \\frac{1}{\\kappa_0\\tau}, \\qquad \\operatorname{Var}(\\mu) = \\frac{\\beta}{\\kappa_0(\\alpha - 1)}\\ (\\alpha > 1)',
  },
  extras: [
    {
      etiqueta: 'Actualización de hiperparámetros con n observaciones',
      tex: '\\kappa_n = \\kappa_0 + n, \\qquad \\mu_n = \\frac{n}{\\kappa_0 + n}\\,\\bar{x} + \\frac{\\kappa_0}{\\kappa_0 + n}\\,\\mu_0',
    },
    {
      etiqueta: 'Factor de credibilidad de Bühlmann',
      tex: 'Z = \\frac{n}{n + \\kappa_0}, \\qquad \\kappa_0 = \\frac{E[\\operatorname{Var}(X \\mid \\Theta)]}{\\operatorname{Var}(E[X \\mid \\Theta])} = \\frac{\\sigma^{2}}{\\tau_0^{2}}',
    },
    {
      etiqueta: 'Marginal de μ al integrar τ',
      tex: '\\mu \\sim t_{2\\alpha}\\!\\left(\\mu_0,\\; \\frac{\\beta}{\\alpha\\,\\kappa_0}\\right)',
    },
  ],
  propiedades: [],
  notas: [
    'La fórmula de actualización de la media posterior $\\mu_n = Z\\,\\bar{x} + (1 - Z)\\mu_0$ con $Z = \\frac{n}{n + \\kappa_0}$ demuestra que en la familia Normal–Normal el estimador lineal de credibilidad de Bühlmann coincide exactamente con la esperanza condicional bayesiana $E[\\mu \\mid \\mathbf{X}]$.',
  ],
  superficie: { param: 'kappa0', min: 0.5, max: 8 },
  calc: {
    densidad: (x, { mu0, kappa0, tau }) => {
      const s = 1 / Math.sqrt(kappa0 * tau);
      return fiNormal((x - mu0) / s) / s;
    },
    rango: ({ mu0, kappa0, tau }) => {
      const s = 1 / Math.sqrt(kappa0 * tau);
      return [mu0 - 6 * s, mu0 + 6 * s];
    },
    media: ({ mu0 }) => mu0,
    varianza: ({ kappa0, tau }) => 1 / (kappa0 * tau),
  },
};
