import { lgamma } from '../../mate/especiales.js';

/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'f-fisher',
  nombre: 'F de Fisher',
  tipo: 'continua',
  materia: 'probabilidad-avanzada',
  notacion: 'X \\sim F(\\nu_1, \\nu_2)',
  descripcion:
    'Distribución continua en $(0, \\infty)$ definida como el cociente de dos variables chi-cuadrada independientes divididas entre sus respectivos grados de libertad $\\nu_1$ y $\\nu_2$. Es la distribución de referencia para comparar varianzas muestrales, en el análisis de varianza (ANOVA) y en modelos actuariales de cola pesada.',
  alias: ['fisher', 'snedecor', 'f de snedecor', 'razon de varianzas'],
  parametros: [
    { id: 'nu1', tex: '\\nu_1', nombre: 'grados de libertad numerador', restriccion: '\\nu_1 > 0', min: 1, max: 40, paso: 1, valor: 8 },
    { id: 'nu2', tex: '\\nu_2', nombre: 'grados de libertad denominador', restriccion: '\\nu_2 > 0', min: 1, max: 40, paso: 1, valor: 14 },
  ],
  soporte: 'x \\in (0, \\infty)',
  formulas: {
    densidad:
      'f(x) = \\frac{1}{\\operatorname{B}\\!\\left(\\frac{\\nu_1}{2}, \\frac{\\nu_2}{2}\\right)}\\left(\\frac{\\nu_1}{\\nu_2}\\right)^{\\nu_1/2} x^{\\nu_1/2 - 1}\\left(1 + \\frac{\\nu_1}{\\nu_2}\\,x\\right)^{-(\\nu_1 + \\nu_2)/2}',
    fda: 'F(x) = I_{\\frac{\\nu_1 x}{\\nu_1 x + \\nu_2}}\\!\\left(\\frac{\\nu_1}{2},\\, \\frac{\\nu_2}{2}\\right)',
    media: 'E[X] = \\frac{\\nu_2}{\\nu_2 - 2}, \\quad \\nu_2 > 2',
    varianza:
      '\\operatorname{Var}(X) = \\frac{2\\,\\nu_2^{2}\\,(\\nu_1 + \\nu_2 - 2)}{\\nu_1\\,(\\nu_2 - 2)^{2}\\,(\\nu_2 - 4)}, \\quad \\nu_2 > 4',
    fgm: '\\text{No existe (cola derecha polinomial)}',
  },
  extras: [
    {
      etiqueta: 'Construcción estocástica',
      tex: 'X = \\frac{U_1 / \\nu_1}{U_2 / \\nu_2} \\sim F(\\nu_1, \\nu_2), \\quad U_1 \\sim \\chi^2(\\nu_1) \\perp U_2 \\sim \\chi^2(\\nu_2)',
    },
    {
      etiqueta: 'Propiedad recíproca',
      tex: '\\frac{1}{X} \\sim F(\\nu_2, \\nu_1) \\implies F_{1 - \\alpha}(\\nu_1, \\nu_2) = \\frac{1}{F_{\\alpha}(\\nu_2, \\nu_1)}',
    },
    {
      etiqueta: 'Moda',
      tex: '\\text{Moda}(X) = \\frac{\\nu_1 - 2}{\\nu_1}\\cdot\\frac{\\nu_2}{\\nu_2 + 2}, \\quad \\nu_1 > 2',
    },
  ],
  propiedades: [
    {
      letra: 'I',
      detalle: 'X \\sim F(\\nu_1, \\nu_2) \\Rightarrow \\frac{1}{X} \\sim F(\\nu_2, \\nu_1)',
    },
  ],
  notas: [
    'El momento $E[X^k]$ existe únicamente si $2k < \\nu_2$; en particular la media depende sólo de $\\nu_2$ ($\\nu_2 > 2$).',
    'Al reescalar una $F(\\nu_1, \\nu_2)$ se obtiene la familia de Pareto generalizada / Beta prima usada en teoría del riesgo.',
  ],
  superficie: { param: 'nu1', min: 2, max: 30 },
  calc: {
    densidad: (x, { nu1, nu2 }) => {
      if (x <= 0) return nu1 === 2 ? 1 : 0;
      const a = nu1 / 2;
      const b = nu2 / 2;
      const r = nu1 / nu2;
      const lnB = lgamma(a) + lgamma(b) - lgamma(a + b);
      return Math.exp(a * Math.log(r) + (a - 1) * Math.log(x) - (a + b) * Math.log(1 + r * x) - lnB);
    },
    rango: ({ nu2 }) => [0, nu2 > 6 ? 25 : 40],
    media: ({ nu2 }) => (nu2 > 2 ? nu2 / (nu2 - 2) : Infinity),
    varianza: ({ nu1, nu2 }) =>
      nu2 > 4 ? (2 * nu2 * nu2 * (nu1 + nu2 - 2)) / (nu1 * (nu2 - 2) ** 2 * (nu2 - 4)) : Infinity,
  },
};
