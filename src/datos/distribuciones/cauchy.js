/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'cauchy',
  nombre: 'Cauchy',
  tipo: 'continua',
  materia: 'probabilidad-avanzada',
  notacion: 'X \\sim \\text{Cauchy}(x_0, \\gamma)',
  descripcion:
    'Distribución continua simétrica de colas tan pesadas ($f(x) \\propto x^{-2}$) que la integral de $|x|f(x)$ diverge: no tiene media, varianza ni momentos de ningún orden entero. Surge como el cociente de dos normales estándar independientes y como el caso $t(1)$.',
  alias: ['lorentz', 'breit-wigner'],
  parametros: [
    { id: 'x0', tex: 'x_0', nombre: 'localización (mediana)', restriccion: 'x_0 \\in \\mathbb{R}', min: -5, max: 5, paso: 0.25, valor: 0 },
    { id: 'gamma', tex: '\\gamma', nombre: 'escala (semiancho intercuartílico)', restriccion: '\\gamma > 0', min: 0.25, max: 5, paso: 0.25, valor: 1 },
  ],
  soporte: 'x \\in (-\\infty, \\infty)',
  formulas: {
    densidad: 'f(x) = \\frac{1}{\\pi\\,\\gamma\\left[1 + \\left(\\frac{x - x_0}{\\gamma}\\right)^{2}\\right]}',
    fda: 'F(x) = \\frac{1}{2} + \\frac{1}{\\pi}\\arctan\\!\\left(\\frac{x - x_0}{\\gamma}\\right)',
    media: '\\text{No existe } \\big(\\int_{-\\infty}^{\\infty} |x|\\,f(x)\\,dx = \\infty\\big)',
    varianza: '\\text{No existe}',
    fgm: '\\text{No existe para } t \\ne 0 \\quad \\big(\\varphi_X(t) = e^{i x_0 t - \\gamma |t|}\\big)',
  },
  extras: [
    {
      etiqueta: 'Mediana y moda',
      tex: '\\text{Med}(X) = \\text{Moda}(X) = x_0',
    },
    {
      etiqueta: 'Cuantiles (VaR)',
      tex: 'F^{-1}(p) = x_0 + \\gamma\\,\\tan\\!\\left(\\pi\\Big(p - \\frac{1}{2}\\Big)\\right)',
    },
    {
      etiqueta: 'Promedio muestral',
      tex: '\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^{n} X_i \\sim \\text{Cauchy}(x_0, \\gamma) \\quad (\\text{no converge a una constante})',
    },
  ],
  propiedades: [
    {
      letra: 'C',
      detalle: 'X_i \\sim \\text{Cauchy}(x_{0,i}, \\gamma_i) \\Rightarrow \\sum_i X_i \\sim \\text{Cauchy}\\!\\Big(\\sum_i x_{0,i},\\, \\sum_i \\gamma_i\\Big)',
    },
    {
      letra: 'L',
      detalle: 'aX + b \\sim \\text{Cauchy}(a x_0 + b,\\, |a|\\gamma)',
    },
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Cauchy}(c x_0,\\, c\\gamma), \\quad c > 0',
    },
    {
      letra: 'I',
      detalle: 'X \\sim \\text{Cauchy}(0, \\gamma) \\Rightarrow \\frac{1}{X} \\sim \\text{Cauchy}\\!\\left(0, \\frac{1}{\\gamma}\\right)',
    },
    {
      letra: 'V',
      detalle: 'X = x_0 + \\gamma\\,\\tan\\!\\big(\\pi(U - 1/2)\\big), \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Es el contraejemplo clásico a la ley débil de los grandes números: el promedio $\\bar{X}_n$ de $n$ observaciones independientes tiene exactamente la misma distribución $\\text{Cauchy}(x_0, \\gamma)$ que una sola observación.',
    'Es una distribución estable con índice de estabilidad $\\alpha = 1$.',
  ],
  superficie: { param: 'gamma', min: 0.5, max: 4 },
  calc: {
    densidad: (x, { x0, gamma }) => {
      const z = (x - x0) / gamma;
      return 1 / (Math.PI * gamma * (1 + z * z));
    },
    rango: ({ x0, gamma }) => [x0 - 450 * gamma, x0 + 450 * gamma],
    rangoGrafica: ({ x0, gamma }) => [x0 - 10 * gamma, x0 + 10 * gamma],
    media: () => NaN,
    varianza: () => NaN,
  },
};
