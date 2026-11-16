/** @type {import('../tipos.js').Distribucion} */
export default {
  id: 'potencia',
  nombre: 'Potencia',
  tipo: 'continua',
  materia: 'inferencia',
  notacion: 'X \\sim \\text{Pot}(\\alpha, \\theta)',
  descripcion:
    'Familia continua en $(0, \\theta)$ con densidad proporcional a $x^{\\alpha - 1}$. Es la distribución exacta del máximo muestral $X_{(n)} \\sim \\text{Pot}(n, \\theta)$ de $n$ variables independientes $\\text{Uniforme}(0, \\theta)$, ejemplo canónico de estadístico suficiente completo y estimación de máxima verosimilitud en el borde del soporte.',
  alias: ['funcion potencia', 'maximo de uniformes', 'pareto inversa'],
  parametros: [
    { id: 'alpha', tex: '\\alpha', nombre: 'forma (exponente)', restriccion: '\\alpha > 0', min: 0.5, max: 12, paso: 0.5, valor: 3 },
    { id: 'theta', tex: '\\theta', nombre: 'cota superior (escala)', restriccion: '\\theta > 0', min: 0.5, max: 10, paso: 0.5, valor: 2 },
  ],
  soporte: 'x \\in (0, \\theta)',
  formulas: {
    densidad: 'f(x) = \\frac{\\alpha\\,x^{\\alpha - 1}}{\\theta^{\\alpha}}, \\quad 0 < x < \\theta',
    fda: 'F(x) = \\left(\\frac{x}{\\theta}\\right)^{\\alpha}, \\quad 0 \\le x \\le \\theta',
    media: 'E[X] = \\frac{\\alpha}{\\alpha + 1}\\,\\theta',
    varianza: '\\operatorname{Var}(X) = \\frac{\\alpha}{(\\alpha + 1)^{2}(\\alpha + 2)}\\,\\theta^{2}',
  },
  extras: [
    {
      etiqueta: 'Momentos',
      tex: 'E[X^{k}] = \\frac{\\alpha}{\\alpha + k}\\,\\theta^{k}',
    },
    {
      etiqueta: 'Cuantiles (inversa de F)',
      tex: 'F^{-1}(p) = \\theta\\,p^{1/\\alpha}',
    },
    {
      etiqueta: 'Estimador insesgado de varianza mínima (UMVUE)',
      tex: 'X_{(n)} \\sim \\text{Pot}(n, \\theta) \\implies \\hat{\\theta}_{\\text{UMVU}} = \\frac{n + 1}{n}\\,X_{(n)}',
    },
  ],
  propiedades: [
    {
      letra: 'S',
      detalle: 'cX \\sim \\text{Pot}(\\alpha,\\, c\\theta), \\quad c > 0',
    },
    {
      letra: 'X',
      detalle: 'X_i \\perp \\text{Pot}(\\alpha_i, \\theta) \\Rightarrow \\max_i X_i \\sim \\text{Pot}\\!\\Big(\\sum_i \\alpha_i,\\, \\theta\\Big)',
    },
    {
      letra: 'V',
      detalle: 'X = \\theta\\,U^{1/\\alpha}, \\quad U \\sim \\text{Uniforme}(0, 1)',
    },
  ],
  notas: [
    'Con $\\theta = 1$ coincide con el caso $\\text{Beta}(\\alpha, 1)$.',
    'Su recíproca $\\theta / X$ (o $1/X$) sigue una distribución $\\text{Pareto}_I(\\alpha, 1/\\theta)$: la distribución de potencia en $(0, \\theta)$ es la imagen por inversión de la Pareto clásica en $(1/\\theta, \\infty)$.',
  ],
  superficie: { param: 'alpha', min: 1, max: 10 },
  calc: {
    densidad: (x, { alpha, theta }) => {
      if (x <= 0 || x >= theta) return 0;
      return (alpha * Math.pow(x / theta, alpha - 1)) / theta;
    },
    rango: ({ theta }) => [0, theta],
    media: ({ alpha, theta }) => (alpha * theta) / (alpha + 1),
    varianza: ({ alpha, theta }) => (alpha * theta * theta) / ((alpha + 1) ** 2 * (alpha + 2)),
  },
};
