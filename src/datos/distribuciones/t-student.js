import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 't-student',
  nombre: 't de Student',
  tipo: 'continua',
  materia: 'probabilidad-avanzada',
  notacion: 'X \\sim t(\\nu)',
  descripcion:
    'Distribución continua simétrica de colas polinomiales definida como el cociente entre una normal estándar $Z \\sim N(0, 1)$ y la raíz escalada de una chi-cuadrada independiente $\\sqrt{V/\\nu}$ con $V \\sim \\chi^2(\\nu)$. Es fundamental tanto en inferencia sobre medias con varianza desconocida como para modelar rendimientos financieros de cola pesada.',
  alias: ['student', 't', 'gosset', 'cauchy'],
  parametros: [
    { id: 'nu', tex: '\\nu', nombre: 'grados de libertad', restriccion: '\\nu > 0', min: 1, max: 40, paso: 1, valor: 6 },
  ],
  soporte: 'x \\in (-\\infty, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{\\Gamma\\!\\left(\\frac{\\nu + 1}{2}\\right)}{\\sqrt{\\nu\\pi}\\;\\Gamma\\!\\left(\\frac{\\nu}{2}\\right)}\\left(1 + \\frac{x^{2}}{\\nu}\\right)^{-(\\nu + 1)/2}',
    fda: 'F(x) = 1 - \\frac{1}{2}\\,I_{\\frac{\\nu}{\\nu + x^{2}}}\\!\\left(\\frac{\\nu}{2},\\, \\frac{1}{2}\\right), \\quad x \\ge 0 \\quad \\big(F(-x) = 1 - F(x)\\big)',
    media: 'E[X] = 0, \\quad \\nu > 1 \\quad (\\text{no existe si } \\nu \\le 1)',
    varianza: '\\operatorname{Var}(X) = \\frac{\\nu}{\\nu - 2}, \\quad \\nu > 2 \\quad (\\infty \\text{ si } 1 < \\nu \\le 2)',
    fgm: '\\text{No existe en entorno de } 0 \\text{ (cola polinomial)}',
  },
  extras: [
    {
      etiqueta: 'Construcción estocástica',
      tex: 'T = \\frac{Z}{\\sqrt{V / \\nu}} \\sim t(\\nu), \\quad Z \\sim N(0,1) \\perp V \\sim \\chi^2(\\nu)',
    },
    {
      etiqueta: 'Momentos pares',
      tex: 'E[X^{2k}] = \\frac{\\nu^{k}\\,\\Gamma\\!\\left(k + \\frac{1}{2}\\right)\\Gamma\\!\\left(\\frac{\\nu}{2} - k\\right)}{\\sqrt{\\pi}\\,\\Gamma\\!\\left(\\frac{\\nu}{2}\\right)}, \\quad 2k < \\nu',
    },
    {
      etiqueta: 'Exceso de curtosis',
      tex: '\\gamma_2 = \\frac{6}{\\nu - 4}, \\quad \\nu > 4',
    },
    {
      etiqueta: 'Caso Cauchy (ν = 1)',
      tex: 't(1) = \\text{Cauchy}(0, 1), \\quad f(x) = \\frac{1}{\\pi(1 + x^{2})}',
    },
  ],
  propiedades: [],
  notas: [
    'Sólo existen los momentos absolutos $E[|X|^r] < \\infty$ de orden $r < \\nu$; por ello no posee función generadora de momentos.',
    'Con $\\nu = 1$ se obtiene la distribución de Cauchy estándar, cuya media y varianza no existen. Cuando $\\nu \\to \\infty$, por la ley de los grandes números $V/\\nu \\xrightarrow{P} 1$ y $t(\\nu) \\xrightarrow{d} N(0, 1)$.',
  ],
  superficie: { param: 'nu', min: 1, max: 30 },
  calc: {
    densidad: (x, { nu }) => {
      const lnC = lgamma((nu + 1) / 2) - 0.5 * Math.log(nu * Math.PI) - lgamma(nu / 2);
      return Math.exp(lnC - ((nu + 1) / 2) * Math.log(1 + (x * x) / nu));
    },
    rango: ({ nu }) => {
      const r = nu <= 2 ? 25 : 28;
      return [-r, r];
    },
    media: ({ nu }) => (nu > 1 ? 0 : NaN),
    varianza: ({ nu }) => (nu > 2 ? nu / (nu - 2) : nu > 1 ? Infinity : NaN),
  },
};
