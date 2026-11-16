import { fiNormal } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'normal-estandar',
  nombre: 'Normal estándar',
  tipo: 'continua',
  notacion: 'Z \\sim N(0, 1)',
  descripcion:
    'Normal con media $0$ y varianza $1$. Sus probabilidades $\\Phi(z)$ están tabuladas y sirven para calcular las de cualquier normal mediante la estandarización.',
  alias: ['z', 'normal tipificada', 'gaussiana estandar'],
  parametros: [],
  soporte: 'z \\in \\mathbb{R}',
  formulas: {
    densidad: '\\phi(z) = \\frac{1}{\\sqrt{2\\pi}}\\, e^{-z^{2}/2}',
    fda: '\\Phi(z) = \\int_{-\\infty}^{z} \\phi(t)\\, dt',
    media: 'E[Z] = 0',
    varianza: '\\operatorname{Var}(Z) = 1',
    fgm: 'M_Z(t) = e^{t^{2}/2}',
  },
  extras: [
    { etiqueta: 'Simetría', tex: '\\Phi(-z) = 1 - \\Phi(z)' },
    { etiqueta: 'Momentos pares', tex: 'E[Z^{2k}] = (2k - 1)!! = 1 \\cdot 3 \\cdot 5 \\cdots (2k - 1)' },
    { etiqueta: 'Valor en riesgo', tex: '\\operatorname{VaR}_{\\alpha}(Z) = z_{\\alpha} = \\Phi^{-1}(\\alpha)' },
    { etiqueta: 'TVaR', tex: '\\operatorname{TVaR}_{\\alpha}(Z) = \\frac{\\phi(z_{\\alpha})}{1 - \\alpha}' },
  ],
  notas: ['Los momentos impares valen $0$ por simetría.'],
  calc: {
    densidad: (z) => fiNormal(z),
    rango: () => [-10, 10],
    media: () => 0,
    varianza: () => 1,
  },
};
